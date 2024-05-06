import { useCallback, useEffect, useRef, useState } from 'react'

import { Editor, type Monaco } from '@monaco-editor/react'
import { useThemeMode } from '@renderer/hooks'
import { useAppStore } from '@renderer/store'
import { KeyCode, type Range, type editor } from 'monaco-editor'

type ViewContentsProps = {
  filePath: string
}

export function ViewContents({ filePath }: ViewContentsProps): JSX.Element {
  const settings = useAppStore((state) => state.setting)
  const ref = useRef<editor.IStandaloneCodeEditor>()
  const [value, setValue] = useState<string>()

  const themeMode = useThemeMode()

  const tail = useAppStore((state) => state.tail)
  const setTail = useAppStore((state) => state.setTail)

  useEffect(() => {
    window.api.sendToRenderer.fileContents((text) => setValue(text))
  }, [])

  useEffect(() => {
    const watch = async (): Promise<void> => {
      const contents = await window.api.invoke.watchFile(filePath)
      setValue(contents)
    }

    if (filePath) {
      watch()
    }

    return () => {
      if (filePath) {
        window.api.sendToMain.removeWatch(filePath)
      }
    }
  }, [filePath])

  const handleScroll = useCallback(() => {
    const visibleRanges = ref.current.getVisibleRanges()
    const totalLines = ref.current.getModel().getLineCount()
    setTail(
      visibleRanges.some((range: Range) => totalLines >= range.startLineNumber && totalLines <= range.endLineNumber)
    )
  }, [])

  useEffect(() => {
    if (tail && ref?.current) {
      ref.current.revealLine(ref.current.getModel().getLineCount())
    }
  }, [tail, ref])

  const handleMount = (e: editor.IStandaloneCodeEditor, monaco: Monaco): void => {
    ref.current = e
    ref.current.onDidScrollChange(handleScroll)
    monaco.editor.addKeybindingRule({
      keybinding: KeyCode.F1,
      command: null
    })
    window.api.sendToRenderer.find(() => {
      ref.current.getAction('actions.find').run('')
    })
  }

  const handleChange = useCallback(() => {
    if (tail && ref?.current) {
      ref.current.revealLine(ref.current.getModel().getLineCount())
    }
  }, [tail, ref])

  return (
    <>
      <Editor
        onChange={handleChange}
        onMount={handleMount}
        theme={themeMode === 'dark' ? 'vs-dark' : themeMode}
        value={value}
        options={{
          domReadOnly: true,
          readOnly: true,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false
          },
          contextmenu: false,

          wordWrap: 'on',
          fontSize: settings.fontSize
        }}
      />
    </>
  )
}
