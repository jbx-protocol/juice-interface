import { useCallback, useState } from 'react'

/**
 * Hook for allowing simple state operations for an array.
 *
 * Pass in state to anchor the array state, or keep undefined to allow the hook
 * to define and manage the state directly.
 */
export const useArray = <T extends { id: string }>(
  state?: [Array<T> | undefined, ((state: Array<T>) => void) | undefined],
) => {
  const [_values, _setValues] = useState<Array<T>>([])
  const values = state?.[0] ?? _values
  const setValues = state?.[1] ?? _setValues

  const add = useCallback(
    (value: T) => {
      setValues([...values, value])
    },
    [setValues, values],
  )

  const remove = useCallback(
    (id: string) => {
      setValues(values.filter(v => v.id !== id))
    },
    [setValues, values],
  )

  const upsert = useCallback(
    (value: T) => {
      const index = values.findIndex(v => v.id === value.id)
      if (index < 0) {
        add(value)
        return
      }

      setValues([...values.slice(0, index), value, ...values.slice(index + 1)])
    },
    [add, setValues, values],
  )
  return { values, add, remove, upsert }
}
