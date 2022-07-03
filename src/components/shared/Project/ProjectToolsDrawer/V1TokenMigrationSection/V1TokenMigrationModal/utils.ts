import { getAddress } from '@ethersproject/address'

import { readNetwork } from 'constants/networks'
import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'

export const hasV1TokenPaymentTerminal = (
  terminals: string[] | undefined,
): boolean => {
  if (!terminals) return false

  const terminalAddress = JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]
  if (!terminalAddress) return false

  return Boolean(
    terminalAddress && terminals.includes(getAddress(terminalAddress)),
  )
}
