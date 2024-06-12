import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { sumHeldFees } from 'packages/v2v3/utils/math'
import { useContext, useEffect, useState } from 'react'

export function useHeldFeesOf() {
  const [heldFees, setHeldFees] = useState<number>()
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)

  useEffect(() => {
    async function fetchData() {
      const res = await contracts.JBETHPaymentTerminal?.functions.heldFeesOf(
        projectId,
      )
      if (!res) return
      const _heldFees = sumHeldFees(res[0])
      setHeldFees(_heldFees)
    }
    fetchData()
  }, [projectId, contracts])
  return heldFees
}
