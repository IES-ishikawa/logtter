import { create } from 'zustand'

import type { MenuType } from './types'
import type { FileItem, Setting } from '@common/types'

type State = {
  fileItems: FileItem[]
  setting: Setting
  tail: boolean
  tabSelected: number
  menuSelected: MenuType
  checkingUpdate: boolean
}

type Action = {
  setFileItems: (fileItems: FileItem[]) => void
  setSetting: (setting: Setting) => void
  setTail: (tail: boolean) => void
  setTabSelected: (tabSelected: number) => void
  setMenuSelected: (menu: MenuType) => void
  setCheckingUpdate: (checking: boolean) => void
}

export const useAppStore = create<State & Action>((set) => ({
  fileItems: [],
  setting: null,
  tail: false,
  tabSelected: 0,
  menuSelected: null,
  checkingUpdate: false,
  setFileItems: (fileItems): void => set({ fileItems: fileItems }),
  setSetting: (setting: Setting): void => set({ setting: setting }),
  setTail: (tail: boolean): void => set({ tail: tail }),
  setTabSelected: (tabSelected: number): void => set({ tabSelected: tabSelected }),
  setMenuSelected: (menu: MenuType): void => set({ menuSelected: menu }),
  setCheckingUpdate: (checking: boolean): void => set({ checkingUpdate: checking })
}))
