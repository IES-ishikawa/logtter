import { MenuItem, Select } from '@mui/material'
import { useAppStore } from '@renderer/store'

import { SettingItem } from '../../components/SettingItem'

import type { ThemeMode } from '@common/types'
import type { SelectChangeEvent } from '@mui/material'

export function Theme(): JSX.Element {
  const setting = useAppStore((state) => state.setting)
  const setSetting = useAppStore((state) => state.setSetting)

  const handleChange = (e: SelectChangeEvent<ThemeMode>): void => {
    setSetting({
      ...setting,
      theme: e.target.value as ThemeMode
    })
  }
  return (
    <>
      <SettingItem label="テーマ">
        <Select fullWidth value={setting.theme} onChange={handleChange}>
          <MenuItem value="system">システム設定</MenuItem>
          <MenuItem value="light">ライト</MenuItem>
          <MenuItem value="dark">ダーク</MenuItem>
        </Select>
      </SettingItem>
    </>
  )
}
