import Store from 'electron-store'

import type { StoreType } from './store-type'
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
    }
  }
}

export const config = new Store<StoreType>({
  defaults: defaults,
  schema: schema
})
