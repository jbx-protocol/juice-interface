import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { NETWORKS } from 'constants/networks'
import { JBChainId, SuckerPair } from 'juice-sdk-core'
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
}: {
  value: JBChainId | undefined
  onChange: (chainId: JBChainId) => void
  suckers: SuckerPair[]
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

  const _value = {
    value,
    label: value ? <ChainLogo chainId={value} /> : 'Select chain',
  }

  return (
    <JuiceListbox
      value={_value}
      onChange={({ value: selectedChainId }) => {
        onChange(selectedChainId as JBChainId)
      }}
      options={networkOptions}
      buttonClassName="w-18"
    />
  )
}
