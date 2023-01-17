import FormattedAddress from 'components/FormattedAddress'
import { Split } from 'models/splits'
import { DiffedItem } from '../../DiffedItem'
import { JBProjectBeneficiaryContainer } from '../../SplitItem/containers/JBProjectBeneficiaryContainer'

export function DiffedJBProjectBeneficiary({
  split,
  oldSplit,
  projectOwnerAddress,
}: {
  split: Split
  oldSplit?: Split
  projectOwnerAddress: string | undefined
}) {
  const hasDiff = oldSplit && oldSplit.beneficiary !== split.beneficiary

  return (
    <JBProjectBeneficiaryContainer
      split={split}
      projectOwnerAddress={projectOwnerAddress}
    >
      {hasDiff ? (
        <div className="flex">
          <DiffedItem
            value={<FormattedAddress address={oldSplit.beneficiary} />}
            diffStatus="old"
          />
          <DiffedItem
            value={<FormattedAddress address={split.beneficiary} />}
            diffStatus="new"
          />
        </div>
      ) : (
        <div className="ml-2">
          <FormattedAddress
            address={split.beneficiary}
            className={'text-sm font-light text-grey-500 dark:text-grey-300'}
          />
        </div>
      )}
    </JBProjectBeneficiaryContainer>
  )
}
