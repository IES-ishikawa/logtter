//IPCチャンネル種
export const IpcChannel = {
  //メインプロセスへ送るチャンネル種
  sendToMain: {
    menuEvent: 'menu-event',
    removeWatch: 'remove-watch',
    setting: 'setting',
    quit: 'quit',
    maximize: 'maximize',
    minimize: 'minimize',
    restore: 'restore'
  },
  //レンダラープロセスへ送るチャンネル種
  sendToRenderer: {
    newFile: 'new-file',
    errorMessage: 'error-message',
    find: 'find',
    closeFile: 'close-file',
    fileContents: 'file-contents',
    maximized: 'maximized',
    unmaximized: 'unmaximized',
    checkUpdate: 'check-update'
  },
  //レンダラープロセスから呼び出すチャンネル種
  invoke: {
    initMaximize: 'init-maximize',
    closeFile: 'close-file',
    watchFile: 'watch-file',
    files: 'files',
    setting: 'setting',
    dragDropFiles: 'drag-drop-files'
  }
} as const

//IPCチャンネルエイリアス
export type IpcChannel = (typeof IpcChannel)[keyof typeof IpcChannel]
