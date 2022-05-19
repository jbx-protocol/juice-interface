import { t, Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useCallback, useState } from 'react'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'
import { parseWad } from 'utils/formatNumber'
import DistributionLimit from 'components/v2/V2Project/DistributionLimit'
import TooltipIcon from 'components/shared/TooltipIcon'

import DistributionSplitCard from './DistributionSplitCard'
import { CurrencyName } from 'constants/currency'
import DistributionSplitModal from './DistributionSplitModal'

export default function DistributionSplitsSection({
  distributionLimit,
  setDistributionLimit,
  currencyName,
  onCurrencyChange,
  editableSplits,
  lockedSplits,
  onSplitsChanged,
  formItemProps,
}: {
  distributionLimit: string | undefined
  setDistributionLimit: (distributionLimit: string) => void
  currencyName: CurrencyName
  onCurrencyChange: (currencyName: CurrencyName) => void
  editableSplits: Split[]
  lockedSplits: Split[]
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)

  const allSplits = lockedSplits.concat(editableSplits)

  const renderSplitCard = useCallback(
    (split: Split, index: number, isLocked?: boolean) => {
      if (!split) return
      const isFirstSplit =
        editableSplits.length === 0 ||
        (editableSplits.length === 1 && index === 0)
      return (
        <DistributionSplitCard
          split={split}
          splits={allSplits}
          editableSplits={editableSplits}
          editableSplitIndex={index}
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          onSplitsChanged={onSplitsChanged}
          onCurrencyChange={isFirstSplit ? onCurrencyChange : undefined}
          currencyName={currencyName}
          isLocked={isLocked}
        />
      )
    },
    [
      distributionLimit,
      onSplitsChanged,
      allSplits,
      currencyName,
      editableSplits,
      setDistributionLimit,
      onCurrencyChange,
    ],
  )

  if (!allSplits) return null

  return (
    <Form.Item
      {...formItemProps}
      style={{
        ...formItemProps?.style,
        display: 'block',
        marginBottom: 0,
        marginTop: 34,
      }}
    >
      <Space
        direction="vertical"
        style={{ width: '100%', minHeight: 0 }}
        size="large"
      >
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          {editableSplits.map((split, index) => renderSplitCard(split, index))}
        </Space>
        {lockedSplits ? (
          <Space style={{ width: '100%' }} direction="vertical" size="small">
            {lockedSplits.map((split, index) =>
              renderSplitCard(split, index, true),
            )}
          </Space>
        ) : null}
        <Button
          type="dashed"
          onClick={() => {
            setAddSplitModalVisible(true)
          }}
          block
        >
          <Trans>Add a distribution destination</Trans>
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            <TooltipIcon
              tip={t`The maximum amount of funds that can be distributed from the treasury each funding cycle.`}
              iconStyle={{ marginRight: 5 }}
            />
            <strong>
              <Trans>Total distribution limit:</Trans>
            </strong>
          </span>
          <strong>
            <DistributionLimit
              distributionLimit={parseWad(distributionLimit)}
              currencyName={currencyName}
            />
          </strong>
        </div>
      </Space>
      <DistributionSplitModal
        visible={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={allSplits}
        editableSplits={editableSplits}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        currencyName={currencyName}
        onCurrencyChange={onCurrencyChange}
        onClose={() => setAddSplitModalVisible(false)}
      />
    </Form.Item>
  )
}
