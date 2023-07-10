import { Trans } from '@lingui/macro'
import TooltipLabel from 'components/TooltipLabel'
import { durationOptions } from 'components/inputs/DurationInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { CYCLE_EXPLANATION } from 'components/strings'
import DurationInputAndSelect from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer/FundingForm/DurationInputAndSelect'
import { useEffect, useState } from 'react'
import { useEditCycleForm } from '../EditCycleFormContext'

export function DurationFields() {
  const [durationEnabled, setDurationEnabled] = useState<boolean>()

  const { editCycleForm, initialFormData } = useEditCycleForm()

  // Set initial value of Switch
  useEffect(() => {
    if (initialFormData?.duration) {
      setDurationEnabled(true)
    } else {
      setDurationEnabled(false)
    }
  }, [initialFormData?.duration])

  const handleSwitchChange = () => {
    const newDurationEnabled = !durationEnabled
    if (newDurationEnabled) {
      editCycleForm?.setFieldsValue({ durationUnit: durationOptions()[0] })
    } else {
      editCycleForm?.setFieldsValue({ duration: 0 })
    }
    setDurationEnabled(newDurationEnabled)
  }

  return (
    <div className="flex flex-col gap-2">
      <DurationInputAndSelect hideTitle disabled={!durationEnabled} />
      <JuiceSwitch
        value={durationEnabled}
        onChange={handleSwitchChange}
        label={
          <TooltipLabel
            label={<Trans>Locked cycles</Trans>}
            tip={CYCLE_EXPLANATION}
          />
        }
        description={
          <Trans>
            Project configurations cannot be changed to the duration of locked
            cycles.
          </Trans>
        }
      />
    </div>
  )
}
