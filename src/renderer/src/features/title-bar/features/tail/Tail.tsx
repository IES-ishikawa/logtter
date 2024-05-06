import { useCallback } from 'react'

import { FormControlLabel, FormLabel, Switch } from '@mui/material'
import { useAppStore } from '@renderer/store'

export function Tail(): JSX.Element {
  const tail = useAppStore((state) => state.tail)
  const setTail = useAppStore((state) => state.setTail)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTail(e.target.checked)
    },
    [tail]
  )
  return (
    <FormControlLabel
      sx={{ '-webkit-app-region': 'no-drag' }}
      control={<Switch checked={tail} onChange={handleChange} />}
      label={<FormLabel>Tail</FormLabel>}
    />
  )
}
