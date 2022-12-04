import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext, useEffect, useState } from 'react'
import { sumHeldFees } from 'utils/v2v3/math'

export function useHeldFeesOf() {
  const [heldFees, setHeldFees] = useState<number>()

  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ContractsContext)

  useEffect(() => {
    async function fetchData() {
      const res = await contracts?.JBETHPaymentTerminal.functions.heldFeesOf(
        projectId,
      )
      if (!res) return
      const _heldFees = sumHeldFees(res[0])
      setHeldFees(_heldFees)
    }
    fetchData()
  }, [contracts, projectId])

  return heldFees
}
