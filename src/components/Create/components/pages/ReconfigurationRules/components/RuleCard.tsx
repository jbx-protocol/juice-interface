import { CreateBadge } from 'components/Create/components/CreateBadge'
import { Selection } from 'components/Create/components/Selection'
import FormattedAddress from 'components/FormattedAddress'
import { AvailableReconfigurationStrategy } from '../hooks'

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
        <>
          {strategy.name}
          {strategy.isDefault && (
            <>
              {' '}
              <CreateBadge.Default />
            </>
          )}
        </>
      }
      description={
        <>
          {strategy.description}
          <div className="text-grey-400 dark:text-slate-200">
            Contract address:{' '}
            <FormattedAddress
              truncateTo={16}
              address={strategy.address}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </>
      }
    />
  )
}
