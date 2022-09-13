import { V3ContractName } from 'models/v3/contracts'
import { V3OperatorPermission } from 'models/v3/permissions'

import useContractReader from './V3ContractReader'

export function useV3HasPermissions({
  operator,
  account,
  domain,
  permissions,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissions: V3OperatorPermission[]
}) {
  const hasOperatorPermission = useContractReader<boolean>({
    contract: V3ContractName.JBOperatorStore,
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
