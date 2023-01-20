import { Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { Split } from 'models/splits'
import { AllocatorBadge } from '../FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from '../V2V3ProjectHandleLink'
import { CrownFilled } from '@ant-design/icons'
import FormattedAddress from 'components/FormattedAddress'

export function JuiceboxProjectBeneficiary({
  projectOwnerAddress,
  split,
  value,
}: {
  split: Split
  projectOwnerAddress: string | undefined
  value?: string | JSX.Element
}) {
  if (!split.projectId) return null

  const isProjectOwner = projectOwnerAddress === split.beneficiary

  return (
    <div>
      <Space size="middle">
        <V2V3ProjectHandleLink projectId={parseInt(split.projectId)} />
        <AllocatorBadge allocator={split.allocator} />
      </Space>
      {split.allocator === NULL_ALLOCATOR_ADDRESS ? (
        <Space>
          <div className="ml-2 flex items-center text-sm text-grey-500 dark:text-grey-300">
            <TooltipLabel
              label={<Trans>Tokens:</Trans>}
              tip={
                <Trans>
                  This address will receive any tokens minted when the recipient
                  project gets paid.
                </Trans>
              }
            />
            {value ?? (
              <FormattedAddress
                address={split.beneficiary}
                className={
                  'text-sm font-light text-grey-500 dark:text-grey-300'
                }
              />
            )}
            {isProjectOwner && (
              <Tooltip title={<Trans>Project owner</Trans>} className="ml-1">
                <CrownFilled />
              </Tooltip>
            )}
          </div>
        </Space>
      ) : null}
    </div>
  )
}
