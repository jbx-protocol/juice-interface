import { namehash } from 'ethers/lib/utils'
import { V2ContractName } from 'models/v2/contracts'
import { useCallback, useMemo } from 'react'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'

import useV2ContractReader from './V2ContractReader'

export function useProjectHandleENSTextRecord(ensName: string | undefined) {
  const node = ensName
    ? namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))
    : undefined

  return useV2ContractReader<number>({
    contract: V2ContractName.PublicResolver,
    functionName: 'text',
    args: node ? [node, projectHandleENSTextRecordKey] : null,
    formatter: useCallback((val: string) => {
      try {
        return parseInt(val)
      } catch (e) {
        console.info('Error parsing project ID from text record', e)
      }

      // return 0 if text record is unset or not an integer
      return 0
    }, []),
    updateOn: useMemo(
      () => [
        {
          contract: V2ContractName.PublicResolver,
          eventName: 'TextChanged',
          topics: [[], projectHandleENSTextRecordKey],
        },
      ],
      [],
    ),
  })
}
