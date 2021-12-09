import { BigNumber } from '@ethersproject/bignumber'
import { Modal, Space } from 'antd'
import { plural } from '@lingui/macro'
import FormattedAddress from 'components/shared/FormattedAddress'
import TicketModsList from 'components/shared/TicketModsList'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
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
  const { contracts, transactor } = useContext(UserContext)
  const { tokenSymbol, currentFC, projectId, currentTicketMods, owner } =
    useContext(ProjectContext)

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const reservedTokens = useContractReader<BigNumber>({
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
  })

  function distribute() {
    if (!transactor || !contracts || !projectId) return

    setLoading(true)

    transactor(
      contracts.TerminalV1_1,
      'printReservedTickets',
      [projectId.toHexString()],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => onConfirmed && onConfirmed(),
      },
    )
  }

  const reservedTokensFormatted = formatWad(reservedTokens, { decimals: 0 })

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
          Available:{' '}
          <div>
            {tokenSymbol
              ? `${reservedTokensFormatted} ${tokenSymbol}`
              : plural(reservedTokensFormatted ?? 0, {
                  one: '# token',
                  other: '# tokens',
                })}
          </div>
        </div>
        {currentTicketMods?.length ? (
          <div>
            <h4>Funds will be distributed to:</h4>
            <TicketModsList
              total={reservedTokens}
              mods={currentTicketMods}
              fundingCycle={currentFC}
              projectId={projectId}
            />
          </div>
        ) : (
          <p>
            All {tokenSymbol ?? 'tokens'} will go to the project owner:{' '}
            <FormattedAddress address={owner} />
          </p>
        )}
      </Space>
    </Modal>
  )
}
