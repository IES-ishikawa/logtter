import type { ReactNode } from 'react'

import { MenuList, Paper } from '@mui/material'
import { MenuPaperWidth } from '@renderer/consts'

type MenuBackgroundProps = {
  children: ReactNode | ReactNode[]
}

export function MenuBackground({ children }: MenuBackgroundProps): JSX.Element {
  return (
    <Paper sx={{ m: 0, width: MenuPaperWidth, boxShadow: 0 }}>
      <MenuList disablePadding>{children}</MenuList>
    </Paper>
  )
}
