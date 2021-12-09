import { Button } from 'antd'
import TooltipLabel from 'components/shared/TooltipLabel'

import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { BigNumber } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { TicketMod } from 'models/mods'
import { NetworkName } from 'models/network-name'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromPerbicent } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import { readNetwork } from 'constants/networks'

import DistributeTokensModal from '../modals/DistributeTokensModal'
import TicketModsList from '../shared/TicketModsList'

export default function ReservedTokens({
  fundingCycle,
  ticketMods,
  hideActions,
}: {
  fundingCycle: FundingCycle | undefined
  ticketMods: TicketMod[] | undefined
  hideActions?: boolean
}) {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>()
  const { userAddress } = useContext(NetworkContext)

  const { projectId, tokenSymbol, isPreviewMode } = useContext(ProjectContext)

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const reservedTickets = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1_1,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [
            projectId.toHexString(),
            BigNumber.from(metadata.reservedRate).toHexString(),
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () => [
        {
          contract: ContractName.TerminalV1_1,
          eventName: 'Pay',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
        {
          contract: ContractName.TerminalV1_1,
          eventName: 'PrintTickets',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
        {
          contract: ContractName.TicketBooth,
          eventName: 'Redeem',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
        {
          contract: ContractName.TicketBooth,
          eventName: 'Convert',
          topics:
            userAddress && projectId
              ? [userAddress, projectId.toHexString()]
              : undefined,
        },
        {
          contract: ContractName.TerminalV1_1,
          eventName: 'PrintReserveTickets',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
      ],
      [userAddress, projectId],
    ),
  })

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet && projectId?.eq(36)

  const isSharkDAO =
    readNetwork.name === NetworkName.mainnet && projectId?.eq(7)

  return (
    <div>
      <div>
        <TooltipLabel
          label={
            <h4 style={{ display: 'inline-block' }}>
              Reserved {tokenSymbol ?? 'tokens'} (
              {fromPerbicent(metadata?.reservedRate)}%)
            </h4>
          }
          tip="A project can reserve a percentage of tokens minted from every payment it receives. They can be distributed to the receivers below at any time."
        />
      </div>

      {metadata?.reservedRate ? (
        <TicketModsList
          mods={ticketMods}
          fundingCycle={fundingCycle}
          projectId={projectId}
        />
      ) : null}

      {!hideActions && !isConstitutionDAO && !isSharkDAO && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 20,
          }}
        >
          <span>
            {formatWad(reservedTickets, { decimals: 0 }) || 0}{' '}
            {tokenSymbol ?? 'tokens'}
          </span>
          <Button
            style={{ marginLeft: 10 }}
            size="small"
            onClick={() => setModalIsVisible(true)}
            disabled={isPreviewMode}
          >
            Distribute
          </Button>

          <DistributeTokensModal
            visible={modalIsVisible}
            onCancel={() => setModalIsVisible(false)}
            onConfirmed={() => setModalIsVisible(false)}
          />
        </div>
      )}
    </div>
  )
}
