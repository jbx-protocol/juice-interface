import { t } from '@lingui/macro'
import { Descriptions } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import AddERC20ToWalletButton from './AddERC20ToWalletButton'

export function ProjectTokenDescription({
  style,
}: {
  style?: React.CSSProperties
}) {
  const { tokenSymbol, tokenAddress } = useContext(V2V3ProjectContext)

  return (
    <Descriptions.Item label={t`Project token`} labelStyle={style}>
      <div>
        {tokenSymbol} (
        <FormattedAddress address={tokenAddress} />)
        <AddERC20ToWalletButton />
      </div>
    </Descriptions.Item>
  )
}
