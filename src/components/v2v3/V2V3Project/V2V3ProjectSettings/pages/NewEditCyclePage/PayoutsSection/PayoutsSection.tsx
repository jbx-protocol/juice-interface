import { AdvancedDropdown } from '../AdvancedDropdown'
import { PayoutsTable } from './PayoutsTable/PayoutsTable'

export function PayoutsSection() {
  return (
    <div className="flex flex-col gap-3">
      <PayoutsTable />
      <AdvancedDropdown>
        {/* "Enable unlimited payouts" switch */}
        {/* "Hold fees in project" switch */}
      </AdvancedDropdown>
    </div>
  )
}
