type StateType = 'pending' | 'fulfilled' | 'rejected'

type State<T> = {
  type: StateType
  promise?: Promise<T>
  result?: T
  error?: unknown
}

export function wrapPromise<T>(promise: Promise<T>): () => T {
  let state: State<T>

  const suspender = promise
    .then((result) => {
      state = {
        type: 'fulfilled',
        result: result
      }
      return result
    })
    .catch((e) => {
      state = {
        type: 'rejected',
        error: e
      }
      throw e
    })
  state = {
    type: 'pending',
    promise: suspender
  }

  const get = (): T => {
    switch (state.type) {
      case 'pending': {
        throw state.promise
      }
      case 'fulfilled': {
        return state.result
      }
      case 'rejected': {
        throw state.error
      }
    }
  }

  return get
}
