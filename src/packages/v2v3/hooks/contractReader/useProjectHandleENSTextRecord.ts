import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'
import { namehash } from 'ethers/lib/utils'
import { useCallback, useMemo } from 'react'

import { useResolverForENS } from '../useENSResolver'
import useV2ContractReader from './useV2ContractReader'

export function useProjectHandleENSTextRecord(ensName: string | undefined) {
  const node = ensName
    ? namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))
    : undefined

  const Resolver = useResolverForENS(ensName)

  return useV2ContractReader<number>({
    contract: Resolver,
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
          contract: Resolver,
          eventName: 'TextChanged',
          topics: [[], projectHandleENSTextRecordKey],
        },
      ],
      [Resolver],
    ),
  })
}
