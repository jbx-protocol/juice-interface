import {
  NoSymbolIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { usePayProjectCard } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectCard'
import { Formik } from 'formik'
import {
  PayDisabledReason,
  usePayProjectDisabled,
} from 'hooks/v2v3/usePayProjectDisabled'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { twMerge } from 'tailwind-merge'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { DisplayCard } from '../ui/DisplayCard'
import { PayInput } from './components/PayInput'
import { TokensPerEth } from './components/TokensPerEth'

export const PayProjectCard = ({ className }: { className?: string }) => {
  const { validationSchema, addPay } = usePayProjectCard()
  const { payDisabled, reason, message, loading } = usePayProjectDisabled()
  const payButtonTooltip =
    payDisabled && message
      ? {
          title: message,
          open: undefined,
        }
      : {
          open: false,
        }

  return (
    <DisplayCard
      className={twMerge('flex flex-col gap-2 px-4 md:pl-6 md:pr-9', className)}
    >
      <div className="text-base font-medium">
        <Tooltip
          className="inline-flex items-center gap-1"
          title={<Trans>Send ETH payments to this project.</Trans>}
        >
          <span>
            <Trans>Pay Project</Trans>
          </span>
          <QuestionMarkCircleIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
        </Tooltip>
      </div>
      {reason && [PayDisabledReason.PAUSED].includes(reason) ? (
        <div className="text-grey-600 dark:text-slate-200">
          <div className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-smoke-100 px-4 py-3 text-base leading-none dark:bg-slate-800">
            <NoSymbolIcon className="h-5 w-5" />
            <Trans>This project has disabled payments</Trans>
          </div>
          <div className="mt-3 text-sm">
            <Trans>Tokens cannot be issued while payments are disabled.</Trans>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{
            payAmount: {
              amount: undefined as unknown as number,
              currency: V2V3_CURRENCY_ETH as V2V3CurrencyOption,
            },
          }}
          validationSchema={validationSchema}
          onSubmit={addPay}
        >
          {props => (
            <form className="flex flex-col gap-2" onSubmit={props.handleSubmit}>
              <div className="flex flex-col gap-2 md:flex-row">
                <PayInput
                  className="h-12 md:flex-1"
                  placeholder="0"
                  value={{
                    amount: props.values.payAmount.amount?.toString() ?? '',
                    currency: props.values.payAmount.currency,
                  }}
                  onChange={v => props.setFieldValue('payAmount', v)}
                  onBlur={props.handleBlur}
                  name="payAmount"
                />
                <Tooltip className="h-12" {...payButtonTooltip}>
                  <Button
                    loading={loading}
                    disabled={payDisabled}
                    htmlType="submit"
                    className="h-12 text-base"
                    style={{ height: '48px' }}
                    type="primary"
                  >
                    <Trans>Add payment</Trans>
                  </Button>
                </Tooltip>
              </div>
              <div
                data-testid="pay-project-card-tokens-per-pay"
                className="text-xs text-smoke-500 dark:text-slate-200"
              >
                <TokensPerEth currencyAmount={props.values.payAmount} />
              </div>
              {props.errors.payAmount?.amount && props.touched.payAmount && (
                <div className="text-error-500">
                  {props.errors.payAmount.amount}
                </div>
              )}
            </form>
          )}
        </Formik>
      )}
    </DisplayCard>
  )
}
