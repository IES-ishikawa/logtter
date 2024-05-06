import type { ReactNode } from 'react'

import { Divider, Grid, Typography } from '@mui/material'

type SettingBaseProps = {
  label: string
  children: ReactNode | ReactNode[]
}

export function SettingItem({ label, children }: SettingBaseProps): JSX.Element {
  return (
    <>
      <Grid container marginY={2}>
        <Grid item xs={5}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={7}>
          {children}
        </Grid>
      </Grid>
      <Divider />
    </>
  )
}
