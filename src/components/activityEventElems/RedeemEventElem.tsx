import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV2V3TerminalVersion } from 'hooks/V2V3TerminalVersion'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function RedeemEventElem({
  event,
}: {
  event:
    | Pick<
        RedeemEvent,
        | 'id'
        | 'amount'
        | 'beneficiary'
        | 'txHash'
        | 'timestamp'
        | 'returnAmount'
        | 'terminal'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  const terminalVersion = useV2V3TerminalVersion(event?.terminal)

  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>Redeemed</Trans>
          </div>
          <div className="text-base">
            {formatWad(event.amount, { precision: 0 })}{' '}
            {tokenSymbolText({
              tokenSymbol,
              capitalize: false,
              plural: true,
            })}
          </div>
        </div>

        <div>
          <div className="text-right text-xs text-grey-400 dark:text-slate-200">
            {terminalVersion && (
              <ProjectVersionBadge
                className="p-0"
                transparent
                size="small"
                versionText={'V' + terminalVersion}
              />
            )}{' '}
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div className="text-right text-xs leading-6 text-grey-400 dark:text-slate-200">
            <FormattedAddress
              className="font-normal"
              address={event.beneficiary}
            />
          </div>
        </div>
      </div>

      <div className="text-grey-500 dark:text-grey-300">
        <Trans>
          <ETHAmount amount={event.returnAmount} /> overflow received
        </Trans>
      </div>
    </div>
  )
}
