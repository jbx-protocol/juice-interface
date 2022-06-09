import { V2ContractName } from 'models/v2/contracts'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'

import useV2ContractReader from './V2ContractReader'

export function useProjectHandleENSTextRecord(ensName: string | undefined) {
  return useV2ContractReader<number>({
    contract: V2ContractName.PublicResolver,
    functionName: 'text',
    args: ensName ? [ensName, projectHandleENSTextRecordKey] : null,
    formatter: (val: string) => {
      let result = 0

      try {
        result = parseInt(val)
      } catch (e) {
        console.info('Error parsing project ID from text record', e)
      }

      // return 0 if text record is unset or not an integer
      return result
    },
  })
}
