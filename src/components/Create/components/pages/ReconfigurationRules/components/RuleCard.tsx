import { CreateBadge } from 'components/Create/components/CreateBadge'
import { Selection } from 'components/Create/components/Selection'
import { AvailableReconfigurationStrategy } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import FormattedAddress from 'components/FormattedAddress'
import useMobile from 'hooks/Mobile'

export const RuleCard = ({
  strategy,
}: {
  strategy: AvailableReconfigurationStrategy
}) => {
  const isMobile = useMobile()
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
            <FormattedAddress
              truncateTo={isMobile ? 8 : 16}
              address={strategy.address}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </>
      }
    />
  )
}
