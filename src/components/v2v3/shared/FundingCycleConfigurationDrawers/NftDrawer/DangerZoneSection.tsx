import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout'
import { constants } from 'ethers'
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
        dataSource: constants.AddressZero,
      }),
    )
    close?.()
  }

  return (
    <div>
      <Callout.Warning className="mb-5">
        <Trans>
          Detaching NFTs from your cycle has the following effects:
          <ul className="list-disc pl-10">
            <li>Supporters won't receive NFTs when they pay your project.</li>
            <li>Current NFT holders won't be able to redeem their NFTs.</li>
          </ul>
          <p>These changes will take effect in your next cycle.</p>
        </Trans>
      </Callout.Warning>
      <Button onClick={onDetach} type="primary">
        <Trans>Detach NFTs from cycle</Trans>
      </Button>
    </div>
  )
}
