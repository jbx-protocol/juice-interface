import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { DEFAULT_PROJECT_CHAIN_ID, NETWORKS } from 'constants/networks'
import { JB_CHAINS } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'

export const ProjectChainSelect: React.FC<
  React.PropsWithChildren<{
    value?: JBChainId
    onChange?: (value: JBChainId) => void
  }>
> = ({ value, onChange }) => {
  const networkOptions = () =>
    Object.values(JB_CHAINS).map(chain => ({
      label: chain.name,
      value: chain.chain.id as JBChainId,
    }))

  return (
    <JuiceListbox
      value={{
        label: NETWORKS[value ?? DEFAULT_PROJECT_CHAIN_ID]?.label,
        value,
      }}
      onChange={({ value }) => {
        if (!value) return
        onChange?.(value)
      }}
      options={networkOptions()}
    />
  )
}
