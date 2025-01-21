import { useJBChainId, useSuckers } from 'juice-sdk-react'
import { useState } from 'react'

import { Trans } from '@lingui/macro'
import { estimateGas } from '@wagmi/core'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { NETWORKS } from 'constants/networks'
import { useFormikContext } from 'formik'
import { useConfig } from 'wagmi'
import { PayProjectModalFormValues } from '../hooks/usePayProjectModal/usePayProjectModal'
import { useProjectPaymentTokens } from '../hooks/useProjectPaymentTokens'

type GasEstimates = Record<number, string>

export const ChainSelectSection = () => {
  const [gasEstimates, setGasEstimates] = useState<GasEstimates>({})

  const { receivedTokenSymbolText } = useProjectPaymentTokens()

  const suckersQuery = useSuckers()
  const suckers = suckersQuery.data

  const defaultChainId = useJBChainId()
  const config = useConfig()
  const { values, setFieldValue } =
    useFormikContext<PayProjectModalFormValues>()

  const allowedChainIds = new Set(suckers?.map(sucker => sucker.peerChainId))
  const networkOptions = Object.entries(NETWORKS)
    .filter(([chainId]) => allowedChainIds.has(parseInt(chainId)))
    .map(([chainId, networkInfo]) => ({
      label: networkInfo.label,
      value: parseInt(chainId),
    }))

  const fetchGasEstimates = async () => {
    const estimates = await Promise.allSettled(
      Array.from(allowedChainIds).map(async chainId => {
        await estimateGas(config, {
          chainId: chainId,
          // TODO pass in tx data and contract address
          // to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
          // value: parseEther('0.01'),
        })
      }),
    )
    // setGasEstimates(estimates)
  }

  // useEffect(() => {
  //   fetchGasEstimates()
  // }, [])

  if (!suckers || suckers.length <= 1) return null

  return (
    <div className="flex flex-col gap-3 py-6">
      <span className="font-medium">
        <Trans>Chain selection</Trans>
      </span>

      <span className="text-grey-500 dark:text-slate-200">
        <strong>{receivedTokenSymbolText}</strong> is available on multiple
        chains.
      </span>

      <JuiceListbox
        value={{
          label: defaultChainId
            ? NETWORKS[values.chainId ?? defaultChainId]?.label
            : '',
          value: values.chainId,
        }}
        onChange={({ value }) => {
          if (!value) return
          setFieldValue?.('chainId', value)
        }}
        options={networkOptions.map(option => ({
          ...option,
          label: `${option.label}`,
          //  - Gas: ${
          //   gasEstimates[option.value] || 'Loading...'
          // }`,
        }))}
      />
    </div>
  )
}
