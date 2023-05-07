import { Trans, t } from '@lingui/macro'
import { Modal, Space } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { TokenAmount } from 'components/TokenAmount'
import TicketModsList from 'components/v1/shared/TicketModsList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import useReservedTokensOfProject from 'hooks/v1/contractReader/useReservedTokensOfProject'
import { useDistributeTokensTx } from 'hooks/v1/transactor/useDistributeTokensTx'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

export default function DistributeTokensModal({
  open,
  onCancel,
  onConfirmed,
  reservedRate,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
  reservedRate: number
}) {
  const { tokenSymbol, currentFC, currentTicketMods, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()

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

  const tokensText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <Modal
      title={t`Send reserved ${tokensText}`}
      open={open}
      onOk={distribute}
      okText={t`Send ${tokensText}`}
      confirmLoading={loading}
      onCancel={onCancel}
      okButtonProps={{ disabled: !reservedTokens?.gt(0) }}
      width={640}
      centered={true}
    >
      <Space direction="vertical" className="w-full" size="large">
        <div className="flex justify-between">
          <Trans>
            Available:{' '}
            {reservedTokens ? (
              <TokenAmount
                amountWad={reservedTokens}
                tokenSymbol={tokenSymbol}
              />
            ) : null}
          </Trans>
        </div>
        {currentTicketMods?.length ? (
          <div>
            <h4>
              <Trans>Payouts will be sent to:</Trans>
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
            <Trans>All {tokensText} will go to the project owner:</Trans>{' '}
            <EthereumAddress address={owner} />
          </p>
        )}
      </Space>
    </Modal>
  )
}
