import { Form, Select } from 'antd'

import { Trans, t } from '@lingui/macro'
import {
  useJBChainId,
  useJBContractContext,
  useJBRuleset,
} from 'juice-sdk-react'
import { BallotStrategy } from 'models/ballot'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { getAvailableApprovalStrategies } from 'packages/v4v5/utils/approvalHooks'
import { useCallback, useMemo } from 'react'
import { isEqualAddress } from 'utils/address'

export default function CycleDeadlineDropdown({
  className,
}: {
  className?: string
}) {
  const { version } = useV4V5Version()
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { data: rulesetData } = useJBRuleset({ projectId, chainId })
  const currentApprovalHook = rulesetData?.data?.approvalHook

  // Only fetch approval strategies if we have valid version and chainId
  const ballotStrategies = useMemo(
    () => (version && chainId ? getAvailableApprovalStrategies(version, chainId) : []),
    [version, chainId]
  )

  // Helper to find label for a given address
  const findLabelForValue = useCallback(
    (address: string) => {
      const strategy = ballotStrategies.find((s: BallotStrategy) =>
        isEqualAddress(s.address, address),
      )
      return strategy?.name || address // Fallback to address if no match
    },
    [ballotStrategies],
  )

  // Map form value (string address) to Select's expected object for label display
  const getValueProps = useCallback(
    (formValue: string | undefined) => {
      if (!formValue) return {}
      const label = findLabelForValue(formValue)
      return {
        value: { label, value: formValue },
      }
    },
    [findLabelForValue],
  )

  // Extract address string from Select's {label, value} on change
  const getValueFromEvent = useCallback((selected: { label: string; value: string } | string) => {
    return typeof selected === 'object' ? selected.value : selected
  }, [])

  return (
    <Form.Item
      name="approvalHook"
      required
      getValueProps={getValueProps}
      getValueFromEvent={getValueFromEvent}
    >
      <Select
        className={className}
        // Use label for display in closed state
        optionLabelProp="label"
        // Enable label-based value handling
        labelInValue
        disabled={!ballotStrategies.length} // Optional: disable if no options
      >
        {ballotStrategies.map((strategy: BallotStrategy) => {
          const isCurrent =
            currentApprovalHook &&
            isEqualAddress(strategy.address, currentApprovalHook)

          return (
            <Select.Option
              key={strategy.address}
              value={strategy.address}
              label={strategy.name} // Plain string for closed display
              disabled={isCurrent}
            >
              <div
                className={isCurrent ? 'border-blue-500 border-l-4 pl-2' : ''}
              >
                <div className="flex items-center justify-between">
                  <Trans>{strategy.name}</Trans>
                  {isCurrent && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ml-2 rounded px-2 py-0.5 text-xs font-medium">
                      {t`Current`}
                    </span>
                  )}
                </div>
                <div className="text-xs text-grey-500 dark:text-grey-400">
                  {strategy.address}
                </div>
              </div>
            </Select.Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}
