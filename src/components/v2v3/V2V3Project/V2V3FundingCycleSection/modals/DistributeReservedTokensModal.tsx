import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useProjectReservedTokens from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useDistributeReservedTokens } from 'hooks/v2v3/transactor/DistributeReservedTokensTx'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function DistributeReservedTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    tokenSymbol,
    reservedTokensSplits,
    projectOwnerAddress,
    fundingCycleMetadata,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

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
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const tokenTextSingular = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <TransactionModal
      title={<Trans>Send out reserved {tokenTextPlural}</Trans>}
      open={open}
      onOk={() => distributeReservedTokens()}
      okText={t`Distribute ${tokenTextPlural}`}
      connectWalletText={t`Connect wallet to send reserves`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      okButtonProps={{ disabled: !reservedTokens?.gt(0) }}
      width={640}
      centered={true}
    >
      <Space direction="vertical" className="w-full" size="large">
        <div className="flex justify-between">
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
                The project owner is the only reserved token recipient. Any
                reserved tokens sent out this cycle will go to them.
              </Trans>
            </p>
          ) : null}

          <SplitList
            splits={reservedTokensSplits ?? []}
            projectOwnerAddress={projectOwnerAddress}
            totalValue={reservedTokens}
            valueSuffix={tokenTextPlural}
            showAmounts
            valueFormatProps={{ precision: 0 }}
          />
        </div>
      </Space>
    </TransactionModal>
  )
}
