import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { ProjectDispatch, ProjectStore, RootProjectState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useProjectDispatch: () => ProjectDispatch = useDispatch
export const useProjectSelector: TypedUseSelectorHook<RootProjectState> =
  useSelector
export const useProjectStore: () => ProjectStore = useStore
