import { CreateBadge } from 'components/Create/components/CreateBadge'
import { Selection } from 'components/Create/components/Selection'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { AvailableReconfigurationStrategy } from '../hooks'

export const RuleCard = ({
  strategy,
}: {
  strategy: AvailableReconfigurationStrategy
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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
          <div style={{ color: colors.text.tertiary }}>
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
