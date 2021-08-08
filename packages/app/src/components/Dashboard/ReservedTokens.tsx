import { Button } from 'antd'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { TicketMod } from 'models/mods'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromPerbicent } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import TicketModsList from './TicketModsList'

export default function ReservedTokens({
  fundingCycle,
  ticketMods,
  hideActions,
}: {
  fundingCycle: FundingCycle | undefined
  ticketMods: TicketMod[] | undefined
  hideActions?: boolean
}) {
  const { userAddress, transactor, contracts } = useContext(UserContext)
  const [loadingPrint, setLoadingPrint] = useState<boolean>()

  const { projectId, isOwner, tokenSymbol } = useContext(ProjectContext)

  const metadata = decodeFCMetadata(fundingCycle?.metadata)

  const reservedTickets = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
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
          contract: ContractName.TerminalV1,
          eventName: 'Pay',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
        {
          contract: ContractName.TerminalV1,
          eventName: 'PrintPreminedTickets',
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
          contract: ContractName.TerminalV1,
          eventName: 'PrintReserveTickets',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
      ],
      [userAddress, projectId],
    ),
  })

  function print() {
    if (!transactor || !contracts || !projectId) return

    setLoadingPrint(true)

    transactor(
      contracts.TerminalV1,
      'printReservedTickets',
      [projectId.toHexString()],
      {
        onDone: () => setLoadingPrint(false),
      },
    )
  }

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

      <TicketModsList
        mods={ticketMods}
        fundingCycle={fundingCycle}
        projectId={projectId}
        isOwner={isOwner}
      />

      {!hideActions && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 20,
          }}
        >
          <span>
            {formatWad(reservedTickets) || 0} {tokenSymbol ?? 'tokens'}
          </span>
          <Button
            style={{ marginLeft: 10 }}
            loading={loadingPrint}
            size="small"
            onClick={print}
            disabled={!reservedTickets?.gt(0)}
          >
            Distribute
          </Button>
        </div>
      )}
    </div>
  )
}
