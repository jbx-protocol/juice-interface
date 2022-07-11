import { V1UserContext } from 'contexts/v1/userContext'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext } from 'react'

import useContractReader from './ContractReader'

export function useHasPermissions({
  operator,
  account,
  domain,
  permissionIndexes,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissionIndexes: V1OperatorPermission[]
}) {
  const { contracts } = useContext(V1UserContext)

  const hasOperatorPermission = useContractReader<boolean>({
    contract: contracts?.OperatorStore,
    functionName: 'hasPermissions',
    args:
      operator && account && domain !== undefined && permissionIndexes
        ? [
            operator, // _operator
            account, // _account
            domain, // _domain
            permissionIndexes,
          ]
        : null,
  })

  return hasOperatorPermission
}
