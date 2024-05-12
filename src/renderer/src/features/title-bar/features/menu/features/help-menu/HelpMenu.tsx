import { CommandId } from '@common/types'
import { Menu } from '@mui/material'
import { useAppStore } from '@renderer/store'
import { MenuType } from '@renderer/types'

import { MenuBackground, MenuButton, MenuContent } from '../../components'
import { useAnchor } from '../../hooks'

import type { MenuContentProps } from '../../types'

export function HelpMenu(): JSX.Element {
  const anchors = useAnchor(MenuType.help)
  const checking = useAppStore((state) => state.checkingUpdate)
  const contents: MenuContentProps[] = [
    {
      label: '更新確認',
      closeMenu: anchors.closeMenu,
      commandId: CommandId.checkUpdate,
      divide: true,
      disabled: checking
    },
    {
      label: 'バージョン情報',
      closeMenu: anchors.closeMenu,
      commandId: CommandId.checkVersion
    }
  ]

  return (
    <>
      <MenuButton label={MenuType.help} onClick={anchors.clickEvent} />
      <Menu anchorEl={anchors.element} open={anchors.open} onClose={anchors.closeMenu}>
        <MenuBackground>
          {contents.map((c, idx) => (
            <MenuContent key={idx} {...c} closeMenu={anchors.closeMenu} />
          ))}
        </MenuBackground>
      </Menu>
    </>
  )
}
