import { Trans } from '@lingui/macro'
import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/formItems'
import FormItemWarningText from 'components/FormItemWarningText'
import { RESERVED_RATE_WARNING_THRESHOLD_PERCENT as reservedRateRiskyMin } from 'constants/fundingWarningText'
import { TicketMod } from 'models/v1/mods'
import { useLayoutEffect, useState } from 'react'

export type TicketingFormFields = {
  reserved: number
}

export default function TicketingForm({
  form,
  initialMods,
  onSave,
}: {
  form: FormInstance<TicketingFormFields>
  initialMods: TicketMod[]
  onSave: (mods: TicketMod[]) => void
}) {
  const [mods, setMods] = useState<TicketMod[]>([])
  const [showReservedRateWarning, setShowReservedRateWarning] =
    useState<boolean>()

  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number>(
    form.getFieldValue('reserved'),
  )

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [initialMods])

  return (
    <Space direction="vertical" size="large">
      <div className="text-grey-500 dark:text-grey-300">
        <h1>
          <Trans>Reserved tokens</Trans>
        </h1>

        <p>
          <Trans>
            Project tokens are sent to anyone who pays your project, and they
            can be redeemed to reclaim ETH that isn't needed for payouts.
          </Trans>
        </p>
        <p>
          <Trans>
            Optionally, you can create an ERC-20 token once your project has
            been deployed. Until then, the Juicebox protocol will track token
            balances internally, allowing your supporters to receive tokens and
            redeem them for ETH.
          </Trans>
        </p>
      </div>

      <Form form={form} layout="vertical">
        <FormItems.ProjectReserved
          value={reservedRate}
          name="reserved"
          onChange={(val?: number) => {
            setReservedRate(val ?? 0)
            form.setFieldsValue({ reserved: val })
            setShowReservedRateWarning(
              Boolean(val && val >= reservedRateRiskyMin),
            )
          }}
          checked
        />
        {showReservedRateWarning && (
          <Form.Item>
            <FormItemWarningText>
              <Trans>
                Projects using a reserved rate of {reservedRateRiskyMin}% or
                more will appear risky to contributors, as a relatively small
                number of tokens will be received in exchange for paying your
                project.
              </Trans>
            </FormItemWarningText>
          </Form.Item>
        )}
        <FormItems.ProjectTicketMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          formItemProps={{
            label: <Trans>Reserved token recipients (optional)</Trans>,
            extra: (
              <Trans>
                Send a portion of your project's reserved tokens to other
                Ethereum wallets or Juicebox projects.
              </Trans>
            ),
          }}
          reservedRate={reservedRate}
        />
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={() => onSave(mods)}>
            <Trans>Save</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
