import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useState } from 'react'
import { permyriadToPercent } from 'utils/formatNumber'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'

import FormattedAddress from 'components/shared/FormattedAddress'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import DistributionSplitCard from './DistributionSplitCard'
import { CurrencyName } from 'constants/currency'
import DistributionSplitModal from './DistributionSplitModal'

export default function DistributionSplitsSection({
  distributionLimit,
  currencyName,
  splits,
  onSplitsChanged,
  formItemProps,
}: {
  distributionLimit: string | undefined
  currencyName: CurrencyName
  splits: Split[]
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectOwnerAddress } = useContext(V2ProjectContext)

  const renderSplitCard = useCallback(
    (split: Split, index: number) => {
      if (!split) return

      return (
        <DistributionSplitCard
          split={split}
          splits={splits}
          splitIndex={index}
          distributionLimit={distributionLimit}
          onSplitsChanged={onSplitsChanged}
          currencyName={currencyName}
        />
      )
    },
    [distributionLimit, onSplitsChanged, splits, currencyName],
  )

  if (!splits) return null

  const total = splits.reduce(
    (acc, curr) => acc + parseFloat(permyriadToPercent(curr.percent ?? '0')),
    0,
  )

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
          {splits.map((split, index) => renderSplitCard(split, index))}
        </Space>
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
          <Trans>Add a payout</Trans>
        </Button>
      </Space>
      <DistributionSplitModal
        visible={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={splits}
        distributionLimit={distributionLimit}
        currencyName={currencyName}
        onClose={() => setAddSplitModalVisible(false)}
      />
    </Form.Item>
  )
}
