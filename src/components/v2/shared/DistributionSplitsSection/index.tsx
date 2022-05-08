import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useState } from 'react'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'
import { getTotalSplitsPercentage } from 'utils/v2/distributions'

import FormattedAddress from 'components/shared/FormattedAddress'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import DistributionSplitCard from './DistributionSplitCard'
import { CurrencyName } from 'constants/currency'
import DistributionSplitModal from './DistributionSplitModal'

export default function DistributionSplitsSection({
  distributionLimit,
  currencyName,
  editableSplits,
  lockedSplits,
  onSplitsChanged,
  formItemProps,
}: {
  distributionLimit: string | undefined
  currencyName: CurrencyName
  editableSplits: Split[]
  lockedSplits: Split[]
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectOwnerAddress } = useContext(V2ProjectContext)

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
    ],
  )

  if (!allSplits) return null

  const total = getTotalSplitsPercentage(allSplits)

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: colors.text.secondary,
          }}
        >
          <div
            style={{
              color: total > 100 ? colors.text.warn : colors.text.secondary,
            }}
          >
            <Trans>Total: {total.toFixed(2)}%</Trans>
          </div>
          <div>
            {projectOwnerAddress ? (
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                <FormattedAddress address={projectOwnerAddress} />
              </Trans>
            ) : null}
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setAddSplitModalVisible(true)
          }}
          block
        >
          <Trans>Add a split</Trans>
        </Button>
      </Space>
      <DistributionSplitModal
        visible={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={allSplits}
        editableSplits={editableSplits}
        distributionLimit={distributionLimit}
        currencyName={currencyName}
        onClose={() => setAddSplitModalVisible(false)}
      />
    </Form.Item>
  )
}
