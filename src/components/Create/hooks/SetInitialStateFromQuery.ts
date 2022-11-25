import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  defaultProjectState,
  editingV2ProjectActions,
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
      const parsedInitialState = JSON.parse(initialState as string)

      dispatch(
        editingV2ProjectActions.setState({
          ...defaultProjectState,
          ...parsedInitialState,
        }),
      )
    } catch (e) {
      console.warn('Error parsing initialState:', e)
    }
  }, [router, dispatch])
}
