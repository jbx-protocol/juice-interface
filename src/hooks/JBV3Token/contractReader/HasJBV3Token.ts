import { useJBTokenStoreForV3Token } from '../contracts/JBTokenStoreForV3Token'
import { useV1TicketBoothForV3Token } from '../contracts/V1TicketBoothForV3Token'
import { useV1ProjectId } from './V1ProjectId'

export function useHasJBV3Token() {
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBookContract = useV1TicketBoothForV3Token()

  const hasV1Token = Boolean(v1ProjectId && v1TicketBookContract)
  const hasV2Token = Boolean(useJBTokenStoreForV3Token())

  return Boolean(hasV1Token || hasV2Token)
}
