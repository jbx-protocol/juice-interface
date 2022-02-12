import { V1TerminalName, V1TerminalVersion } from 'models/v1/terminals'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext, useEffect, useState } from 'react'
import { V1ContractName } from 'models/v1/contracts'

export function useTerminalAddress(version?: V1TerminalVersion) {
  const [address, setAddress] = useState<string | undefined>()
  const { contracts } = useContext(V1UserContext)

  useEffect(() => {
    if (!contracts) return
    let terminalContract

    if (version === '1') {
      terminalContract = contracts.TerminalV1
    } else if (version === '1.1') {
      terminalContract = contracts.TerminalV1_1
    }

    setAddress(terminalContract?.address)
  }, [version, contracts])

  return address
}

export function useTerminalName(address?: string) {
  const [name, setName] = useState<V1TerminalName | undefined>()
  const { contracts } = useContext(V1UserContext)

  useEffect(() => {
    if (!contracts || !address) return

    if (address.toLowerCase() === contracts.TerminalV1.address.toLowerCase()) {
      setName(V1ContractName.TerminalV1)
    }
    if (
      address.toLowerCase() === contracts.TerminalV1_1.address.toLowerCase()
    ) {
      setName(V1ContractName.TerminalV1_1)
    }
  }, [address, contracts])

  return name
}

export function useTerminalVersion(address?: string) {
  const [version, setVersion] = useState<V1TerminalVersion | undefined>()
  const { contracts } = useContext(V1UserContext)

  useEffect(() => {
    if (!contracts || !address) return

    if (address.toLowerCase() === contracts.TerminalV1.address.toLowerCase()) {
      setVersion('1')
    }
    if (
      address.toLowerCase() === contracts.TerminalV1_1.address.toLowerCase()
    ) {
      setVersion('1.1')
    }
  }, [address, contracts])

  return version
}
