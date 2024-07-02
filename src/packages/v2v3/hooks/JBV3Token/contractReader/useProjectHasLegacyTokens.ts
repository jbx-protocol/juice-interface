import { useJBTokenStoreForV3Token } from '../contracts/useJBTokenStoreForV3Token'
import { useV1TicketBoothForV3Token } from '../contracts/useV1TicketBoothForV3Token'
import { useV1ProjectId } from './useV1ProjectId'

export function useProjectHasLegacyTokens() {
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBookContract = useV1TicketBoothForV3Token()

  const hasV1Token = Boolean(v1ProjectId && v1TicketBookContract)
  const hasV2Token = Boolean(useJBTokenStoreForV3Token())

  return Boolean(hasV1Token || hasV2Token)
}
