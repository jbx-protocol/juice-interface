import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import StatLine from 'components/Project/StatLine'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useContext } from 'react'

export default function OwnerBalance() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: projectOwnerWalletBalance, isLoading } =
    useEthBalanceQuery(projectOwnerAddress)

  return (
    <StatLine
      loading={isLoading}
      statLabel={<Trans>Owner wallet balance</Trans>}
      statLabelTip={
        <>
          <p>
            <Trans>
              The amount of ETH in the wallet that owns this project.
            </Trans>
          </p>{' '}
          <EtherscanLink value={projectOwnerAddress} type="address" />
        </>
      }
      statValue={
        <span className="text-primary text-lg font-medium">
          <ETHAmount amount={projectOwnerWalletBalance} precision={2} padEnd />
        </span>
      }
    />
  )
}
