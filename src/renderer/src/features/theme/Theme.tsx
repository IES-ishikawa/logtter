import type { ReactNode } from 'react'

import { ThemeProvider, createTheme } from '@mui/material'
import { useThemeMode } from '@renderer/hooks'

type ThemeProps = {
  children: ReactNode | ReactNode[]
}

export function Theme({ children }: ThemeProps): JSX.Element {
  const themeMode = useThemeMode()
  const theme = createTheme({
    palette: {
      mode: themeMode
    }
  })
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
