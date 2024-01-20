import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext, useEffect, useState } from 'react'
import { sumHeldFees } from 'utils/v2v3/math'

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
