import { ProjectUpdate } from '../hooks/useUpdatesPanel'

export type ProjectUpdatesReducerState = {
  projectUpdates: ProjectUpdate[]
  loading: boolean
  error: string | undefined
}

export type ProjectUpdatesReducerAction =
  | { type: 'loading' }
  | { type: 'error'; error: string }
  | { type: 'success'; projectUpdates: ProjectUpdate[] }

export const projectUpdatesReducer = (
  state: ProjectUpdatesReducerState,
  action: ProjectUpdatesReducerAction,
): ProjectUpdatesReducerState => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        loading: true,
        error: undefined,
      }
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case 'success':
      return {
        ...state,
        loading: false,
        projectUpdates: action.projectUpdates,
      }
    default:
      return state
  }
}
