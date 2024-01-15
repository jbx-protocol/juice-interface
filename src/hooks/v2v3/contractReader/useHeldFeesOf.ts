import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext, useEffect, useState } from 'react'
import { sumHeldFees } from 'utils/v2v3/math'
import { useProjectPrimaryEthTerminal } from '../V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminal'

export function useHeldFeesOf() {
  const [heldFees, setHeldFees] = useState<number>()

  const { projectId } = useContext(ProjectMetadataContext)
  if (!projectId) return
  const { JBETHPaymentTerminal } = useProjectPrimaryEthTerminal({ projectId })

  useEffect(() => {
    async function fetchData() {
      const res = await JBETHPaymentTerminal?.functions.heldFeesOf(projectId)
      if (!res) return
      const _heldFees = sumHeldFees(res[0])
      setHeldFees(_heldFees)
    }
    fetchData()
  }, [projectId, JBETHPaymentTerminal])

  return heldFees
}
