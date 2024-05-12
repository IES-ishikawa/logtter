import { promises, statSync, watch } from 'fs'
import path from 'path'

import { BrowserWindow, Menu, ipcMain } from 'electron'
import * as Encoding from 'encoding-japanese'

import { IpcChannel } from '../common/types'

import { config } from './config'

import type { FileItem } from '../common/types'
import type { FSWatcher } from 'fs'

const fileWatchers: { [key: string]: FSWatcher } = {}

/**
 * IPCチャンネルの登録
 * @param mainWindow
 */
export function registChannel(mainWindow: BrowserWindow): void {
  ipcMain.on(IpcChannel.sendToMain.setting, (_, setting) => {
    config.set('renderer.settings', setting)
  })

  ipcMain.on(IpcChannel.sendToMain.removeWatch, (_, filePath) => {
    const watcher = fileWatchers[filePath]
    if (watcher) {
      watcher.close()
      delete fileWatchers[filePath]
    }
  })

  ipcMain.on(IpcChannel.sendToMain.quit, () => mainWindow.close())
  ipcMain.on(IpcChannel.sendToMain.maximize, () => mainWindow.maximize())
  ipcMain.on(IpcChannel.sendToMain.minimize, () => mainWindow.minimize())
  ipcMain.on(IpcChannel.sendToMain.restore, () => mainWindow.restore())

  ipcMain.on(IpcChannel.sendToMain.menuEvent, (event, commandId: number) => {
    const item = getMenuItemByCommandId(commandId, Menu.getApplicationMenu())
    if (item) item.click(undefined, BrowserWindow.fromWebContents(event.sender), event.sender)
  })

  ipcMain.handle(IpcChannel.invoke.closeFile, (_, filePath) => {
    const filePaths: string[] = config.get('renderer.filePaths')
    const newPaths = filePaths.filter((f) => f !== filePath)
    config.set('renderer.filePaths', newPaths)
    const watcher = fileWatchers[filePath]
    if (watcher) {
      watcher.close()
      delete fileWatchers[filePath]
    }

    return newPaths.map((f) => ({ filePath: f, fileName: path.basename(f) }) as FileItem)
  })

  ipcMain.handle(IpcChannel.invoke.setting, () => config.get('renderer.settings'))
  ipcMain.handle(IpcChannel.invoke.dragDropFiles, (_, arg: string[]) => {
    const filePaths = config.get('renderer.filePaths') as string[]
    const errorPaths: string[] = []
    arg.forEach((path) => {
      try {
        const state = statSync(path)
        if (state.isDirectory()) {
          errorPaths.push(path)
        } else if (!filePaths.includes(path)) {
          filePaths.push(path)
        }
      } catch (err) {
        console.error(err)
        if (!errorPaths.includes(path)) {
          errorPaths.push(path)
        }
      }
    })
    if (errorPaths.length > 0) {
      const message = `以下の読み込みに失敗しました。\n
			${errorPaths.join('\n')}`
      mainWindow.webContents.send(IpcChannel.sendToRenderer.errorMessage, message)
    }
    config.set('renderer.filePaths', filePaths)
    return filePaths.map((f) => ({ filePath: f, fileName: path.basename(f) }) as FileItem)
  })

  ipcMain.handle(IpcChannel.invoke.files, () => {
    const filePaths: string[] = config.get('renderer.filePaths')
    return filePaths.map((f) => ({ filePath: f, fileName: path.basename(f) }) as FileItem)
  })

  ipcMain.handle(IpcChannel.invoke.watchFile, async (_, filePath) => {
    const encode = async (): Promise<string> => {
      const content = await promises.readFile(filePath)
      const uninode = Encoding.convert(content, 'UNICODE')
      return Encoding.codeToString(uninode)
    }

    fileWatchers[filePath] = watch(filePath, async () =>
      mainWindow.webContents.send(IpcChannel.sendToRenderer.fileContents, await encode())
    )
    return await encode()
  })

  if (config.get('window.maximized')) {
    mainWindow.maximize()
  }

  ipcMain.handle(IpcChannel.invoke.initMaximize, () => {
    return config.get('window.maximized')
  })

  ipcMain.handle(IpcChannel.invoke.customHighlight, () => {
    return config.get('renderer.customHighlights')
  })
}

function getMenuItemByCommandId(commandId: number, menu: Electron.Menu): Electron.MenuItem {
  if (!menu) {
    return undefined
  }

  for (const item of menu.items) {
    if (item.submenu) {
      const submenuItem = getMenuItemByCommandId(commandId, item.submenu)
      if (submenuItem) {
        return submenuItem
      }
    } else if (item.commandId === commandId) {
      return item
    }
  }

  return undefined
}
