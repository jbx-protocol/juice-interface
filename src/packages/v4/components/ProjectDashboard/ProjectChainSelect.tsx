import { DEFAULT_PROJECT_CHAIN_ID, NETWORKS } from 'constants/networks'
import { JBChainId, useSuckers } from 'juice-sdk-react'

import { JuiceListbox } from 'components/inputs/JuiceListbox'

type ChainSelectOption = {
  label: string,
  value: JBChainId,
}

export const ProjectChainSelect: React.FC<
  React.PropsWithChildren<{
    value?: JBChainId
    onChange?: (value: JBChainId) => void
    options?: ChainSelectOption[]
  }>
> = ({ value, onChange, options }) => {
  const { data: suckers } = useSuckers()
  const projectAvailableChains = suckers?.map((suckerPair) => ({
    label: NETWORKS[suckerPair.peerChainId].label,
    value: suckerPair.peerChainId
  }))

  const _options = projectAvailableChains ?? options
  
  if (!_options) return null

  return (
    <JuiceListbox
      value={{
        label: NETWORKS[value ?? DEFAULT_PROJECT_CHAIN_ID]?.label,
        value,
      }}
      onChange={({ value }) => {
        if (!value) return
        onChange?.(value as JBChainId)
      }}
      options={_options}
    />
  )
}
