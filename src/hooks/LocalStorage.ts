import { useState } from 'react'

const getDataFromLocalStorage = <T>(
  key: string,
  initialValue: T,
  shouldSaveInitial = false,
) => {
  if (typeof window === 'undefined') return initialValue
  try {
    const item = window.localStorage.getItem(key)
    if (!item) {
      if (shouldSaveInitial)
        window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
    return JSON.parse(item)
  } catch (error) {
    return initialValue
  }
}

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  shouldSaveInitial = false,
) => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getDataFromLocalStorage(key, initialValue, shouldSaveInitial),
  )

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      return undefined
    }
  }
  return [storedValue, setValue] as const
}

export default useLocalStorage
