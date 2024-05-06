export type StoreType = {
  window: {
    size: {
      width: number
      height: number
    }
    pos: {
      x: number
      y: number
    }
    maximized: boolean
  }
  renderer: {
    filePaths: string[]
    settings: {
      theme: string
      fontSize: number
    }
  }
}
