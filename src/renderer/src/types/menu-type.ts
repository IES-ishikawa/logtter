export const MenuType = {
  file: 'ファイル',
  edit: '編集',
  display: '表示',
  help: 'ヘルプ'
} as const

export type MenuType = (typeof MenuType)[keyof typeof MenuType]
