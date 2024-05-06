import { useCallback, useEffect, useState } from 'react'

import { Maximize24Regular, SquareMultiple24Regular } from '@fluentui/react-icons'
import { wrapPromise } from '@renderer/utils'

import { TitleButton } from '../../components'

const promise = wrapPromise<boolean>(window.api.invoke.initMaximize())

export function Maximize(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(promise())

  useEffect(() => {
    window.api.sendToRenderer.maximized(() => setIsMaximized(true))
    window.api.sendToRenderer.unmaximized(() => setIsMaximized(false))
  }, [])

  const handleClick = useCallback(() => {
    if (isMaximized) {
      window.api.sendToMain.restore()
    } else {
      window.api.sendToMain.maximize()
    }
    setIsMaximized(!isMaximized)
  }, [isMaximized])

  return (
    <TitleButton onClick={handleClick}>{isMaximized ? <SquareMultiple24Regular /> : <Maximize24Regular />}</TitleButton>
  )
}
