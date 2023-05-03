import EthereumAddress from 'components/EthereumAddress'
import { Split } from 'models/splits'
import { DiffedItem } from '../../DiffedItem'
import { JuiceboxProjectBeneficiary } from '../../SplitItem/JuiceboxProjectBeneficiary'

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
    <JuiceboxProjectBeneficiary
      split={split}
      projectOwnerAddress={projectOwnerAddress}
      value={
        hasDiff ? (
          <div className="flex">
            <DiffedItem
              value={<EthereumAddress address={oldSplit.beneficiary} />}
              diffStatus="old"
            />
            <DiffedItem
              value={<EthereumAddress address={split.beneficiary} />}
              diffStatus="new"
            />
          </div>
        ) : undefined
      }
    />
  )
}
