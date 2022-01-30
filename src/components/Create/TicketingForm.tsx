import { Button, Form, FormInstance, Space } from 'antd'
import { t, Trans } from '@lingui/macro'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { TicketMod } from 'models/mods'
import { useContext, useLayoutEffect, useState } from 'react'

import { reservedRateRiskyMin } from 'constants/fundingWarningText'

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

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [initialMods])

  return (
    <Space direction="vertical" size="large">
      <div style={{ color: colors.text.secondary }}>
        <h1>
          <Trans>Reserved tokens</Trans>
        </h1>

        <p>
          <Trans>
            Tokens are earned by anyone who pays your project, and can be
            redeemed for overflow if your project has set a funding target.
          </Trans>
        </p>
        <p>
          <Trans>
            You'll be able to issue ERC-20 tokens once your project contract has
            been deployed. Until then, the protocol will track token balances,
            allowing your supporters to earn tokens and redeem for overflow in
            the meantime.
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
            setShowReservedRateWarning(!!(val && val >= reservedRateRiskyMin))
          }}
        />
        {showReservedRateWarning && (
          <Form.Item>
            <p style={{ color: colors.text.warn }}>
              <Trans>
                Projects using a reserved rate of {reservedRateRiskyMin}% or
                more will appear risky to contributors, as a relatively small
                number of tokens will be received in exchange for paying your
                project.
              </Trans>
            </p>
          </Form.Item>
        )}
        <FormItems.ProjectTicketMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          formItemProps={{
            label: t`Reserved token allocation (optional)`,
            extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
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
