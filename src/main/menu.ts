import { is } from '@electron-toolkit/utils'
import { Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

import { log } from '../common/logger'
import { CommandId, IpcChannel } from '../common/types'

import { config } from './config'

import type { BrowserWindow, MessageBoxOptions } from 'electron'
import type { UpdateInfo } from 'electron-updater'

export default class MenuBuilder {
  mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  buildMenu(): Menu {
    if (is.dev) {
      this.setupDevelopmentEnvironment()
    }

    const template = this.buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: (): void => {
            this.mainWindow.webContents.inspectElement(x, y)
          }
        }
      ]).popup({ window: this.mainWindow })
    })
  }

  buildDefaultTemplate(): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] {
    const templateDefault = [
      {
        label: 'ファイル',
        submenu: [
          {
            label: 'ファイルを開く',
            accelerator: 'Ctrl+O',
            commandId: CommandId.openFile,
            click: async (): Promise<void> => {
              try {
                const result = await dialog.showOpenDialog(this.mainWindow, {
                  properties: ['openFile', 'showHiddenFiles'],
                  title: 'ファイルを選択',
                  filters: [
                    {
                      name: 'ログファイル',
                      extensions: ['txt', 'log']
                    },
                    {
                      name: '全てのファイル',
                      extensions: ['*']
                    }
                  ]
                })

                if (result.canceled) {
                  return
                }

                const filePaths = config.get('renderer.filePaths') as string[]

                if (filePaths.includes(result.filePaths[0])) {
                  return
                }

                if (filePaths) {
                  filePaths.push(result.filePaths[0])
                  config.set('renderer.filePaths', filePaths)
                } else {
                  config.set('renderer.filePaths', [result.filePaths[0]])
                }

                this.mainWindow.webContents.send(IpcChannel.sendToRenderer.newFile)
              } catch (err) {
                console.error('ファイル選択でエラー', err)
              }
            }
          },
          {
            label: '&ファイルを閉じる',
            accelerator: 'Ctrl+W',
            commandId: CommandId.closeFile,
            click: (): void => {
              this.mainWindow.webContents.send(IpcChannel.sendToRenderer.closeFile)
            }
          },
          {
            label: '&終了',
            accelerator: 'Ctrl+Q',
            commandId: CommandId.quitApp,
            click: (): void => {
              this.mainWindow.close()
            }
          }
        ]
      },
      {
        label: '&編集',
        submenu: [
          {
            label: '&検索',
            accelerator: 'Ctrl+F',
            commandId: CommandId.find,
            click: (): void => {
              this.mainWindow.webContents.send(IpcChannel.sendToRenderer.find)
            }
          }
        ]
      },
      {
        label: '&表示',
        submenu: [
          {
            label: '&フルスクリーン',
            accelerator: 'F11',
            commandId: CommandId.fullscreen,
            click: (): void => {
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
            }
          },
          {
            label: '&Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: (): void => {
              this.mainWindow.webContents.toggleDevTools()
            }
          },
          ...(is.dev
            ? [
                {
                  label: '&再読み込み',
                  accelerator: 'Ctrl+R',
                  click: (): void => {
                    this.mainWindow.webContents.reload()
                  }
                }
              ]
            : [])
        ]
      },
      {
        label: '&ヘルプ',
        submenu: [
          {
            label: '&更新確認',
            commandId: CommandId.checkUpdate,
            click: (): void => {
              log.info('更新確認')
              this.mainWindow.webContents.send(IpcChannel.sendToRenderer.checkUpdate, true)
              autoUpdater.checkForUpdates()

              // アップデートがなかった（最新版だった）
              autoUpdater.once('update-not-available', async (info: UpdateInfo) => {
                log.info('Update not avaliable', info)
                this.mainWindow.webContents.send(IpcChannel.sendToRenderer.checkUpdate, false)
                const dialogOpts: MessageBoxOptions = {
                  type: 'info',
                  buttons: ['OK'],
                  message: '現在入手可能な更新はありません。'
                }
                dialog.showMessageBox(this.mainWindow, dialogOpts)
              })
              // アップデートのダウンロードが完了
              autoUpdater.once('update-downloaded', async () => {
                log.info('Update downloaded')
                this.mainWindow.webContents.send(IpcChannel.sendToRenderer.checkUpdate, false)
                const dialogOpts: MessageBoxOptions = {
                  type: 'info',
                  buttons: ['更新して再起動', 'あとで'],
                  message: 'アップデート',
                  detail: '新しいバージョンをダウンロードしました。再起動して更新を適用しますか？',
                  cancelId: 2
                }

                // ダイアログを表示しすぐに再起動するか確認
                const returnValue = await dialog.showMessageBox(this.mainWindow, dialogOpts)
                log.info(returnValue)
                if (returnValue.response === 0) {
                  autoUpdater.quitAndInstall()
                }
              })
              autoUpdater.once('error', (err) => {
                log.error('autoUpdator-error', err)
                this.mainWindow.webContents.send(IpcChannel.sendToRenderer.checkUpdate, false)
                this.mainWindow.webContents.send(
                  IpcChannel.sendToRenderer.errorMessage,
                  `更新の確認中にエラーが発生しました。\n${err}`
                )
              })
            }
          }
        ]
      }
    ]

    return templateDefault
  }
}
