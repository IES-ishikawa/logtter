import { ipcRenderer } from 'electron'

import { IpcChannel } from '../common/types'

import type { CommandId, CustomHighlight, FileItem, Setting } from '../common/types'

/**
 * IPC通信
 */
export class ContextBridgeApi {
  public static readonly KEY = 'api'

  // renderer ⇒ main
  public sendToMain = new IpcSendToMain()

  // main ⇒ renderer
  public sendToRenderer = new IpcSendToRenderer()

  // renderer ⇔ main
  public invoke = new IpcInvoke()
}

/**
 * メインプロセスへ送る関数クラス
 */
class IpcSendToMain {
  /**
   * メニューイベント
   * @param commandId コマンドID
   * @returns
   */
  public menuEvent = (commandId: CommandId): void => ipcRenderer.send(IpcChannel.sendToMain.menuEvent, commandId)

  /**
   * 監視の取消し
   * @param filePath ファイルパス
   * @returns
   */
  public removeWatch = (filePath: string): void => ipcRenderer.send(IpcChannel.sendToMain.removeWatch, filePath)

  /**
   * 設定をconfigファイルへ適用
   * @param setting 設定
   * @returns
   */
  public setting = (setting: Setting): void => ipcRenderer.send(IpcChannel.sendToMain.setting, setting)

  /**
   * アプリの終了
   * @returns
   */
  public quit = (): void => ipcRenderer.send(IpcChannel.sendToMain.quit)

  /**
   * 最大化
   * @returns
   */
  public maximize = (): void => ipcRenderer.send(IpcChannel.sendToMain.maximize)

  /**
   * 最小化
   * @returns
   */
  public minimize = (): void => ipcRenderer.send(IpcChannel.sendToMain.minimize)

  /**
   * 復元
   * @returns
   */
  public restore = (): void => ipcRenderer.send(IpcChannel.sendToMain.restore)
}

/**
 * レンダラープロセスへ送る関数クラス
 */
class IpcSendToRenderer {
  /**
   * ファイルを開く
   * @param listener コールバック関数
   * @returns
   */
  public newFile = (listener: () => void): void => {
    this.listeners[IpcChannel.sendToRenderer.newFile] = ipcRenderer.on(IpcChannel.sendToRenderer.newFile, () =>
      listener()
    )
  }

  /**
   * エラーメッセージ
   * @param listener コールバック関数
   */
  public errorMessage = (listener: (message: string) => void): void => {
    this.listeners[IpcChannel.sendToRenderer.errorMessage] = ipcRenderer.on(
      IpcChannel.sendToRenderer.errorMessage,
      (_, arg) => listener(arg)
    )
  }

  /**
   * 検索
   * @param listener コールバック関数
   */
  public find = (listener: () => void): void => {
    this.listeners[IpcChannel.sendToRenderer.find] = ipcRenderer.on(IpcChannel.sendToRenderer.find, () => listener())
  }

  /**
   * ファイルを閉じる
   * @param listener コールバック関数
   */
  public closeFile = (listener: () => void): void => {
    this.listeners[IpcChannel.sendToRenderer.closeFile] = ipcRenderer.on(IpcChannel.sendToRenderer.closeFile, () =>
      listener()
    )
  }

  /**
   * ファイルの内容
   * @param listener コールバック関数
   * @returns
   */
  public fileContents = (listener: (text: string) => void): void => {
    this.listeners[IpcChannel.sendToRenderer.fileContents] = ipcRenderer.on(
      IpcChannel.sendToRenderer.fileContents,
      (_, arg) => listener(arg)
    )
  }

  /**
   * 最大化
   * @param listener コールバック関数
   * @returns
   */
  public maximized = (listener: () => void): void => {
    this.listeners[IpcChannel.sendToRenderer.maximized] = ipcRenderer.on(IpcChannel.sendToRenderer.maximized, () =>
      listener()
    )
  }

  /**
   * 最大化を解除
   * @param listener コールバック関数
   * @returns
   */
  public unmaximized = (listener: () => void): void => {
    this.listeners[IpcChannel.sendToRenderer.unmaximized] = ipcRenderer.on(IpcChannel.sendToRenderer.unmaximized, () =>
      listener()
    )
  }

  /**
   * 更新フラグの切り替え
   * @param listener コールバック関数
   */
  public checkUpdate = (listener: (checking: boolean) => void): void => {
    this.listeners[IpcChannel.sendToRenderer.checkUpdate] = ipcRenderer.on(
      IpcChannel.sendToRenderer.checkUpdate,
      (_, arg) => listener(arg)
    )
  }

  /**
   * リスナーの削除
   * @param channel
   */
  public removeListener = (channel: string): void => {
    const ipc = this.listeners[channel]
    if (ipc) {
      ipc.removeAllListeners(channel)
      delete this.listeners[channel]
    }
  }

  /**
   * リスナーの保持リスト
   */
  private listeners: { [channel: string]: Electron.IpcRenderer } = {}
}

/**
 * レンダラープロセスから呼び出す関数クラス
 */
class IpcInvoke {
  /**
   * configファイル(前回値)から最大化されていたかを取得
   * @returns 最大化であればTrue
   */
  public initMaximize = (): Promise<boolean> => ipcRenderer.invoke(IpcChannel.invoke.initMaximize)

  /**
   * ファイルを閉じる
   * @param filePath ファイルパス
   * @returns 最新のファイル情報リスト
   */
  public closeFile: (filePath: string) => Promise<FileItem[]> = (filePath: string) =>
    ipcRenderer.invoke(IpcChannel.invoke.closeFile, filePath)

  /**
   * ファイルの監視の開始とファイル内容の取得
   * @param filePath ファイルパス
   * @returns ファイルの内容
   */
  public watchFile: (filePath: string) => Promise<string> = (filePath: string) =>
    ipcRenderer.invoke(IpcChannel.invoke.watchFile, filePath)

  /**
   * configファイルからファイル情報リストの取得
   * @returns ファイル情報リスト
   */
  public files: () => Promise<FileItem[]> = () => ipcRenderer.invoke(IpcChannel.invoke.files)

  /**
   * configファイルから設定の取得
   * @returns 設定
   */
  public setting: () => Promise<Setting> = () => ipcRenderer.invoke(IpcChannel.invoke.setting)

  /**
   * アプリにドラッグ＆ドロップされたファイルを設定ファイルに記述
   * @param filePaths アプリにどらアプリにドラッグ＆ドロップされたファイルパスのリスト
   * @returns 最新のファイル情報のリスト
   */
  public dragDropFiles: (filePaths: string[]) => Promise<FileItem[]> = (filePaths: string[]) =>
    ipcRenderer.invoke(IpcChannel.invoke.dragDropFiles, filePaths)

  /**
   * configファイルからハイライト情報リストの取得
   * @returns ハイライト情報リスト
   */
  public customHighlights: () => Promise<CustomHighlight[]> = () =>
    ipcRenderer.invoke(IpcChannel.invoke.customHighlight)
}
