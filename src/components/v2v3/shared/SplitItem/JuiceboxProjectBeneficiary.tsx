import FormattedAddress from 'components/FormattedAddress'
import { Split } from 'models/splits'
import { JBProjectBeneficiaryContainer } from './containers/JBProjectBeneficiaryContainer'

export function JuiceboxProjectBeneficiary({
  projectOwnerAddress,
  split,
}: {
  split: Split
  projectOwnerAddress: string | undefined
}) {
  return (
    <JBProjectBeneficiaryContainer
      split={split}
      projectOwnerAddress={projectOwnerAddress}
    >
      <div className="ml-2">
        <FormattedAddress
          address={split.beneficiary}
          className={'text-sm font-light text-grey-500 dark:text-grey-300'}
        />
      </div>
    </JBProjectBeneficiaryContainer>
  )
}
