import { useState } from 'react'

import { CommandId } from '@common/types'
import { Container, Grid, Menu, Modal, Paper, Typography } from '@mui/material'
import { useAppStore } from '@renderer/store'
import { MenuType } from '@renderer/types'

import { MenuBackground, MenuButton, MenuContent } from '../../components'
import { useAnchor } from '../../hooks'

import type { MenuContentProps } from '../../types'

export function HelpMenu(): JSX.Element {
  const anchors = useAnchor(MenuType.help)
  const checking = useAppStore((state) => state.checkingUpdate)
  const [openVer, setOpenVer] = useState(false)
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
      clickEvent: (): void => {
        setOpenVer(true)
        anchors.closeMenu()
      }
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

      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        open={openVer}
        onClose={() => setOpenVer(false)}
      >
        <Paper sx={{ width: innerWidth * 0.3 }}>
          <Container>
            <Grid container marginY={2}>
              <Grid item xs={5}>
                <Typography color="text.secondary">プロダクト名:</Typography>
              </Grid>
              <Grid item xs={7}>
                Logtter
              </Grid>
            </Grid>
            <Grid container marginY={2}>
              <Grid item xs={5}>
                <Typography color="text.secondary">バージョン:</Typography>
              </Grid>
              <Grid item xs={7}>
                {window.electron.process.versions[0]}
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Modal>
    </>
  )
}
