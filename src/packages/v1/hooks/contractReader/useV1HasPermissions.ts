import { V1ContractName } from 'packages/v1/models/contracts'
import { V1OperatorPermission } from 'packages/v1/models/permissions'

import useContractReader from './useContractReader'

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
}): boolean {
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

  return Boolean(hasOperatorPermission)
}
