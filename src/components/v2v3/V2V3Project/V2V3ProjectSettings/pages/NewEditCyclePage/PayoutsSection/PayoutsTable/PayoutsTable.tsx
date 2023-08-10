import { PayoutsTableBody } from './PayoutsTableBody'
import {
  PayoutsTableContext,
  PayoutsTableContextProps,
} from './context/PayoutsTableContext'

export function PayoutsTable(props: PayoutsTableContextProps) {
  return (
    <PayoutsTableContext.Provider value={props}>
      <PayoutsTableBody />
    </PayoutsTableContext.Provider>
  )
}
