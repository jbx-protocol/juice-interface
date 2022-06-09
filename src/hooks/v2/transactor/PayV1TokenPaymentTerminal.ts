import { useContext, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import JBV1TokenPaymentTerminal from '@jbx-protocol/juice-v1-token-terminal/out/JBV1TokenPaymentTerminal.sol/JBV1TokenPaymentTerminal.json'
import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'

import { TransactorInstance } from '../../Transactor'
import { readNetwork } from 'constants/networks'
import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'

const DEFAULT_DELEGATE_METADATA = 0

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayV1TokenPaymentTerminal(): PayV2ProjectTx {
  const { signingProvider } = useContext(NetworkContext)
  const { transactor } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  const [contract, setContract] = useState<Contract>()

  const contractAddress = JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]

  useEffect(() => {
    if (!contractAddress) return

    const v1TokenPaymentTerminalContract = new Contract(
      contractAddress,
      JBV1TokenPaymentTerminal.abi,
      signingProvider?.getSigner(),
    )

    setContract(v1TokenPaymentTerminalContract)
  }, [contractAddress, signingProvider])

  const minReturnedTokens = 1 // TODO will need a field for this in V2ConfirmPayOwnerModal

  return ({ memo, preferClaimedTokens, beneficiary, value }, txOpts) => {
    if (!transactor || !projectId || !contract || !beneficiary) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contract,
      'pay',
      [
        projectId,
        value,
        constants.AddressZero,
        beneficiary,
        minReturnedTokens,
        preferClaimedTokens,
        memo || '',
        DEFAULT_DELEGATE_METADATA, //delegateMetadata
      ],
      {
        ...txOpts,
      },
    )
  }
}
