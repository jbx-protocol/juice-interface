import { t } from '@lingui/macro'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import React from 'react'
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
  className,
  value,
  onChange,
  chainIds,
  showTitle = false,
}: {
  className?: string
  value: JBChainId | undefined
  onChange: (chainId: JBChainId) => void
  chainIds: JBChainId[]
  showTitle?: boolean
}) => {
  const networkOptions = Object.entries(NETWORKS)
    .filter(([chainId]) => chainIds.includes(parseInt(chainId) as JBChainId))
    .map(([chainId, networkInfo]) => ({
      label: (
        <ChainSelectOption
          chainId={parseInt(chainId)}
          label={networkInfo.label}
        />
      ),
      value: parseInt(chainId) as JBChainId,
    }))

  const _value = React.useMemo(() => {
    const defaultValue = {
      value: undefined,
      label: t`Select chain`,
    }
    if (!value) {
      return defaultValue
    }
    const option = networkOptions.find(
      ({ value: chainId }) => chainId === value,
    )
    if (!option) {
      return defaultValue
    }
    if (!showTitle) {
      return {
        value,
        label: <ChainLogo chainId={value} />,
      }
    }
    return option
  }, [networkOptions, showTitle, value])

  return (
    <JuiceListbox
      className={className}
      value={_value}
      onChange={({ value: selectedChainId }) => {
        onChange(selectedChainId as JBChainId)
      }}
      options={networkOptions}
    />
  )
}
