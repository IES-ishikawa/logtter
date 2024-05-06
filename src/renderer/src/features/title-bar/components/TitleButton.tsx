import { IconButton } from '@mui/material'

import type { IconButtonProps } from '@mui/material'

export function TitleButton({ children, sx, ...other }: IconButtonProps): JSX.Element {
  const titleSx = {
    ...sx,
    borderRadius: 0,
    '-webkit-app-region': 'no-drag'
  }
  return (
    <IconButton sx={titleSx} {...other}>
      {children}
    </IconButton>
  )
}
