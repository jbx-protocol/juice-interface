import { DiffedItem } from 'components/DiffedItem'
import EthereumAddress from 'components/EthereumAddress'
import { JBSplit } from 'juice-sdk-core'
import { JuiceboxProjectBeneficiary } from 'packages/v4/components/SplitList/SplitItem/JuiceboxProjectBeneficiary'

export function DiffedJBProjectBeneficiary({
  split,
  oldSplit,
}: {
  split: JBSplit
  oldSplit?: JBSplit
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
