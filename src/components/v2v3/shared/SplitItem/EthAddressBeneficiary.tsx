import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { Split } from 'models/splits'
import { CrownFilled } from '@ant-design/icons'

export function ETHAddressBeneficiary({
  projectOwnerAddress,
  split,
}: {
  split: Split
  projectOwnerAddress: string | undefined
}) {
  const isProjectOwner = projectOwnerAddress === split.beneficiary

  return (
    <div className="flex items-baseline font-medium">
      {split.beneficiary ? (
        <FormattedAddress address={split.beneficiary} />
      ) : null}
      {!split.beneficiary && isProjectOwner ? (
        <Trans>Project owner (you)</Trans>
      ) : null}
      {isProjectOwner && (
        <span className="ml-1">
          <Tooltip title={<Trans>Project owner</Trans>}>
            <CrownFilled />
          </Tooltip>
        </span>
      )}
      :
    </div>
  )
}
