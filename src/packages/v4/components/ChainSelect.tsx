import {
  JuiceListbox,
  JuiceListboxOption,
} from 'components/inputs/JuiceListbox'
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
    <div className="flex items-center gap-2">
      <ChainLogo chainId={chainId as JBChainId} />
      {label}
    </div>
  )
}

export const ChainSelect = ({
  value,
  onChange,
  suckers,
}: {
  value: {
    label: string
    value: number
  }
  onChange: (chainId: JuiceListboxOption<number>) => void
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
    ...value,
    label: <ChainLogo chainId={value.value as JBChainId} />,
  }

  return (
    <JuiceListbox value={_value} onChange={onChange} options={networkOptions} />
  )
}
