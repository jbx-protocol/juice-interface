import { useAppSelector } from 'hooks/AppSelector'
import { CreatePage } from 'models/create-page'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

const pageOrder: CreatePage[] = [
  'projectDetails',
  'fundingCycles',
  'fundingTarget',
  'payouts',
  'projectToken',
  'nftRewards',
  'reconfigurationRules',
  'reviewDeploy',
]

export const useEditingCreateFurthestPageReached = () => {
  const dispatch = useDispatch()
  const furthestPageReached = useAppSelector(
    state => state.editingV2Project.createFurthestPageReached,
  )

  const setFurthestPageReached = useCallback(
    (page: CreatePage) => {
      const currentPageIndex = pageOrder.indexOf(furthestPageReached)
      const newPageIndex = pageOrder.indexOf(page)
      if (newPageIndex > currentPageIndex) {
        dispatch(editingV2ProjectActions.setCreateFurthestPageReached(page))
      }
    },
    [dispatch, furthestPageReached],
  )
  const resetFurthestPageReached = useCallback(() => {
    dispatch(editingV2ProjectActions.setCreateFurthestPageReached(pageOrder[0]))
  }, [dispatch])

  return {
    furthestPageReached,
    setFurthestPageReached,
    restFurthestPageReached: resetFurthestPageReached,
  }
}

// Utility for above hook to automagically set the page
export const useSetCreateFurthestPageReached = (page: CreatePage) => {
  const { setFurthestPageReached } = useEditingCreateFurthestPageReached()
  useEffect(() => {
    setFurthestPageReached(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
