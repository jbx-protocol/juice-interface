import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useCallback } from 'react'

export default function ProjectHandle({
  projectId,
  style,
}: {
  projectId: BigNumberish
  style?: CSSProperties
}) {
  const handle = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    formatter: useCallback(val => utils.parseBytes32String(val), []),
  })

  return <span style={style}>{handle}</span>
}
