import { Divider, Typography } from '@mui/material'

type SettingHeadProps = {
  label: string
}

export function SettingHead({ label }: SettingHeadProps): JSX.Element {
  return (
    <>
      <Typography sx={{ marginY: 2 }} variant="h5">
        {label}
      </Typography>
      <Divider />
    </>
  )
}
