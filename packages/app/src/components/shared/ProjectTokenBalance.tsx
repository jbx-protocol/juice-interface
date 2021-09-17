import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import ProjectHandle from './ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'

export default function ProjectTokenBalance({
  projectId,
  wallet,
  style,
  decimals,
}: {
  projectId: BigNumber
  wallet: string | undefined
  style?: CSSProperties
  decimals?: number
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

  const symbol = useContractReader<string>({
    contract: projectTokenContract,
    functionName: 'symbol',
  })

  const balance = useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      projectId && wallet && isAddress(wallet)
        ? [wallet, projectId.toHexString()]
        : null,
  })

  if (balance === undefined) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', ...style }}>
      <span>
        {formatWad(balance, { decimals: decimals ?? 0 })} {symbol ?? 'tokens'}
      </span>

      <ProjectHandle
        style={{ color: colors.text.tertiary }}
        link={true}
        projectId={projectId}
      />
    </div>
  )
}
