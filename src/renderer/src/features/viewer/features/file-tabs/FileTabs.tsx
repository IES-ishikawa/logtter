import type { SyntheticEvent } from 'react'
import { useCallback, useEffect } from 'react'

import { IpcChannel } from '@common/types'
import { Dismiss16Regular } from '@fluentui/react-icons'
import { Divider, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { TabHeight } from '@renderer/consts'
import { useAppStore } from '@renderer/store'

export function FileTabs(): JSX.Element {
  const tabSelected = useAppStore((state) => state.tabSelected)
  const setTabSelected = useAppStore((state) => state.setTabSelected)
  const fileItems = useAppStore((state) => state.fileItems)
  const setFileItems = useAppStore((state) => state.setFileItems)
  let mouseButton: number = null

  useEffect(() => {
    window.api.sendToRenderer.closeFile(() => {
      if (fileItems.length > 0) {
        close(fileItems[tabSelected].filePath)
      }
    })

    return () => window.api.sendToRenderer.removeListener(IpcChannel.sendToRenderer.closeFile)
  }, [fileItems, tabSelected])

  const handleChange = useCallback((_: SyntheticEvent, newValue: number) => {
    setTabSelected(newValue)
  }, [])

  const close = async (filePath: string): Promise<void> => {
    const newFileItems = await window.api.invoke.closeFile(filePath)
    if (!newFileItems[tabSelected] && newFileItems.length > 0) {
      setTabSelected(newFileItems.length - 1)
    }
    setFileItems(newFileItems)
  }

  const handleCloseClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, filePath: string) => {
      e.stopPropagation()

      close(filePath)
    },
    [tabSelected]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    mouseButton = e.button
  }

  const handleMouseLeave = (): void => {
    mouseButton = null
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, filePath: string): void => {
    if (e.button === 1 && mouseButton === 1) {
      close(filePath)
      mouseButton = null
    }
  }

  return (
    <Tabs value={tabSelected} onChange={handleChange} variant="scrollable" scrollButtons="auto">
      {fileItems.map((fileItem, idx) => (
        <Tab
          onMouseDown={handleMouseDown}
          onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => handleMouseUp(e, fileItem.filePath)}
          onMouseLeave={handleMouseLeave}
          sx={{
            margin: 1,
            textTransform: 'none',
            minHeight: TabHeight,
            height: TabHeight
          }}
          key={idx}
          icon={
            <>
              <IconButton
                component="span"
                sx={{ ml: 1 }}
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => handleCloseClick(e, fileItem.filePath)}
              >
                <Dismiss16Regular />
              </IconButton>
              <Divider orientation="vertical" />
            </>
          }
          iconPosition="end"
          label={<Typography>{fileItem.fileName}</Typography>}
        />
      ))}
    </Tabs>
  )
}
