import { useJBChainId, useSuckers } from 'juice-sdk-react'

import { Trans } from '@lingui/macro'
import { NETWORKS } from 'constants/networks'
import { useFormikContext } from 'formik'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { PayProjectModalFormValues } from '../hooks/usePayProjectModal/usePayProjectModal'
import { useProjectPaymentTokens } from '../hooks/useProjectPaymentTokens'

export const ChainSelectSection = () => {
  const { receivedTokenSymbolText } = useProjectPaymentTokens()

  const { data: suckers } = useSuckers()

  const defaultChainId = useJBChainId()
  const { values, setFieldValue } =
    useFormikContext<PayProjectModalFormValues>()

  if (!suckers || suckers.length <= 1 || !defaultChainId) return null

  return (
    <div className="flex flex-col gap-3 py-6">
      <span className="font-medium">
        <Trans>Chain selection</Trans>
      </span>

      <span className="text-grey-500 dark:text-slate-200">
        <strong>{receivedTokenSymbolText}</strong> is available on multiple
        chains.
      </span>

      <ChainSelect
        value={{
          label: defaultChainId
            ? NETWORKS[values.chainId ?? defaultChainId]?.label
            : '',
          value: values.chainId ?? defaultChainId,
        }}
        onChange={({ value }) => {
          if (!value) return
          setFieldValue?.('chainId', value)
        }}
        suckers={suckers}
      />
    </div>
  )
}
