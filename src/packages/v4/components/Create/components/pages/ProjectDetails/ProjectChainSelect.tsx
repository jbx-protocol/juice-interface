import { DEFAULT_PROJECT_CHAIN_ID, NETWORKS } from "constants/networks"

import { JuiceListbox } from "components/inputs/JuiceListbox"
import { JBChainId } from "juice-sdk-react"

export const ProjectChainSelect: React.FC<
  React.PropsWithChildren<{
    value?: JBChainId
    onChange?: (value: JBChainId) => void
  }>
> = ({ value, onChange }) => {
  
  const networkOptions = () => Object.entries(NETWORKS).map(
    ([chainId, networkInfo]) => ({
      label: networkInfo.label, 
      value: parseInt(chainId) as JBChainId,
    })
  )

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
