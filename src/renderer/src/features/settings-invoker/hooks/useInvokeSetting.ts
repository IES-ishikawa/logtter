import { useEffect } from 'react'

import { useAppStore } from '@renderer/store'

export function useInvokeSetting(): void {
  const setSetting = useAppStore((state) => state.setSetting)
  useEffect(() => {
    const invoke = async (): Promise<void> => {
      const setting = await window.api.invoke.setting()
      setSetting(setting)
    }
    invoke()
  }, [])
}
