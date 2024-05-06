import { useEffect, useState } from 'react'

import { useAppStore } from '@renderer/store'

import type { MenuType } from '@renderer/types'

type UseAnchorResult = {
  open: boolean
  element: HTMLElement
  closeMenu: () => void
  clickEvent: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function useAnchor(menu: MenuType): UseAnchorResult {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null)
  const menuSelected = useAppStore((state) => state.menuSelected)
  const setMenuSelected = useAppStore((state) => state.setMenuSelected)
  const open = Boolean(anchorEl)

  const closeMenu = (): void => {
    setAnchorEl(null)
    setMenuSelected(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (menuSelected === menu) {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    } else {
      setAnchorEl(event.currentTarget)
    }
    setMenuSelected(menu)
  }

  useEffect(() => {
    if (menu !== menuSelected) {
      setAnchorEl(null)
    }
  }, [menuSelected])

  return {
    open: open,
    element: anchorEl,
    closeMenu: closeMenu,
    clickEvent: handleClick
  } as UseAnchorResult
}
