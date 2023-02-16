import { CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { JBUpgrade } from './upgrades'

export function useAvailableUpgrades(): JBUpgrade[] | undefined {
  const { cvs, contracts } = useContext(V2V3ContractsContext)
  const { contracts: projectContracts } = useContext(
    V2V3ProjectContractsContext,
  )

  if (!cvs?.includes(CV_V3)) {
    return ['3']
  }

  if (
    projectContracts?.JBController &&
    contracts?.JBController3_0_1 &&
    !isEqualAddress(
      projectContracts.JBController.address,
      contracts.JBController3_0_1?.address,
    )
  ) {
    return ['JBController3_0_1']
  }
}
