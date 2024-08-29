import { DiffedItem } from 'components/DiffedItem'
import EthereumAddress from 'components/EthereumAddress'
import { Split } from 'packages/v2v3/models/splits'
import { JuiceboxProjectBeneficiary } from '../../SplitItem/JuiceboxProjectBeneficiary'

export function DiffedJBProjectBeneficiary({
  split,
  oldSplit,
}: {
  split: Split
  oldSplit?: Split
}) {
  const hasDiff = oldSplit && oldSplit.beneficiary !== split.beneficiary

  return (
    <JuiceboxProjectBeneficiary
      split={split}
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
