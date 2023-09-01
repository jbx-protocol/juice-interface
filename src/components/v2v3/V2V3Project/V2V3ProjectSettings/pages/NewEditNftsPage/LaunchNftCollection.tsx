import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { NftRewardsPage } from 'components/Create/components'
import { useEditingFundingCycleConfig } from '../ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { useReconfigureFundingCycle } from '../ReconfigureFundingCycleSettingsPage/hooks/useReconfigureFundingCycle'

export function LaunchNftCollection() {
  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({
      editingFundingCycleConfig,
      memo: 'First NFT collection',
      launchedNewNfts: true,
    })

  return (
    <NftRewardsPage
      okButton={
        <Button
          type="primary"
          onClick={reconfigureFundingCycle}
          loading={reconfigureLoading}
          className="mt-10"
        >
          <Trans>Deploy NFT collection</Trans>
        </Button>
      }
    />
  )
}
