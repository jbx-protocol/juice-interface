import { RadioGroup } from '@headlessui/react'
import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { Callout } from 'components/Callout'
import TooltipLabel from 'components/TooltipLabel'
import { PayoutsSelection } from 'models/payoutsSelection'
import { TreasurySelection } from 'models/treasurySelection'
import { useMemo } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { allocationTotalPercentDoNotExceedTotalRule } from 'utils/antdRules'
import { Icons } from '../../Icons'
import { PayoutsList } from '../Payouts/components/PayoutsList'
import { RadioCard } from './components'
import { useTreasurySetupForm } from './hooks'

const treasuryOptions = [
  { name: t`Amount`, value: 'amount', icon: <Icons.Target /> },
  { name: t`Unlimited`, value: 'unlimited', icon: <Icons.Target /> },
  { name: t`Zero`, value: 'zero', icon: <Icons.Target /> },
]

export const TreasurySetupPage = () => {
  useSetCreateFurthestPageReached('treasurySetup')
  const { form, initialValues } = useTreasurySetupForm()
  const selection: TreasurySelection = Form.useWatch('selection', form)!

  const calloutText = useMemo(() => {
    switch (selection) {
      case 'amount':
        return t`The total sum of your payouts will become your distribution limit.
      This is the amount of funds your project will be able to distribute or
      'withdraw' from its treasury each funding cycle.`
      case 'unlimited':
        return t`Your project will keep all funds raised. There will be no limit on the amount of funds you can distribute from your treasury each funding cycle.`
      case 'zero':
        return t`All funds raised will be redeemable by your project’s token holders. You can turn off redemptions in the Token settings. You will not be able to add payouts while your distribution limit is set to Zero.`
    }
  }, [selection])

  const payoutsSelection: PayoutsSelection | undefined = useMemo(() => {
    switch (selection) {
      case 'amount':
        return 'amounts'
      case 'unlimited':
        return 'percentages'
      default:
        return undefined
    }
  }, [selection])

  const showPayouts = selection === 'amount' || selection === 'unlimited'

  return (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <Form.Item
        label={
          <TooltipLabel
            className="text-lg font-medium text-black dark:text-grey-200"
            label={<Trans>Distribution Limit</Trans>}
            tip={
              <Trans>
                This is the amount of funds your project will be able to
                distribute or 'withdraw' from its treasury each funding cycle.
              </Trans>
            }
          />
        }
        name="selection"
      >
        <RadioGroup className="flex flex-col gap-3 md:flex-row">
          {treasuryOptions.map(option => (
            <RadioGroup.Option
              className="flex-1 cursor-pointer"
              key={option.name}
              value={option.value}
            >
              {({ checked }) => (
                <RadioCard
                  icon={option.icon}
                  title={option.name}
                  checked={checked}
                />
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </Form.Item>
      {calloutText && (
        <Callout.Info className="mb-10">{calloutText}</Callout.Info>
      )}
      {showPayouts && (
        <Form.Item
          label={
            <TooltipLabel
              className="text-lg font-medium text-black dark:text-grey-200"
              label={<Trans>Payouts</Trans>}
              tip={
                <Trans>
                  These are the addresses or entities that will receive payouts
                  from your treasury each funding cycle.
                </Trans>
              }
            />
          }
        >
          <Trans>
            Add wallet addresses or juicebox projects to receive payouts.
          </Trans>
          {payoutsSelection && (
            <Form.Item
              name="payoutsList"
              rules={[allocationTotalPercentDoNotExceedTotalRule()]}
            >
              <PayoutsList payoutsSelection={payoutsSelection} />
            </Form.Item>
          )}
        </Form.Item>
      )}
    </Form>
  )
}
