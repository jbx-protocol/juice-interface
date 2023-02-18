import { AddressZero } from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

export function DangerZoneSection({ close }: { close?: VoidFunction }) {
  const { fundingCycleMetadata } = useAppSelector(
    state => state.editingV2Project,
  )
  const dispatch = useAppDispatch()

  function onDetach() {
    dispatch(editingV2ProjectActions.setNftRewardTiers([]))
    dispatch(
      editingV2ProjectActions.setFundingCycleMetadata({
        ...fundingCycleMetadata,
        dataSource: AddressZero,
      }),
    )
    close?.()
  }

  return (
    <div>
      <Button onClick={onDetach} type="primary">
        <Trans>Detach NFTs from project</Trans>
      </Button>
    </div>
  )
}
