import { Divider, ListItemText, MenuItem, Typography } from '@mui/material'

import type { MenuContentProps } from '../types'

export function MenuContent({
  label,
  accelerate,
  divide,
  commandId,
  disabled,
  closeMenu,
  clickEvent
}: MenuContentProps): JSX.Element {
  const handleClick = (): void => {
    window.api.sendToMain.menuEvent(commandId)
    closeMenu()
  }
  return (
    <>
      <MenuItem disabled={disabled} onClick={clickEvent ?? handleClick}>
        <ListItemText>{label}</ListItemText>
        <Typography variant="body2" color="text.secondary">
          {accelerate}
        </Typography>
      </MenuItem>
      {divide && <Divider />}
    </>
  )
}
