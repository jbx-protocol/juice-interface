import { readNetwork } from 'constants/networks'
import { CV2V3 } from 'models/v2v3/cv'
import { useEffect, useState } from 'react'
import { ContractJson } from 'utils/v2v3/loadV2V3Contract'

export function useV2V3TerminalVersion(
  address: string | undefined,
): CV2V3 | undefined {
  const [v2Address, setV2Address] = useState<string>()
  const [v3Address, setV3Address] = useState<string>()

  useEffect(() => {
    async function loadV2() {
      const address = (
        (await import(
          `@jbx-protocol/contracts-v2-latest/deployments/${readNetwork.name}/JBETHPaymentTerminal.json`
        )) as ContractJson
      ).address

      try {
        setV2Address(address)
      } catch (e) {
        console.error('Failed to load V2 JBETHPaymentTerminal', e)
      }
    }
    async function loadV3() {
      const address = (
        (await import(
          `@jbx-protocol/juice-contracts-v3/deployments/${readNetwork.name}/JBETHPaymentTerminal.json`
        )) as ContractJson
      ).address

      try {
        setV3Address(address)
      } catch (e) {
        console.error('Failed to load V3 JBETHPaymentTerminal', e)
      }
    }

    loadV2()
    loadV3()
  }, [])

  if (!address) return

  switch (address.toLowerCase()) {
    case v2Address?.toLowerCase():
      return '2'
    case v3Address?.toLowerCase():
      return '3'
  }
}
