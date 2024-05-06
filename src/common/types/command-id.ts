export const CommandId = {
  openFile: 11,
  closeFile: 12,
  quitApp: 13,
  find: 21,
  fullscreen: 31,
  checkUpdate: 41
} as const

export type CommandId = (typeof CommandId)[keyof typeof CommandId]
