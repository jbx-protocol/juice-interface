import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { ExternalLinkWithIcon } from 'components/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { FormItems } from 'components/formItems'
import { ItemNoInput } from 'components/formItems/ItemNoInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { Split } from 'models/splits'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { V2V3EditReservedTokens } from '../../ReservedTokensSettingsPage/V2V3EditReservedTokens'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { useEditCycleFormContext } from '../EditCycleFormContext'

export function ReservedTokensField() {
  const { editCycleForm } = useEditCycleFormContext()

  const reservedTokens = useWatch('reservedTokens', editCycleForm) ?? 0
  const reservedSplits = useWatch('reservedSplits', editCycleForm) ?? []
  const totalIssuanceRate = useWatch('mintRate', editCycleForm) ?? 0

  const [reservedTokensSwitchEnabled, setReservedTokensSwitchEnabled] =
    useState<boolean>(editCycleForm?.getFieldValue('reservedTokens') > 0)
  return (
    <div>
      <JuiceSwitch
        label={<Trans>Enable reserved tokens</Trans>}
        description={
          <Trans>
            Reserve a percentage of freshly minted tokens for specified
            recipients.{' '}
            <ExternalLinkWithIcon
              href={helpPagePath('/user/project/#reserved-rate')}
            >
              <Trans>Learn more</Trans>
            </ExternalLinkWithIcon>
          </Trans>
        }
        value={reservedTokensSwitchEnabled}
        onChange={val => {
          setReservedTokensSwitchEnabled(val)
          if (!val) {
            editCycleForm?.setFieldsValue({ reservedTokens: 0 })
          }
        }}
      />
      {reservedTokensSwitchEnabled ? (
        <div className="pt-6 pb-5">
          {/* Slider */}
          <FormItems.ProjectReserved
            hideLabel
            name="reservedTokens"
            issuanceRate={totalIssuanceRate}
            value={reservedTokens}
            hideExplainer
          />
          {/* Reserved token recipient listing */}
          <AdvancedDropdown
            title={<Trans>Reserved token recipients</Trans>}
            hideDivider
          >
            <V2V3EditReservedTokens
              editingReservedTokensSplits={reservedSplits}
              setEditingReservedTokensSplits={(splits: Split[]) => {
                editCycleForm?.setFieldsValue({
                  reservedSplits: splits,
                })
              }}
              hideTitle
            />
          </AdvancedDropdown>
        </div>
      ) : null}
      {/* Empty inputs to keep AntD useWatch happy */}
      <ItemNoInput name="reservedSplits" className="hidden" />
      <ItemNoInput name="reservedTokens" className="hidden" />
    </div>
  )
}
