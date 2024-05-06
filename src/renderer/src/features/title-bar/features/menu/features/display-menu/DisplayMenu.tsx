import { CommandId } from '@common/types'
import { Menu } from '@mui/material'
import { MenuType } from '@renderer/types'

import { MenuBackground, MenuButton, MenuContent } from '../../components'
import { useAnchor } from '../../hooks'

import type { MenuContentProps } from '../../types'

export function DisplayMenu(): JSX.Element {
  const anchors = useAnchor(MenuType.display)
  const contents: MenuContentProps[] = [
    {
      label: 'フルスクリーン',
      accelerate: 'F11',
      commandId: CommandId.fullscreen,
      closeMenu: anchors.closeMenu
    }
  ]

  return (
    <>
      <MenuButton label={MenuType.display} onClick={anchors.clickEvent} />
      <Menu anchorEl={anchors.element} open={anchors.open} onClose={anchors.closeMenu}>
        <MenuBackground>
          {contents.map((c, idx) => (
            <MenuContent key={idx} {...c} />
          ))}
        </MenuBackground>
      </Menu>
    </>
  )
}
