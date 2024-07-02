import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { JB721DelegateVersion } from 'packages/v2v3/models/contracts'
import { isZeroAddress } from 'utils/address'

export function useJB721DelegateVersion({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}) {
  return useQuery({
    queryKey: ['JB721DelegateVersion', dataSourceAddress],
    queryFn: async () => {
      const res = await axios.get<{ version: JB721DelegateVersion }>(
        `/api/juicebox/jb-721-delegate/${dataSourceAddress}`,
      )

      return res.data?.version
    },
    enabled: !!dataSourceAddress && !isZeroAddress(dataSourceAddress),
  })
}
