import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { useDistributeReservedTokens } from 'hooks/v2/transactor/DistributeReservedTokensTx'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import SplitList from 'components/v2/shared/SplitList'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectReservedTokens from 'hooks/v2/contractReader/ProjectReservedTokens'
import TransactionModal from 'components/shared/TransactionModal'

export default function DistributeReservedTokensModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    tokenSymbol,
    reservedTokensSplits,
    projectOwnerAddress,
    fundingCycleMetadata,
    projectId,
  } = useContext(V2ProjectContext)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const distributeReservedTokensTx = useDistributeReservedTokens()
  const { data: reservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: fundingCycleMetadata?.reservedRate,
  })

  async function distributeReservedTokens() {
    setLoading(true)

    const txSuccessful = await distributeReservedTokensTx(
      {},
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setLoading(false)
          setTransactionPending(false)
          onConfirmed?.()
        },
      },
    )

    if (!txSuccessful) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  const reservedTokensFormatted = formatWad(reservedTokens, { precision: 0 })
  const tokenTextPlural = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const tokenTextSingular = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <TransactionModal
      title={<Trans>Distribute reserved {tokenTextPlural}</Trans>}
      visible={visible}
      onOk={() => distributeReservedTokens()}
      okText={t`Distribute ${tokenTextPlural}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      okButtonProps={{ disabled: !reservedTokens?.gt(0) }}
      width={640}
      centered={true}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Trans>
            Reserved {tokenTextPlural}:{' '}
            <span>
              {reservedTokensFormatted} {tokenTextPlural}
            </span>
          </Trans>
        </div>
        <div>
          <h4>
            <Trans>{tokenTextSingular} recipients</Trans>
          </h4>

          {reservedTokensSplits?.length === 0 ? (
            <p>
              <Trans>
                There are no reserved token recipients defined for this funding
                cycle. The project owner will receive all available tokens.
              </Trans>
            </p>
          ) : null}

          <SplitList
            splits={reservedTokensSplits ?? []}
            projectOwnerAddress={projectOwnerAddress}
            totalValue={reservedTokens}
            valueSuffix={tokenTextPlural}
            showSplitValues
            valueFormatProps={{ precision: 0 }}
          />
        </div>
      </Space>
    </TransactionModal>
  )
}
