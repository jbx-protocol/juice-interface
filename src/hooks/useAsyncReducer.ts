import React from 'react'

export type AsyncReducerState<T> = {
  data: T | null
  error: Error | null
  loading: boolean
}

export type AsyncReducerAction<T> =
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error }

export const useAsyncDataReducer = <Data>(
  asyncCall: () => Promise<Data>,
  initialData: Data,
) => {
  const [state, dispatch] = React.useReducer(
    (state: AsyncReducerState<Data>, action: AsyncReducerAction<Data>) => {
      switch (action.type) {
        case 'loading':
          return { ...state, loading: true }
        case 'success':
          return { ...state, loading: false, data: action.data }
        case 'error':
          return { ...state, loading: false, error: action.error }
        default:
          return state
      }
    },
    {
      data: initialData,
      error: null,
      loading: false,
    } as AsyncReducerState<Data>,
  )

  const dispatchAsync = React.useCallback(async () => {
    dispatch({ type: 'loading' })
    try {
      const data = await asyncCall()
      dispatch({ type: 'success', data })
    } catch (error) {
      dispatch({ type: 'error', error: error as Error })
    }
  }, [asyncCall, dispatch])

  return [state, dispatchAsync] as const
}
