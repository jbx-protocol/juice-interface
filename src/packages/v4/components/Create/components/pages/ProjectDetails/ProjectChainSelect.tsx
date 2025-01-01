import { DEFAULT_PROJECT_CHAIN_ID, NETWORKS, SupportedChainId } from "constants/networks"

import { JuiceListbox } from "components/inputs/JuiceListbox"

export const ProjectChainSelect: React.FC<
  React.PropsWithChildren<{
    value?: SupportedChainId
    onChange?: (value: SupportedChainId) => void
  }>
> = ({ value, onChange }) => {
  
  const networkOptions = () => Object.entries(NETWORKS).map(
    ([chainId, networkInfo]) => ({
      label: networkInfo.label, 
      value: parseInt(chainId),
    })
  )

  return (
    <JuiceListbox
      value={{label: NETWORKS[value ?? DEFAULT_PROJECT_CHAIN_ID].label, value }}
      onChange={({ value }) => {
        if (!value) return
        onChange?.(value)
      }}
      options={networkOptions()}
    />
  )
}