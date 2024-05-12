import Store from 'electron-store'

import type { StoreType } from './store-type'
import type Conf from '../../../node_modules/conf/dist/source/index'
import type { Migrations } from '../../../node_modules/conf/dist/source/types'
import type { Schema } from 'electron-store'

const schema: Schema<StoreType> = {
  window: {
    type: 'object',
    properties: {
      size: {
        type: 'object',
        properties: {
          width: {
            type: 'number',
            default: 800
          },
          height: {
            type: 'number',
            default: 600
          }
        }
      },
      pos: {
        type: 'object',
        properties: {
          x: {
            type: 'number'
          },
          y: {
            type: 'number'
          }
        }
      },
      maximized: {
        type: 'boolean'
      }
    }
  },
  renderer: {
    type: 'object',
    properties: {
      filePaths: {
        type: 'array',
        default: []
      },
      settings: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            default: 'system'
          },
          fontSize: {
            type: 'number',
            default: 16
          }
        }
      },
      customHighlights: {
        type: 'array',
        default: []
      }
    }
  }
}

const defaults: StoreType = {
  window: {
    size: {
      width: 800,
      height: 600
    },
    pos: {
      x: undefined,
      y: undefined
    },
    maximized: false
  },
  renderer: {
    filePaths: [],
    settings: {
      theme: 'system',
      fontSize: 16
    },
    customHighlights: [
      {
        name: 'trace',
        fontColor: '#8abeb7',
        pattern: [
          { reg: '\\b(TRACE|Trace)\\b|\\b(trace)\\b:', flag: 'i' },
          { reg: '\\[(trace|trac|tra|tr|t)\\]', flag: 'i' }
        ]
      },
      {
        name: 'debug',
        fontColor: '#b294bb',
        pattern: [
          { reg: '\\b(DEBUG|Debug)\\b|\\b(debug)\\b:', flag: 'i' },
          { reg: '\\[(debug|dbug|dbg|de|d)\\]', flag: 'i' }
        ]
      },
      {
        name: 'info',
        fontColor: '#b5bd68',
        pattern: [
          { reg: '\\b(HINT|INFO|INFORMATION|Info|NOTICE|II)\\b|\\b(info|information)\\b:', flag: 'i' },
          { reg: '\\[(information|info|inf|in|i)\\]', flag: 'i' }
        ]
      },
      {
        name: 'warning',
        fontColor: '#efc573',
        pattern: [
          { reg: '\\b(WARNING|WARN|Warn|WW)\\b|\\b(warning)\\b:', flag: 'i' },
          { reg: '\\[(warning|warn|wrn|wn|w)\\]', flag: 'i' }
        ]
      },
      {
        name: 'critical',
        fontColor: '#cb6565',
        fontStyle: 'italic bold',
        pattern: [
          { reg: '\\b(ALERT|CRITICAL|EMERGENCY|ERROR|FAILURE|FAIL|Fatal|FATAL|Error)\\b|\\b(error)\\b:', flag: 'i' },
          { reg: '\\[(error|eror|err|er|e|fatal|fatl|ftl|fa|f)\\]', flag: 'i' }
        ]
      },
      {
        name: 'date-time',
        fontColor: '#6a9955',
        pattern: [
          { reg: '\\b\\d{4}-\\d{2}-\\d{2}(T|\\b)', flag: '' },
          { reg: '(?<=(^|\\s))\\d{4}[^ws]\\d{2}[^ws]\\d{2}\\b', flag: '' },
          { reg: '\\d{1,2}:\\d{2}(:\\d{2}([.,]\\d{1,})?)?(Z| ?[+-]\\d{1,2}:\\d{2})?\\b', flag: '' }
        ]
      },
      {
        name: 'guid',
        fontColor: '#4e86c4',
        pattern: [{ reg: '\\b[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}\\b', flag: '' }]
      },
      {
        name: 'ip-address',
        fontColor: '#a8b394',
        fontStyle: 'italic',
        pattern: [{ reg: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', flag: '' }]
      },
      {
        name: 'mac-address',
        fontColor: '#4e86c4',
        pattern: [{ reg: '(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})', flag: '' }]
      },
      {
        name: 'constant',
        fontColor: '#4e86c4',
        pattern: [
          { reg: '\\b(?<!\\w)(\\d+$|TRUE|[Tt]rue|FALSE|[Fa]alse|NULL|[Nn]ull)(?!\\w)\\b', flag: '' },
          { reg: '\\b(0x[a-fA-F0-9]+)\\b', flag: '' }
        ]
      },
      {
        name: 'url',
        fontColor: '#569cd6',
        pattern: [{ reg: '\\b(?:https?|ftp):\\/\\/[-\\w+&@#\\\\/%?=~|$!:,.;]*[\\w+&@#\\\\/%=~|$]', flag: 'i' }]
      },
      {
        name: 'string',
        fontColor: '#ce9178',
        pattern: [
          { reg: '"[^"]*"', flag: '' },
          { reg: "(?<![\\w])'[^']*'", flag: '' }
        ]
      },
      {
        name: 'exception',
        fontColor: '#cb6565',
        fontStyle: 'italic',
        pattern: [
          { reg: '\\b([a-zA-Z.]*Exception)\\b', flag: '' },
          { reg: '^[\\t ]*at[\\t ].*$', flag: '' }
        ]
      }
    ]
  }
}

const migrations: Migrations<StoreType> = {
  '1.0.1': (store: Conf<StoreType>) => {
    store.set('renderer.customHighlights', defaults.renderer.customHighlights)
  }
}

export const config = new Store<StoreType>({
  defaults: defaults,
  schema: schema,
  migrations: migrations
})
