import { BigNumber } from '@ethersproject/bignumber'
import { Modal, Space } from 'antd'
import TicketModsList from 'components/Dashboard/TicketModsList'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

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

  const metadata = decodeFCMetadata(currentFC?.metadata)

  const reservedTokens = useContractReader<BigNumber>({
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
  })

  function distribute() {
    if (!transactor || !contracts || !projectId) return

    setLoading(true)

    transactor(
      contracts.TerminalV1,
      'printReservedTickets',
      [projectId.toHexString()],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => onConfirmed && onConfirmed(),
      },
    )
  }

  return (
    <Modal
      title={'Distribute reserved ' + tokenSymbol ?? 'tokens'}
      visible={visible}
      onOk={distribute}
      okText="Distribute"
      confirmLoading={loading}
      onCancel={onCancel}
      width={640}
      centered={true}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          Available:{' '}
          <div>
            {formatWad(reservedTokens, { decimals: 0 })}{' '}
            {tokenSymbol ?? 'tokens'}
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
              isOwner={false}
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
