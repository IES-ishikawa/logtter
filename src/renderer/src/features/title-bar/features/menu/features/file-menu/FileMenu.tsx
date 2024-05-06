import { CommandId } from '@common/types'
import { Menu } from '@mui/material'
import { MenuType } from '@renderer/types'

import { MenuBackground, MenuButton, MenuContent } from '../../components'
import { useAnchor } from '../../hooks'

import type { MenuContentProps } from '../../types'

export function FileMenu(): JSX.Element {
  const anchors = useAnchor(MenuType.file)
  const contents: MenuContentProps[] = [
    {
      label: 'ファイルを開く',
      accelerate: 'Ctrl+O',
      commandId: CommandId.openFile,
      closeMenu: anchors.closeMenu
    },
    {
      label: 'ファイルを閉じる',
      accelerate: 'Ctrl+W',
      commandId: CommandId.closeFile,
      divide: true,
      closeMenu: anchors.closeMenu
    },
    {
      label: '終了',
      accelerate: 'Ctrl+Q',
      commandId: CommandId.quitApp,
      closeMenu: anchors.closeMenu
    }
  ]

  return (
    <>
      <MenuButton label={MenuType.file} onClick={anchors.clickEvent} />
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
