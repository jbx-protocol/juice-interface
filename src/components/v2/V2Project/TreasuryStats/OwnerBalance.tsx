import { Trans } from '@lingui/macro'
import StatLine from 'components/Project/StatLine'

import ETHAmount from 'components/currency/ETHAmount'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { CSSProperties, useContext } from 'react'

import EtherscanLink from 'components/EtherscanLink'

import { useEthBalanceQuery } from 'hooks/EthBalance'

import { textPrimary } from 'constants/styles/text'

export default function OwnerBalance({ style }: { style?: CSSProperties }) {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
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
        <span style={textPrimary}>
          <ETHAmount amount={projectOwnerWalletBalance} precision={2} padEnd />
        </span>
      }
      style={style}
    />
  )
}
