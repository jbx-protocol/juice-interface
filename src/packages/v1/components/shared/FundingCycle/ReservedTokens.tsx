import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { TokenAmount } from 'components/TokenAmount'
import TooltipLabel from 'components/TooltipLabel'
import { RESERVED_RATE_EXPLANATION } from 'components/strings'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import useReservedTokensOfProject from 'packages/v1/hooks/contractReader/useReservedTokensOfProject'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { TicketMod } from 'packages/v1/models/mods'
import { decodeFundingCycleMetadata } from 'packages/v1/utils/fundingCycle'
import { useContext, useState } from 'react'
import { perbicentToPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import TicketModsList from '../TicketModsList'
import DistributeTokensModal from './modals/DistributeTokensModal'

export default function ReservedTokens({
  fundingCycle,
  ticketMods,
  hideActions,
}: {
  fundingCycle: V1FundingCycle | undefined
  ticketMods: TicketMod[] | undefined
  hideActions?: boolean
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [modalIsVisible, setModalIsVisible] = useState<boolean>()

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const reservedTokens = useReservedTokensOfProject(metadata?.reservedRate)

  const tokenTextPlural = tokenSymbolText({ tokenSymbol, plural: true })

  return (
    <div>
      <div>
        <TooltipLabel
          label={
            <h4 className="inline-block">
              <Trans>
                Reserved{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </Trans>{' '}
              ({perbicentToPercent(metadata?.reservedRate)}%)
            </h4>
          }
          tip={RESERVED_RATE_EXPLANATION}
        />
      </div>

      {metadata?.reservedRate ? (
        <TicketModsList
          mods={ticketMods}
          fundingCycle={fundingCycle}
          projectId={projectId}
          reservedRate={parseFloat(perbicentToPercent(metadata?.reservedRate))}
        />
      ) : null}

      {!hideActions && (
        <div className="mb-5 flex items-baseline justify-between">
          <span>
            <Trans>
              <TokenAmount
                amountWad={reservedTokens ?? BigInt(0)}
                tokenSymbol={tokenSymbol}
              />{' '}
              reserved
            </Trans>
          </span>
          <Button
            className="ml-2"
            size="small"
            onClick={() => setModalIsVisible(true)}
          >
            <Trans>Send reserved {tokenTextPlural}</Trans>
          </Button>

          <DistributeTokensModal
            open={modalIsVisible}
            reservedRate={parseFloat(
              perbicentToPercent(metadata?.reservedRate),
            )}
            onCancel={() => setModalIsVisible(false)}
            onConfirmed={() => setModalIsVisible(false)}
          />
        </div>
      )}
    </div>
  )
}
