import EthereumAddress from 'components/EthereumAddress'
import { CreateBadge } from 'packages/v2v3/components/Create/components/CreateBadge'
import { Selection } from 'packages/v2v3/components/Create/components/Selection/Selection'
import { AvailableReconfigurationStrategy } from 'packages/v2v3/components/Create/hooks/useAvailableReconfigurationStrategies'

export const RuleCard = ({
  strategy,
}: {
  strategy: AvailableReconfigurationStrategy
}) => {
  return (
    <Selection.Card
      key={strategy.id}
      checkPosition="left"
      name={strategy.id}
      title={
        <div className="flex items-center gap-3">
          {strategy.name}
          {strategy.isDefault && (
            <>
              {' '}
              <CreateBadge.Default />
            </>
          )}
        </div>
      }
      description={
        <>
          {strategy.description}
          <div className="overflow-hidden text-grey-400 dark:text-slate-200">
            Contract address:{' '}
            <EthereumAddress
              address={strategy.address}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </>
      }
    />
  )
}
