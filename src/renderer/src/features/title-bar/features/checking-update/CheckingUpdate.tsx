import { useEffect } from 'react'

import { Box, CircularProgress, FormLabel } from '@mui/material'
import { useAppStore } from '@renderer/store'

export function CheckingUpdate(): JSX.Element {
  const checking = useAppStore((state) => state.checkingUpdate)
  const setChecking = useAppStore((state) => state.setCheckingUpdate)

  useEffect(() => {
    window.api.sendToRenderer.checkUpdate((checking) => {
      setChecking(checking)
    })
  }, [])

  return (
    <>
      {checking && (
        <>
          <Box display={'flex'} alignItems={'center'} mr={3}>
            <FormLabel sx={{ mr: 1 }}>更新確認中</FormLabel>
            <CircularProgress size="1rem" />
          </Box>
        </>
      )}
    </>
  )
}
