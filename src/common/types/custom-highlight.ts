export type CustomHighlight = {
  name: string
  fontColor?: string
  fontStyle?: string
  pattern: RegPattern[]
}

export type RegPattern = {
  reg: string
  flag: string
}
