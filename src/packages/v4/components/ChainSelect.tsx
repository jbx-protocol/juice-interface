import {
  JuiceListbox,
  JuiceListboxOption,
} from 'components/inputs/JuiceListbox'
import { NETWORKS } from 'constants/networks'
import { SuckerPair } from 'juice-sdk-core'

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
      label: networkInfo.label,
      value: parseInt(chainId),
    }))

  // const fetchGasEstimates = async () => {
  //   const estimates = await Promise.allSettled(
  //     Array.from(allowedChainIds).map(async chainId => {
  //       await estimateGas(config, {
  //         chainId: chainId,
  //         // TODO pass in tx data and contract address
  //         // to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
  //         // value: parseEther('0.01'),
  //       })
  //     }),
  //   )
  //   // setGasEstimates(estimates)
  // }

  return (
    <JuiceListbox
      value={value}
      onChange={onChange}
      options={networkOptions.map(option => ({
        ...option,
        label: `${option.label}`,
        //  - Gas: ${
        //   gasEstimates[option.value] || 'Loading...'
        // }`,
      }))}
    />
  )
}
