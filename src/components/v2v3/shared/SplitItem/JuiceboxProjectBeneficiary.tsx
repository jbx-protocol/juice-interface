import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { Split } from 'models/splits'
import { featureFlagEnabled } from 'utils/featureFlags'
import { AllocatorBadge } from '../FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from '../V2V3ProjectHandleLink'
import { CrownFilled } from '@ant-design/icons'
import { DiffedItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/DiffedItem'

export function JuiceboxProjectBeneficiary({
  projectOwnerAddress,
  split,
  oldSplit,
}: {
  split: Split
  oldSplit?: Split
  projectOwnerAddress: string | undefined
}) {
  if (!split.projectId) return null

  const isProjectOwner = projectOwnerAddress === split.beneficiary
  const allocatorsEnabled = featureFlagEnabled(FEATURE_FLAGS.SPLIT_ALLOCATORS)

  const hasDiff = oldSplit && oldSplit.beneficiary !== split.beneficiary

  return (
    <div>
      <Space size="middle">
        <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
        {allocatorsEnabled ? (
          <AllocatorBadge allocator={split.allocator} />
        ) : null}
      </Space>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <div className="ml-2 flex text-sm text-grey-500 dark:text-grey-300">
          <TooltipLabel
            label={<Trans>Tokens:</Trans>}
            tip={
              <Trans>
                This address will receive any tokens minted when the recipient
                project gets paid.
              </Trans>
            }
          />{' '}
          {hasDiff ? (
            <div className="flex">
              <DiffedItem
                value={<FormattedAddress address={oldSplit.beneficiary} />}
                diffStatus="old"
              />
              <DiffedItem
                value={<FormattedAddress address={split.beneficiary} />}
                diffStatus="new"
              />
            </div>
          ) : (
            <div className="ml-2">
              <FormattedAddress address={split.beneficiary} />
            </div>
          )}{' '}
          {isProjectOwner && (
            <Tooltip title={<Trans>Project owner</Trans>}>
              <CrownFilled />
            </Tooltip>
          )}
        </div>
      ) : null}
    </div>
  )
}
