import { Suspense } from 'react'

import { AppBar, Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useThemeMode } from '@renderer/hooks'

import { Logo } from './components'
import { Maximize, Menu, Minimize, Quit, Setting, Tail, CheckingUpdate } from './features'

import type { SxProps } from '@mui/material'

export function TitleBar(): JSX.Element {
  const themeMode = useThemeMode()

  const sx: SxProps =
    themeMode === 'light'
      ? {
          bgcolor: grey[300]
        }
      : {}

  return (
    <AppBar
      sx={{
        position: 'sticky',
        zIndex: (theme) => theme.zIndex.tooltip + 1,
        top: 0,
        overflow: 'hidden',
        '-webkit-app-region': 'drag',
        padding: 0,
        margin: 0,
        ...sx
      }}
    >
      <Box display="flex" alignItems="center">
        <Logo />
        <Menu />

        <Box display="flex" alignItems="center" ml="auto">
          <CheckingUpdate />
          <Tail />
          <Setting />
          <Minimize />
          <Suspense>
            <Maximize />
          </Suspense>
          <Quit />
        </Box>
      </Box>
    </AppBar>
  )
}
