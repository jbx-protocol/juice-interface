import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import PayWarningModal from 'components/modals/PayWarningModal'
import {
  PayButtonProps,
  PayProjectFormContext,
} from 'components/v1/V1Project/PayProjectForm/payProjectFormContext'
import { PROJECT_PAGE } from 'constants/fathomEvents'
import { readNetwork } from 'constants/networks'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import { disablePayOverrides } from 'constants/v1/overrides'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import useWeiConverter from 'hooks/useWeiConverter'
import { trackFathomGoal } from 'lib/fathom'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import V1ConfirmPayOwnerModal from './modals/V1ConfirmPayOwnerModal'

export function V1PayButton({ wrapperClassName, disabled }: PayButtonProps) {
  const { currentFC, terminal } = useContext(V1ProjectContext)
  const { projectId, isArchived, projectMetadata } = useContext(
    ProjectMetadataContext,
  )

  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const { payInCurrency, payAmount } = payProjectForm ?? {}

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const weiPayAmt = useWeiConverter<V1CurrencyOption>({
    currency: payInCurrency as V1CurrencyOption,
    amount: payAmount,
  })

  if (!projectMetadata || !currentFC) return null

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  if (!fcMetadata) return null

  const payButtonText = projectMetadata.payButton?.length
    ? projectMetadata.payButton
    : t`Pay`

  // v1 projects who still use 100% RR to disable pay
  const isV1AndMaxRR =
    terminal?.version === '1' && fcMetadata.reservedRate === 200

  const overridePayDisabled =
    projectId && disablePayOverrides[readNetwork.name]?.has(projectId)

  const shouldDisableButton =
    (fcMetadata.payIsPaused || // v1.1 only
      overridePayDisabled ||
      isV1AndMaxRR || // v1 projects who still use 100% RR to disable pay
      currentFC.configured.eq(0) || // Edge case, see sequoiacapitaldao
      isArchived ||
      disabled) ??
    false

  let disabledMessage: string | undefined = shouldDisableButton
    ? t`Paying this project is currently disabled.`
    : undefined

  if (isArchived) {
    disabledMessage = t`This project is archived and can't be paid.`
  } else if (isV1AndMaxRR) {
    disabledMessage = t`We've disabled payments because the project has opted to reserve 100% of new tokens. You would receive no tokens from your payment.`
  } else if (fcMetadata.payIsPaused) {
    disabledMessage = t`Payments to this project are paused in this cycle.`
  }

  const onPayButtonClick = () => {
    setPayWarningModalVisible(true)
    trackFathomGoal(PROJECT_PAGE.PAY_CTA)
  }

  return (
    <div className={twMerge('text-center', wrapperClassName)}>
      <Tooltip
        title={disabledMessage}
        className="block"
        open={disabledMessage ? undefined : false}
      >
        <Button
          type="primary"
          onClick={onPayButtonClick}
          disabled={shouldDisableButton}
          style={{ width: '100%' }}
          size="large"
        >
          {payButtonText}
        </Button>
      </Tooltip>
      {payInCurrency === V1_CURRENCY_USD && (
        <div className="text-xs">
          <Trans>
            Paid as <ETHAmount amount={weiPayAmt} />
          </Trans>
        </div>
      )}
      <PayWarningModal
        open={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <V1ConfirmPayOwnerModal
        open={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
        payButtonText={payButtonText}
      />
    </div>
  )
}
