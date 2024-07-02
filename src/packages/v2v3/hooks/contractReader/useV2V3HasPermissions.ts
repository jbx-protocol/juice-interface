import { Contract } from 'ethers'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { V2V3OperatorPermission } from 'packages/v2v3/models/permissions'

import useContractReader from './useV2ContractReader'

export function useV2V3HasPermissions({
  operator,
  account,
  domain,
  permissions,
  JBOperatorStore,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissions: V2V3OperatorPermission[]
  JBOperatorStore?: Contract
}) {
  const hasOperatorPermission = useContractReader<boolean>({
    contract: JBOperatorStore ?? V2V3ContractName.JBOperatorStore,
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
