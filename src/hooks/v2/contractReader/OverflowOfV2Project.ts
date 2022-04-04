import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns overflow in ETH of project with `projectId`. */
export default function useOverflowOfV2Project(
  projectId: BigNumberish | undefined,
  terminalAddress: string | undefined,
) {
  const { contracts } = useContext(V2UserContext)
  return useContractReader<BigNumber>({
    contract: contracts?.JBPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: projectId
      ? [terminalAddress, BigNumber.from(projectId).toHexString()]
      : null,
    valueDidChange: bigNumbersDiff,
    //TODO: updateOn for 'Pay' and 'Tap'
  })
}
