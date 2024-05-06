import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import { FontSize, Theme } from './features'

type SettingDialogProps = {
  open: boolean
  onClose: () => void
}

export function SettingDialog({ open, onClose }: SettingDialogProps): JSX.Element {
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>設定</DialogTitle>
        <DialogContent dividers>
          <Container>
            <Theme />
            <FontSize />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" size="large">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
