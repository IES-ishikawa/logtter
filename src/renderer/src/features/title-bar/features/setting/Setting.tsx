import { useCallback, useEffect, useState } from 'react'

import { Settings24Regular } from '@fluentui/react-icons'
import { useAppStore } from '@renderer/store'

import { TitleButton } from '../../components'

import { SettingDialog } from './features'

export function Setting(): JSX.Element {
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const setting = useAppStore((state) => state.setting)

  useEffect(() => {
    console.log(setting)
    window.api.sendToMain.setting(setting)
  }, [setting])

  return (
    <>
      <TitleButton onClick={handleClick}>
        <Settings24Regular />
      </TitleButton>
      <SettingDialog open={open} onClose={handleClose} />
    </>
  )
}
