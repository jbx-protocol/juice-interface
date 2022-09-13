import { namehash } from 'ethers/lib/utils'
import { V3ContractName } from 'models/v3/contracts'
import { useCallback, useMemo } from 'react'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'

import useV3ContractReader from './V3ContractReader'

export function useProjectHandleENSTextRecord(ensName: string | undefined) {
  const node = ensName
    ? namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))
    : undefined

  return useV3ContractReader<number>({
    contract: V3ContractName.PublicResolver,
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
          contract: V3ContractName.PublicResolver,
          eventName: 'TextChanged',
          topics: [[], projectHandleENSTextRecordKey],
        },
      ],
      [],
    ),
  })
}
