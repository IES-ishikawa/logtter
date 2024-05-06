import { statSync } from 'fs'
import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow } from 'electron'

import { IpcChannel } from '../common/types'

import { config } from './config'
import MenuBuilder from './menu'
import { registChannel } from './regist-channel'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

if (process.argv.length >= 2) {
  const filePaths = (config.get('renderer.filePaths') ?? []) as string[]
  for (let i = 1; i < process.argv.length + 1; i++) {
    try {
      const filePath = process.argv[i]
      if (!filePaths.includes(filePath)) {
        const state = statSync(filePath)
        if (!state.isDirectory()) {
          filePaths.push(filePath)
        }
      }
    } catch {
      /* empty */
    }
  }
  config.set('renderer.filePaths', filePaths)
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: config.get('window.size.width'),
    height: config.get('window.size.height'),
    x: config.get('window.pos.x'),
    y: config.get('window.pos.y'),
    show: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev
    }
  })

  //IPCチャンネル登録
  registChannel(mainWindow)
  mainWindow.setMinimumSize(400, 270)

  if (config.get('window.maximized')) {
    mainWindow.maximize()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // ウィンドウが閉じられる直前に実行
  mainWindow.on('close', () => {
    const { x, y, width, height } = mainWindow.getNormalBounds()
    config.set({
      window: {
        size: {
          width: width,
          height: height
        },
        pos: {
          x: x,
          y: y
        },
        maximized: mainWindow.isMaximized()
      }
    })
  })

  mainWindow.addListener('maximize', () => {
    mainWindow.webContents.send(IpcChannel.sendToRenderer.maximized)
  })
  mainWindow.addListener('unmaximize', () => mainWindow.webContents.send(IpcChannel.sendToRenderer.unmaximized))
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
