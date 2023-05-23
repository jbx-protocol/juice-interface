import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { PayButtonProps } from 'components/Project/PayProjectForm/payProjectFormContext'
import ETHAmount from 'components/currency/ETHAmount'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { V2V3ConfirmPayModal } from './V2V3ConfirmPayModal'
import { useV2V3PayButton } from './hooks/useV2V3PayButton'

export function V2V3PayButton({ disabled, wrapperClassName }: PayButtonProps) {
  const {
    customPayButtonText,
    payInCurrency,
    weiPayAmt,
    payModalVisible,
    onPayClick,
    onPayCancel,
    isArchived,
    payIsPaused,
    fundingCycleLoading,
    primaryETHTerminalLoading,
  } = useV2V3PayButton()

  const payButtonText = useMemo(
    () => customPayButtonText ?? t`Pay`,
    [customPayButtonText],
  )

  const disabledMessage = useMemo(() => {
    if (isArchived) {
      return t`This project is archived and can't be paid.`
    }
    if (payIsPaused) {
      return t`Payments to this project are paused in this cycle.`
    }
  }, [isArchived, payIsPaused])
  const isPayDisabled = useMemo(() => {
    return isArchived || payIsPaused || disabled
  }, [disabled, isArchived, payIsPaused])

  const showPaidAsEth = useMemo(() => {
    return payInCurrency === V2V3_CURRENCY_USD
  }, [payInCurrency])

  return (
    <div className={twMerge('text-center', wrapperClassName)}>
      <Tooltip
        open={isPayDisabled ? undefined : false}
        title={disabledMessage}
        className="block"
      >
        <Button
          // Need inline style here because AntD Button overrides className when disabled
          style={{
            width: '100%',
          }}
          type="primary"
          size="large"
          onClick={onPayClick}
          disabled={isPayDisabled}
          loading={fundingCycleLoading || primaryETHTerminalLoading}
        >
          <span>{payButtonText}</span>
        </Button>
      </Tooltip>
      {showPaidAsEth && (
        <div className="mt-2 text-xs">
          <Trans>
            Paid as <ETHAmount amount={weiPayAmt} />
          </Trans>
        </div>
      )}

      <V2V3ConfirmPayModal
        open={payModalVisible}
        onCancel={onPayCancel}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}
