import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useCallback, useState } from 'react'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'

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

      return (
        <DistributionSplitCard
          split={split}
          splits={allSplits}
          editableSplits={editableSplits}
          editableSplitIndex={index}
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          onSplitsChanged={onSplitsChanged}
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
    ],
  )

  if (!allSplits) return null

  return (
    <Form.Item
      {...formItemProps}
      style={{ ...formItemProps?.style, display: 'block' }}
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
