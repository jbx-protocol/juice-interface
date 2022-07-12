import { V1ContractName } from 'models/v1/contracts'
import { V1OperatorPermission } from 'models/v1/permissions'

import useContractReader from './ContractReader'

export function useV1HasPermissions({
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
  const hasOperatorPermission = useContractReader<boolean>({
    contract: V1ContractName.OperatorStore,
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
