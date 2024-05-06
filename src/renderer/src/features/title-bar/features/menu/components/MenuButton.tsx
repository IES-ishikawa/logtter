import { Box, Button, FormLabel } from '@mui/material'

type MenuButtonProps = {
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function MenuButton({ label, onClick }: MenuButtonProps): JSX.Element {
  return (
    <Box sx={{ ml: 2, '-webkit-app-region': 'no-drag' }}>
      <Button onClick={onClick}>
        <FormLabel>{label}</FormLabel>
      </Button>
    </Box>
  )
}
