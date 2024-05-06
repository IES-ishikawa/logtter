import type { ContextBridgeApi } from './context-bridge-api'
import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ContextBridgeApi
  }
}
