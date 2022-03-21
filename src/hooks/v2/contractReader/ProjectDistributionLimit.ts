import { BigNumber } from '@ethersproject/bignumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2ContractName } from 'models/v2/contracts'
import { useContext } from 'react'

import useV2ContractReader from './V2ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  domain,
  terminal,
}: {
  projectId?: BigNumber
  domain?: string
  terminal?: string
}) {
  // const { terminals } = useContext(V2ProjectContext)
  return useV2ContractReader<string>({
    contract: V2ContractName.JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && domain ? [projectId.toHexString(), domain, terminal] : null,
  })
}
