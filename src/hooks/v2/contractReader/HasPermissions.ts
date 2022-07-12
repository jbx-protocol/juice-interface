import { V2ContractName } from 'models/v2/contracts'
import { V2OperatorPermission } from 'models/v2/permissions'

import useContractReader from './V2ContractReader'

export function useV2HasPermissions({
  operator,
  account,
  domain,
  permissions,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissions: V2OperatorPermission[]
}) {
  const hasOperatorPermission = useContractReader<boolean>({
    contract: V2ContractName.JBOperatorStore,
    functionName: 'hasPermissions',
    args:
      operator && account && domain !== undefined && permissions
        ? [
            operator, // _operator
            account, // _account
            domain, // _domain
            permissions,
          ]
        : null,
  })

  return hasOperatorPermission
}
