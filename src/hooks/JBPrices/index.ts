import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { Contract } from 'ethers'
import { CV2V3 } from 'models/v2v3/cv'
import { useContext, useEffect, useState } from 'react'
import { loadJBPrices } from './loadJBPrices'

export function useJBPrices({ cv }: { cv?: CV2V3 } = {}) {
  const { cv: defaultCv } = useContext(V2V3ContractsContext)
  const [contract, setContract] = useState<Contract | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const JBPrices = await loadJBPrices({ cv: cv ?? defaultCv })
      setContract(JBPrices)
    }

    load()
  }, [cv, defaultCv])

  return contract
}
