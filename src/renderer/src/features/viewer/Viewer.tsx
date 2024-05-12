import { useEffect } from 'react'

import { Box } from '@mui/material'
import { useAppStore } from '@renderer/store'

import { ViewContents, Empty, FileTabs } from './features'

export function Viewer(): JSX.Element {
  const fileItems = useAppStore((state) => state.fileItems)
  const tabsSelected = useAppStore((state) => state.tabSelected)

  const setFileItems = useAppStore((state) => state.setFileItems)
  const setCustomHighlights = useAppStore((state) => state.setCustomHighlights)
  useEffect(() => {
    const invokeHighlights = async (): Promise<void> => {
      const customHighlights = await window.api.invoke.customHighlights()
      setCustomHighlights(customHighlights)
    }
    const invokeFileItems = async (): Promise<void> => {
      const fileItems = await window.api.invoke.files()
      setFileItems(fileItems)
    }

    window.api.sendToRenderer.newFile(() => invokeFileItems())
    invokeHighlights()
    invokeFileItems()
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()

    const filePaths: string[] = []
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const f = e.dataTransfer.files.item(i)
      filePaths.push(f.path)
    }

    const invokeDrop = async (): Promise<void> => {
      const fileItems = await window.api.invoke.dragDropFiles(filePaths)
      setFileItems(fileItems)
    }

    invokeDrop()
  }

  return (
    <>
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {fileItems.length > 0 ? (
          <>
            <FileTabs />
            <ViewContents filePath={fileItems[tabsSelected]?.filePath} />
          </>
        ) : (
          <Empty />
        )}
      </Box>
    </>
  )
}
