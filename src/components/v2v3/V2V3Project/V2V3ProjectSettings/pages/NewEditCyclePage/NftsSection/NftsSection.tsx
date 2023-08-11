import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useContext } from 'react'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { EnableNftsCard } from './EnableNftsCard'
import { HasExistingNftsState } from './HasExistingNftsState'
import { NftsTable } from './NftsTable'

export function NftsSection() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  const { value: hasExistingNfts } = useHasNftRewards()
  return (
    <>
      {hasExistingNfts ? (
        <HasExistingNftsState />
      ) : nftDeployerCanReconfigure ? (
        <NftsTable />
      ) : (
        <EnableNftsCard />
      )}
      <AdvancedDropdown>
        <Form.Item name="useDataSourceForRedeem">
          <JuiceSwitch
            label={
              <TooltipLabel
                label={<Trans>Use NFTs for redemption</Trans>}
                tip={
                  <Trans>
                    Contributors will redeem from the project's treasury with
                    their NFTs as opposed to standard project tokens.
                  </Trans>
                }
              />
            }
          />
        </Form.Item>
      </AdvancedDropdown>
    </>
  )
}
