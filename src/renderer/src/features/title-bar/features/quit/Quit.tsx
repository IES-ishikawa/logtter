import { useCallback } from 'react'

import { Dismiss24Regular } from '@fluentui/react-icons'

import { TitleButton } from '../../components'

export function Quit(): JSX.Element {
  const handleClick = useCallback(() => window.api.sendToMain.quit(), [])
  return (
    <TitleButton onClick={handleClick}>
      <Dismiss24Regular />
    </TitleButton>
  )
}
