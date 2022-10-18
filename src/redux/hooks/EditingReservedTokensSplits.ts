import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { Split } from 'models/splits'
import { useCallback } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

/**
 * Hook for accessing and setting the redux editing v2 reserved token splits value.
 */
export const useEditingReservedTokensSplits = (): [
  Split[],
  (input: Split[]) => void,
] => {
  const dispatch = useAppDispatch()
  const { splits } = useAppSelector(
    state => state.editingV2Project.reservedTokensGroupedSplits,
  )

  const setSplits = useCallback(
    (input: Split[]) => {
      if (!input || !input.length) {
        dispatch(editingV2ProjectActions.setReservedTokensSplits([]))
        return
      }
      dispatch(editingV2ProjectActions.setReservedTokensSplits(input))
    },
    [dispatch],
  )

  return [splits, setSplits]
}
