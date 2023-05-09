import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import {
  PayButtonProps,
  PayProjectFormContext,
} from 'components/Project/PayProjectForm/payProjectFormContext'
import { PROJECT_PAGE } from 'constants/fathomEvents'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useWeiConverter from 'hooks/useWeiConverter'
import { trackFathomGoal } from 'lib/fathom'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { V2V3ConfirmPayModal } from './V2V3ConfirmPayModal'

export function V2V3PayButton({ disabled, wrapperClassName }: PayButtonProps) {
  const {
    fundingCycleMetadata,
    loading: { fundingCycleLoading, primaryETHTerminalLoading },
  } = useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived } = useContext(ProjectMetadataContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const { payInCurrency, payAmount } = payProjectForm ?? {}

  const weiPayAmt = useWeiConverter<V2V3CurrencyOption>({
    currency: payInCurrency as V2V3CurrencyOption,
    amount: payAmount,
  })

  const payButtonText = projectMetadata?.payButton?.length
    ? projectMetadata.payButton
    : t`Pay`

  let disabledMessage: string | undefined
  if (isArchived) {
    disabledMessage = t`This project is archived and can't be paid.`
  } else if (fundingCycleMetadata?.pausePay) {
    disabledMessage = t`Payments to this project are paused in this cycle.`
  }

  const isPayDisabled = Boolean(disabledMessage) || disabled

  return (
    <div className={twMerge('text-center', wrapperClassName)}>
      <Tooltip
        open={isPayDisabled ? undefined : false}
        title={disabledMessage}
        className="block"
      >
        <Button
          className="w-full"
          type="primary"
          size="large"
          onClick={() => {
            setPayModalVisible(true)
            trackFathomGoal(PROJECT_PAGE.PAY_CTA)
          }}
          disabled={isPayDisabled}
          loading={fundingCycleLoading || primaryETHTerminalLoading}
        >
          <span>{payButtonText}</span>
        </Button>
      </Tooltip>
      {payInCurrency === V2V3_CURRENCY_USD && (
        <div className="mt-2 text-xs">
          <Trans>
            Paid as <ETHAmount amount={weiPayAmt} />
          </Trans>
        </div>
      )}

      <V2V3ConfirmPayModal
        open={payModalVisible}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}
