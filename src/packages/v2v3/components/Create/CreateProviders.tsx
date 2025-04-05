import { CV_V3 } from 'constants/cv'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ContractsProvider } from 'packages/v2v3/contexts/Contracts/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'packages/v2v3/contexts/V2V3CurrencyProvider'

export default function CreateProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <V2V3ContractsProvider initialCv={CV_V3}>
      <TransactionProvider>
        <V2V3CurrencyProvider>{children}</V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )
}
