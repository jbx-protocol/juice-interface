import { t } from '@lingui/macro'
import {
  GenericSafeTransaction,
  SafeTransactionComponentProps,
} from 'components/ProjectSafeDashboard/SafeTransaction'

export function ReconfigureV1Transaction(props: SafeTransactionComponentProps) {
  return <GenericSafeTransaction {...props} title={t`V1 Edit Cycle`} />
}
