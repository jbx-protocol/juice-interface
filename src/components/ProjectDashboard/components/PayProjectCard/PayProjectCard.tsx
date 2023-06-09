import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { usePayProjectCard } from 'components/ProjectDashboard/hooks'
import { Formik } from 'formik'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { twMerge } from 'tailwind-merge'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { DisplayCard } from '../ui'
import { PayInput } from './components/PayInput'
import { TokensPerEth } from './components/TokensPerEth'

export const PayProjectCard = ({ className }: { className?: string }) => {
  const { validationSchema, addPay } = usePayProjectCard()
  return (
    <DisplayCard className={twMerge('flex flex-col gap-2 pr-9', className)}>
      <div className="font-medium">
        <Trans>Pay Project</Trans>
      </div>
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
            <div className="flex gap-2">
              <PayInput
                className="flex-1"
                placeholder="0"
                value={{
                  amount: props.values.payAmount.amount?.toString() ?? '',
                  currency: props.values.payAmount.currency,
                }}
                onChange={v => props.setFieldValue('payAmount', v)}
                onBlur={props.handleBlur}
                name="payAmount"
              />
              <Button htmlType="submit" className="h-full" type="primary">
                <Trans>Add payment</Trans>
              </Button>
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
    </DisplayCard>
  )
}
