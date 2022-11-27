import { EnsCacheRecord } from 'providers/EnsCacheProvider'
import { createContext, Dispatch, SetStateAction } from 'react'

interface EnsCacheContextType {
  cache: Record<string, EnsCacheRecord>
  pending: Record<string, boolean>
  setCache?: Dispatch<SetStateAction<Record<string, EnsCacheRecord>>>
  setPending?: Dispatch<SetStateAction<Record<string, boolean>>>
}

export const EnsCacheContext = createContext<EnsCacheContextType>({
  cache: {},
  pending: {},
})
