import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'
import { useEffect, useState } from 'react'
import { loadJuiceboxV2OrV3Contract } from 'utils/v2v3/contractLoaders/JuiceboxV2OrV3'

/**
 * Load a JB V2 or V3 contract, depending on the given [cv].
 *
 * (optional) If [address] is provided, load the contract at that address.
 */
export const useLoadV2V3Contract = ({
  cv,
  contractName,
  address,
}: {
  contractName: V2V3ContractName | undefined
  cv: CV2V3 | undefined
  address?: string // optional address, to override the default address
}) => {
  const [contractJson, setContractJson] = useState<ContractJson>()

  useEffect(() => {
    async function loadAbi() {
      if (!cv || !contractName) return

      const contractJson = await loadJuiceboxV2OrV3Contract(
        cv,
        contractName,
        readNetwork.name,
      )

      setContractJson({
        address: address ?? contractJson?.address,
        abi: contractJson?.abi,
      })
    }

    loadAbi()
  }, [cv, contractName, address])

  return useLoadContractFromAddress({
    address: contractJson?.address,
    abi: contractJson?.abi,
  })
}
