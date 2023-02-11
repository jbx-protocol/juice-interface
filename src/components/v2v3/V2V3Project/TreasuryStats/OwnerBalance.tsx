import { Trans } from '@lingui/macro'
import StatLine from 'components/Project/StatLine'
import ETHAmount from 'components/currency/ETHAmount'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import EtherscanLink from 'components/EtherscanLink'
import { useEthBalanceQuery } from 'hooks/EthBalance'

export default function OwnerBalance() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: projectOwnerWalletBalance, isLoading } =
    useEthBalanceQuery(projectOwnerAddress)

  return (
    <StatLine
      loading={isLoading}
      statLabel={<Trans>In wallet</Trans>}
      statLabelTip={
        <>
          <p>
            <Trans>The balance of the project owner's wallet.</Trans>
          </p>{' '}
          <EtherscanLink value={projectOwnerAddress} type="address" />
        </>
      }
      statValue={
        <span className="text-lg font-medium">
          <ETHAmount amount={projectOwnerWalletBalance} precision={2} padEnd />
        </span>
      }
    />
  )
}
