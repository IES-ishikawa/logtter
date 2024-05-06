import { useMediaQuery } from '@mui/material'

import { useAppStore } from '../store'

export function useThemeMode(): 'light' | 'dark' {
  const mode = useAppStore((state) => state.setting?.theme)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  return mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode
}
