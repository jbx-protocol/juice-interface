import axios from 'axios'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { useQuery } from 'react-query'
import { isZeroAddress } from 'utils/address'

export function useJB721DelegateVersion({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}) {
  return useQuery(
    ['JB721DelegateVersion', dataSourceAddress],
    async () => {
      const res = await axios.get<{ version: JB721DelegateVersion }>(
        `/api/juicebox/jb-721-delegate/${dataSourceAddress}`,
      )

      return res.data?.version
    },
    {
      enabled: !!dataSourceAddress && !isZeroAddress(dataSourceAddress),
    },
  )
}
