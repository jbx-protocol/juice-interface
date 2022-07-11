import v1OperatorStoreJSON from '@jbx-protocol/contracts-v1/deployments/rinkeby/OperatorStore.json'
import { Contract } from '@ethersproject/contracts'

import useContractReader from './ContractReader'
import { readProvider } from 'constants/readProvider'

export enum OperatorPermission {
  'Configure' = 1,
  'PrintPreminedTickets' = 2,
  'Redeem' = 3,
  'Migrate' = 4,
  'SetHandle' = 5,
  'SetUri' = 6,
  'ClaimHandle' = 7,
  'RenewHandle' = 8,
  'Issue' = 9,
  'Stake' = 10,
  'Unstake' = 11,
  'Transfer' = 12,
  'Lock' = 13,
  'SetPayoutMods' = 14,
  'SetTicketMods' = 15,
  'SetTerminal' = 16,
  'PrintTickets' = 17,
}

export function useHasPermissions({
  operator,
  account,
  domain,
  permissionIndexes,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissionIndexes: OperatorPermission[]
}) {
  const contract = new Contract(
    v1OperatorStoreJSON.address,
    v1OperatorStoreJSON.abi,
    readProvider,
  )

  const hasOperatorPermission = useContractReader<boolean>({
    contract,
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
