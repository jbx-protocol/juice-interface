import { CrownFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import { isEqualAddress } from 'utils/address'

export function ETHAddressBeneficiary({
  beneficaryAddress,
  projectOwnerAddress,
  hideAvatar,
}: {
  beneficaryAddress: string | undefined
  projectOwnerAddress: string | undefined
  hideAvatar?: boolean
}) {
  const isProjectOwner = isEqualAddress(projectOwnerAddress, beneficaryAddress)

  return (
    <div className="flex items-center justify-center gap-1 font-medium">
      {beneficaryAddress ? (
        <JuiceboxAccountLink
          address={beneficaryAddress}
          withEnsAvatar={!hideAvatar}
        />
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
