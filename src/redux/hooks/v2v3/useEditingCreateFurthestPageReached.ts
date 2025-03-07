import { CreatePage } from 'models/createPage'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'

const pageOrder: CreatePage[] = [
  'projectDetails',
  'fundingCycles',
  'payouts',
  'projectToken',
  'nftRewards',
  'reconfigurationRules',
  'reviewDeploy',
]

export const useEditingCreateFurthestPageReached = () => {
  const dispatch = useDispatch()
  const furthestPageReached = useAppSelector(
    state => state.creatingV2Project.createFurthestPageReached,
  )

  const setFurthestPageReached = useCallback(
    (page: CreatePage) => {
      const currentPageIndex = pageOrder.indexOf(furthestPageReached)
      const newPageIndex = pageOrder.indexOf(page)
      if (newPageIndex > currentPageIndex) {
        dispatch(creatingV2ProjectActions.setCreateFurthestPageReached(page))
      }
    },
    [dispatch, furthestPageReached],
  )
  const resetFurthestPageReached = useCallback(() => {
    dispatch(
      creatingV2ProjectActions.setCreateFurthestPageReached(pageOrder[0]),
    )
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
