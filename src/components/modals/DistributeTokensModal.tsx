import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'

import { Modal, Space } from 'antd'
import FormattedAddress from 'components/shared/FormattedAddress'
import TicketModsList from 'components/shared/TicketModsList'
import { ProjectContext } from 'contexts/projectContext'
import { UserContextV1 } from 'contexts/userContextV1'
import useContractReaderV1 from 'hooks/v1/ContractReaderV1'
import { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

export default function DistributeTokensModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const { contracts, transactor } = useContext(UserContextV1)
  const {
    tokenSymbol,
    currentFC,
    projectId,
    currentTicketMods,
    owner,
    terminal,
  } = useContext(ProjectContext)

  const terminalJuiceboxV1ContractName = terminal?.name

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const reservedTokens = useContractReaderV1<BigNumber>({
    contract: terminalJuiceboxV1ContractName,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [
            projectId.toHexString(),
            BigNumber.from(metadata.reservedRate).toHexString(),
          ]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  function distribute() {
    if (!transactor || !contracts || !projectId || !terminal) return

    setLoading(true)

    transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'printReservedTickets',
      [projectId.toHexString()],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => onConfirmed && onConfirmed(),
      },
    )
  }

  const reservedTokensFormatted = formatWad(reservedTokens, { precision: 0 })

  return (
    <Modal
      title={`Distribute reserved ${tokenSymbol ?? 'tokens'}`}
      visible={visible}
      onOk={distribute}
      okText={`Distribute ${tokenSymbol ?? 'tokens'}`}
      confirmLoading={loading}
      onCancel={onCancel}
      okButtonProps={{ disabled: !reservedTokens?.gt(0) }}
      width={640}
      centered={true}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Trans>Available:</Trans>{' '}
          <div>
            {tokenSymbol
              ? `${reservedTokensFormatted} ${tokenSymbol}`
              : reservedTokensFormatted}
          </div>
        </div>
        {currentTicketMods?.length ? (
          <div>
            <h4>
              <Trans>Funds will be distributed to:</Trans>
            </h4>
            <TicketModsList
              total={reservedTokens}
              mods={currentTicketMods}
              fundingCycle={currentFC}
              projectId={projectId}
            />
          </div>
        ) : (
          <p>
            <Trans>
              All {tokenSymbol ?? 'tokens'} will go to the project owner:
            </Trans>{' '}
            <FormattedAddress address={owner} />
          </p>
        )}
      </Space>
    </Modal>
  )
}
