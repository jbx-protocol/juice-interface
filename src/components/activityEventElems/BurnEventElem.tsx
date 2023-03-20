import { t } from '@lingui/macro'
import { PV_V1, PV_V2 } from 'constants/pv'
import useSymbolOfERC20 from 'hooks/ERC20/SymbolOfERC20'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import { BurnEvent } from 'models/subgraph-entities/vX/burn-event'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { ActivityEvent } from './ActivityElement'

export default function BurnEventElem({
  event,
}: {
  event:
    | Pick<
        BurnEvent,
        'amount' | 'timestamp' | 'caller' | 'id' | 'txHash' | 'projectId' | 'pv'
      >
    | undefined
}) {
  const v1TokenAddress = useTokenAddressOfProject(
    event?.pv === PV_V1 ? event?.projectId : undefined,
  )
  const { data: v2TokenAddress } = useProjectToken({
    projectId: event?.pv === PV_V2 ? event?.projectId : undefined,
  })
  const { data: tokenSymbol } = useSymbolOfERC20(
    event?.pv === PV_V2 ? v2TokenAddress : v1TokenAddress,
  )

  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Burned`}
      subject={
        <span className="text-base font-medium">
          {formatWad(event.amount)}{' '}
          {tokenSymbolText({
            tokenSymbol,
          })}
        </span>
      }
    />
  )
}
