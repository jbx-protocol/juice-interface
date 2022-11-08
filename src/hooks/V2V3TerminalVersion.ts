import { getAddress } from '@ethersproject/address'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'
import { useLoadV2V3Contract } from './v2v3/LoadV2V3Contract'

export function useV2V3TerminalVersion(
  address: string | undefined,
): CV2V3 | undefined {
  const V2Terminal = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBETHPaymentTerminal,
  })
  const V3Terminal = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBETHPaymentTerminal,
  })

  if (!(V2Terminal && V3Terminal)) return

  const v2TerminalAddress = getAddress(V2Terminal.address)
  const v3TerminalAddress = getAddress(V3Terminal.address)

  if (!address) return

  switch (getAddress(address)) {
    case v2TerminalAddress:
      return CV_V2
    case v3TerminalAddress:
      return CV_V3
  }
}
