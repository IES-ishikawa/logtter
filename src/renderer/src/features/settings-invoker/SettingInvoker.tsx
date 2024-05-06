import type { ReactNode } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { useAppStore } from '@renderer/store'

import { useInvokeSetting } from './hooks'

type SettingsInvokerProps = {
  children: ReactNode | ReactNode[]
}

export function SettingInvoker({ children }: SettingsInvokerProps): JSX.Element {
  const setting = useAppStore((state) => state.setting)
  useInvokeSetting()
  return (
    <>
      {setting ? (
        children
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `100%`
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  )
}
