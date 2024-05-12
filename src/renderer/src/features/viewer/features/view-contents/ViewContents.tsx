import { useCallback, useEffect, useRef, useState } from 'react'

import { Editor, type Monaco } from '@monaco-editor/react'
import { useThemeMode } from '@renderer/hooks'
import { useAppStore } from '@renderer/store'
import { KeyCode, type Range, type editor } from 'monaco-editor'

import { diffTimeCalc } from './diff-time-calc'

import type { languages } from 'monaco-editor'

type ViewContentsProps = {
  filePath: string
}

export function ViewContents({ filePath }: ViewContentsProps): JSX.Element {
  const highlights = useAppStore((state) => state.customHighlights)
  const settings = useAppStore((state) => state.setting)
  const setDiffTime = useAppStore((state) => state.setDiffTime)
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

    e.onDidChangeCursorSelection((selEvent) => {
      const diffTime = diffTimeCalc(e.getModel(), selEvent.selection.startLineNumber, selEvent.selection.endLineNumber)
      setDiffTime(diffTime)
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

  const beforeMount = (monaco: Monaco): void => {
    monaco.languages.register({ id: 'logtter' })

    const rootRules: languages.IMonarchLanguageRule[] = highlights.flatMap((ch) =>
      ch.pattern.map((pt) => [new RegExp(pt.reg, pt.flag), ch.name] as languages.IMonarchLanguageRule)
    )

    monaco.languages.setMonarchTokensProvider('logtter', {
      tokenizer: {
        root: rootRules
      }
    })

    const rules: editor.ITokenThemeRule[] = highlights.map((ch) => ({
      token: ch.name,
      foreground: ch.fontColor,
      fontStyle: ch.fontStyle
    }))

    monaco.editor.defineTheme('dark-logtter', {
      base: 'vs-dark',
      inherit: true,
      rules: rules,
      colors: {}
    })

    monaco.editor.defineTheme('light-logtter', {
      base: 'vs',
      inherit: true,
      rules: rules,
      colors: {}
    })
  }

  return (
    <>
      <Editor
        keepCurrentModel={true}
        onChange={handleChange}
        onMount={handleMount}
        theme={themeMode === 'dark' ? 'dark-logtter' : 'light-logtter'}
        beforeMount={beforeMount}
        value={value}
        language="logtter"
        options={{
          domReadOnly: true,
          readOnly: true,
          scrollBeyondLastLine: false,
          unicodeHighlight: {
            ambiguousCharacters: false
          },
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
