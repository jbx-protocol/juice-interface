import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { CV2V3 } from 'models/cv'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useEffect, useState } from 'react'
import { loadJuiceboxV2OrV3Contract } from 'utils/v2v3/contractLoaders/JuiceboxV2OrV3'

export const useLoadV2V3Contract = ({
  cv,
  contractName,
  address,
}: {
  contractName: V2V3ContractName
  cv: CV2V3 | undefined
  address?: string // optional address, to override the default address
}) => {
  const [contractJson, setContractJson] = useState<{
    address: string
    abi: string
  }>()

  useEffect(() => {
    async function loadAbi() {
      if (!cv) return

      const contractJson = await loadJuiceboxV2OrV3Contract(
        cv,
        contractName,
        readNetwork.name,
      )

      setContractJson({
        address: address ?? contractJson.address,
        abi: contractJson.abi,
      })
    }

    loadAbi()
  }, [cv, contractName, address])

  return useLoadContractFromAddress({
    address: contractJson?.address,
    abi: contractJson?.abi,
  })
}
