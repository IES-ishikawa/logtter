import type { ReactNode } from 'react'

import { Box, CssBaseline } from '@mui/material'

import { TitleBar } from './features'

type LayoutProps = {
  children: ReactNode | ReactNode[]
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <CssBaseline />
      <Box display="flex" flexDirection="column" height="100%">
        <TitleBar />
        <Box component="main" height="100%">
          {children}
        </Box>
      </Box>
    </>
  )
}
