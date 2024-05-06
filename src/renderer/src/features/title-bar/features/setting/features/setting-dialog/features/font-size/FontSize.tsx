import type { ChangeEvent } from 'react'

import { InputAdornment } from '@mui/material'
import { NumericField } from '@renderer/components'
import { useAppStore } from '@renderer/store'

import { SettingItem } from '../../components/SettingItem'

export function FontSize(): JSX.Element {
  const setting = useAppStore((state) => state.setting)
  const setSetting = useAppStore((state) => state.setSetting)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (!isNaN(Number(e.target.value))) {
      setSetting({
        ...setting,
        fontSize: Number(e.target.value)
      })
    }
  }

  return (
    <>
      <SettingItem label="フォントサイズ">
        <NumericField
          variant="outlined"
          fullWidth
          value={setting.fontSize}
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="start">px</InputAdornment>
          }}
        />
      </SettingItem>
    </>
  )
}
