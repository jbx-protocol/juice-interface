import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import { TicketMod } from 'models/v1/mods'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { useContext, useState } from 'react'
import { formatWad, perbicentToPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import TicketModsList from '../TicketModsList'
import DistributeTokensModal from './modals/DistributeTokensModal'
import { RESERVED_RATE_EXPLAINATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'

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
          tip={RESERVED_RATE_EXPLAINATION}
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
              {formatWad(reservedTokens, { precision: 0 }) || 0}{' '}
              {tokenTextPlural} reserved
            </Trans>
          </span>
          <Button
            className="ml-2"
            size="small"
            onClick={() => setModalIsVisible(true)}
          >
            <Trans>Send out {tokenTextPlural}</Trans>
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
