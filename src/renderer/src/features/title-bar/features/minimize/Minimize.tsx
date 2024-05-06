import { useCallback } from 'react'

import { LineHorizontal120Regular } from '@fluentui/react-icons'

import { TitleButton } from '../../components'

export function Minimize(): JSX.Element {
  const handleClick = useCallback(() => window.api.sendToMain.minimize(), [])
  return (
    <TitleButton onClick={handleClick} sx={{ ml: 2 }}>
      <LineHorizontal120Regular />
    </TitleButton>
  )
}
