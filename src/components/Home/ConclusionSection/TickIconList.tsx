import { t } from '@lingui/macro'
import { TickIconListItem } from '../../TickIconListItem'

export function TickIconList() {
  return (
    <ul className="pl-4">
      <TickIconListItem text={t`Free to launch, just pay gas.`} />
      <TickIconListItem text={t`Launch now, update later.`} />
      <TickIconListItem text={t`Personalized onboarding.`} />
    </ul>
  )
}
