import { CommandId } from '@common/types'
import { Menu } from '@mui/material'
import { MenuType } from '@renderer/types'

import { MenuBackground, MenuButton, MenuContent } from '../../components'
import { useAnchor } from '../../hooks'

import type { MenuContentProps } from '../../types'

export function EditMenu(): JSX.Element {
  const anchors = useAnchor(MenuType.edit)
  const contents: MenuContentProps[] = [
    {
      label: '検索',
      accelerate: 'Ctrl+F',
      commandId: CommandId.find,
      closeMenu: anchors.closeMenu
    }
  ]

  return (
    <>
      <MenuButton label={MenuType.edit} onClick={anchors.clickEvent} />
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
