import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import useContractReaderV1 from 'hooks/ContractReaderV1'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import { ThemeContext } from 'contexts/themeContext'

import ProjectHandle from './ProjectHandle'

export default function ProjectTokenBalance({
  projectId,
  wallet,
  style,
  precision,
  hideHandle,
}: {
  projectId: BigNumber
  wallet: string | undefined
  style?: CSSProperties
  precision?: number
  hideHandle?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const tokenAddress = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const projectTokenContract = useErc20Contract(tokenAddress)

  const symbol = useContractReaderV1<string | null>({
    contract: projectTokenContract,
    functionName: 'symbol',
    formatter: symbol => symbol ?? null,
  })

  const balance = useContractReaderV1<BigNumber>({
    contract: JuiceboxV1ContractName.TicketBooth,
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
            {formatWad(balance, { precision: precision ?? 0 })}{' '}
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
