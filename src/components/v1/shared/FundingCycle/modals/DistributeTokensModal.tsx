import { Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TicketModsList from 'components/v1/shared/TicketModsList'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import { useDistributeTokensTx } from 'hooks/v1/transactor/DistributeTokensTx'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

export default function DistributeTokensModal({
  visible,
  onCancel,
  onConfirmed,
  reservedRate,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
  reservedRate: number
}) {
  const [loading, setLoading] = useState<boolean>()
  const { tokenSymbol, currentFC, projectId, currentTicketMods, owner } =
    useContext(V1ProjectContext)
  const distributeTokensTx = useDistributeTokensTx()

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const reservedTokens = useReservedTokensOfProject(metadata?.reservedRate)

  function distribute() {
    setLoading(true)

    distributeTokensTx(undefined, {
      onDone: () => setLoading(false),
      onConfirmed: () => onConfirmed && onConfirmed(),
    })
  }

  const reservedTokensFormatted = formatWad(reservedTokens, { precision: 0 })

  return (
    <Modal
      title={`Distribute reserved ${tokenSymbolText({
        tokenSymbol: tokenSymbol,
        capitalize: false,
        plural: true,
      })}`}
      visible={visible}
      onOk={distribute}
      okText={`Distribute ${tokenSymbolText({
        tokenSymbol: tokenSymbol,
        capitalize: false,
        plural: true,
      })}`}
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
              reservedRate={reservedRate}
            />
          </div>
        ) : (
          <p>
            <Trans>
              All{' '}
              {tokenSymbolText({
                tokenSymbol: tokenSymbol,
                capitalize: false,
                plural: true,
              })}{' '}
              will go to the project owner:
            </Trans>{' '}
            <FormattedAddress address={owner} />
          </p>
        )}
      </Space>
    </Modal>
  )
}
