import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  defaultReduxState,
  editingV2ProjectActions,
  ProjectState,
} from 'redux/slices/editingV2Project'

/**
 * Load redux state from a URL query parameter.
 */
export function useSetInitialStateFromQuery() {
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const { initialState } = router.query
    if (!initialState) return

    try {
      // TODO we can probably validate this object better in future.
      // But worst case, if it's invalid, we'll just ignore it.
      const parsedInitialState = JSON.parse(
        initialState as string,
      ) as ProjectState

      dispatch(
        editingV2ProjectActions.setState({
          ...defaultReduxState,
          ...parsedInitialState,
        }),
      )
    } catch (e) {
      console.warn('Error parsing initialState:', e)
    }
  }, [router, dispatch])
}
