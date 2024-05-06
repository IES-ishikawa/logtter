import { useEffect } from 'react'

import { Dismiss16Regular } from '@fluentui/react-icons'
import { IconButton } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar, useSnackbar } from 'notistack'

import type { SnackbarKey } from 'notistack'

export function ErrorHandler(): JSX.Element {
  const CloseAction = ({ snackbarKey }: { snackbarKey: SnackbarKey }): JSX.Element => {
    const { closeSnackbar } = useSnackbar()
    return (
      <IconButton sx={{ color: 'white' }} onClick={() => closeSnackbar(snackbarKey)}>
        <Dismiss16Regular />
      </IconButton>
    )
  }
  useEffect(() => {
    window.api.sendToRenderer.errorMessage((message) => {
      enqueueSnackbar(message, {
        variant: 'error',
        style: { whiteSpace: 'pre-line' }
      })
    })
  }, [])
  return <SnackbarProvider maxSnack={3} action={(key: SnackbarKey) => <CloseAction snackbarKey={key} />} />
}
