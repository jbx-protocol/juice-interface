import { JBChainId, SuckerPair } from 'juice-sdk-core'

import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { NETWORKS } from 'constants/networks'
import { ChainLogo } from './ChainLogo'

function ChainSelectOption({
  chainId,
  label,
}: {
  chainId: number
  label: string
}) {
  return (
    <span className="mr-4 flex items-center gap-2 whitespace-nowrap">
      <ChainLogo chainId={chainId as JBChainId} />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  )
}

export const ChainSelect = ({
  value,
  onChange,
  suckers,
  showSelectedName
}: {
  value: JBChainId | undefined
  onChange: (chainId: JBChainId) => void
  suckers: SuckerPair[]
  showSelectedName?: boolean // Otherwise just shows logo of selected chain
}) => {
  const allowedChainIds = new Set(suckers?.map(sucker => sucker.peerChainId))
  const networkOptions = Object.entries(NETWORKS)
    .filter(([chainId]) => allowedChainIds.has(parseInt(chainId)))
    .map(([chainId, networkInfo]) => ({
      label: (
        <ChainSelectOption
          chainId={parseInt(chainId)}
          label={networkInfo.label}
        />
      ),
      value: parseInt(chainId) as JBChainId,
    }))


  let _valueLabel = <></>
  
  if (value) {
    _valueLabel = showSelectedName ? (
      <div className="flex justify-center items-center gap-2">
        <ChainLogo chainId={value} />
        {NETWORKS[value]?.label}
      </div>
    ) : <ChainLogo chainId={value} />
  }

  const _value = {
    value,
    label: value ? _valueLabel : 'Select chain',
  }

  return (
    <JuiceListbox
      value={_value}
      onChange={({ value: selectedChainId }) => {
        if (selectedChainId) {
          onChange(selectedChainId)
        }
      }}
      options={networkOptions}
      buttonClassName="w-18"
    />
  )
}
