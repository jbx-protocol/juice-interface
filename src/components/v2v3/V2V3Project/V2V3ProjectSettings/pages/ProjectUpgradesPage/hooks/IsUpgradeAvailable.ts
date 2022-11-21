import { CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

export function useIsUpgradeAvailable() {
  const { cvs } = useContext(V2V3ContractsContext)

  return !cvs?.find(cv => cv === CV_V3)
}
