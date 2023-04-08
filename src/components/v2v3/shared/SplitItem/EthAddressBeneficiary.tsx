import { CrownFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { isEqualAddress } from 'utils/address'

export function ETHAddressBeneficiary({
  beneficaryAddress,
  projectOwnerAddress,
}: {
  beneficaryAddress: string | undefined
  projectOwnerAddress: string | undefined
}) {
  const isProjectOwner = isEqualAddress(projectOwnerAddress, beneficaryAddress)

  return (
    <div className="flex items-center justify-center gap-1 font-medium">
      {beneficaryAddress ? (
        <FormattedAddress address={beneficaryAddress} />
      ) : null}
      {!beneficaryAddress && isProjectOwner ? (
        <Trans>Project owner (you)</Trans>
      ) : null}
      {isProjectOwner && (
        <Tooltip title={<Trans>Project owner</Trans>}>
          <CrownFilled />
        </Tooltip>
      )}
      :
    </div>
  )
}
