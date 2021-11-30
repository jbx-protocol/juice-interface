import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import { ThemeContext } from 'contexts/themeContext'

import ProjectHandle from './ProjectHandle'

export default function ProjectTokenBalance({
  projectId,
  wallet,
  style,
  decimals,
  hideHandle,
}: {
  projectId: BigNumber
  wallet: string | undefined
  style?: CSSProperties
  decimals?: number
  hideHandle?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const tokenAddress = useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const projectTokenContract = useErc20Contract(tokenAddress)

  const symbol = useContractReader<string | null>({
    contract: projectTokenContract,
    functionName: 'symbol',
    formatter: symbol => symbol ?? null,
  })

  const balance = useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      projectId && wallet && isAddress(wallet)
        ? [wallet, projectId.toHexString()]
        : null,
  })

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', ...style }}>
      <span>
        {symbol !== undefined ? (
          <>
            {formatWad(balance, { decimals: decimals ?? 0 })}{' '}
            {symbol ?? 'tokens'}
          </>
        ) : (
          '--'
        )}
      </span>

      {!hideHandle && (
        <ProjectHandle
          style={{ color: colors.text.tertiary }}
          link={true}
          projectId={projectId}
        />
      )}
    </div>
  )
}
