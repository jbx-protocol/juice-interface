import { Button } from 'antd'
import { t, Trans } from '@lingui/macro'
import TooltipLabel from 'components/shared/TooltipLabel'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { TicketMod } from 'models/mods'
import { NetworkName } from 'models/network-name'
import { useContext, useState } from 'react'
import { formatWad, perbicentToPercent } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { readNetwork } from 'constants/networks'

import DistributeTokensModal from './modals/DistributeTokensModal'
import TicketModsList from '../../shared/TicketModsList'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'

export default function ReservedTokens({
  fundingCycle,
  ticketMods,
  hideActions,
}: {
  fundingCycle: V1FundingCycle | undefined
  ticketMods: TicketMod[] | undefined
  hideActions?: boolean
}) {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>()

  const { projectId, tokenSymbol, isPreviewMode } = useContext(V1ProjectContext)

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const reservedTokens = useReservedTokensOfProject(metadata?.reservedRate)

  const tokenTextPlural = tokenSymbolText({ tokenSymbol, plural: true })

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.CONSTITUTION_DAO

  const isSharkDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.SHARK_DAO

  return (
    <div>
      <div>
        <TooltipLabel
          label={
            <h4 style={{ display: 'inline-block' }}>
              <Trans>
                Reserved{' '}
                {tokenSymbolText({
                  tokenSymbol: tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </Trans>{' '}
              ({perbicentToPercent(metadata?.reservedRate)}%)
            </h4>
          }
          tip={t`A project can reserve a percentage of the tokens minted from payments it receives. Reserved tokens can be distributed according to the allocation below at any time.`}
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

      {!hideActions && !isConstitutionDAO && !isSharkDAO && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 20,
          }}
        >
          <span>
            <Trans>
              {formatWad(reservedTokens, { precision: 0 }) || 0}{' '}
              {tokenTextPlural} reserved
            </Trans>
          </span>
          <Button
            style={{ marginLeft: 10 }}
            size="small"
            onClick={() => setModalIsVisible(true)}
            disabled={isPreviewMode}
          >
            <Trans>Distribute {tokenTextPlural}</Trans>
          </Button>

          <DistributeTokensModal
            visible={modalIsVisible}
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
