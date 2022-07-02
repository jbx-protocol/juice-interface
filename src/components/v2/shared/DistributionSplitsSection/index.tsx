import { t, Trans } from '@lingui/macro'
import { Button, Form, Radio, Space, Switch } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'
import { fromWad, parseWad } from 'utils/formatNumber'
import DistributionLimit from 'components/v2/V2Project/DistributionLimit'
import TooltipIcon from 'components/shared/TooltipIcon'
import {
  adjustedSplitPercents,
  getNewDistributionLimit,
  getTotalSplitsPercentage,
} from 'utils/v2/distributions'
import { ThemeContext } from 'contexts/themeContext'
import { MAX_DISTRIBUTION_LIMIT, splitPercentFrom } from 'utils/v2/math'
import { NetworkContext } from 'contexts/networkContext'
import { Link } from 'react-router-dom'

import { filter } from 'lodash'

import DistributionSplitCard from './DistributionSplitCard'
import { CurrencyName } from 'constants/currency'
import DistributionSplitModal from './DistributionSplitModal'
import SpecificLimitModal from './SpecificLimitModal'
import { PayoutConfigurationExplainerCollapse } from './PayoutConfigurationExplainerCollapse'

import { DistributionLimitInput } from './DistributionLimitInput'

type DistributionType = 'limit' | 'infinite' | 'none'

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
  setDistributionLimit: (distributionLimit: string | undefined) => void
  currencyName: CurrencyName
  onCurrencyChange: (currencyName: CurrencyName) => void
  editableSplits: Split[]
  lockedSplits: Split[]
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)

  const distributionLimitIsInfinite =
    !distributionLimit || parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)

  const [addSplitModalVisible, setAddSplitModalVisible] =
    useState<boolean>(false)

  const [distributionType, setDistributionType] = useState<DistributionType>(
    distributionLimitIsInfinite ? 'infinite' : 'limit',
  )

  const [sumPayoutsEnabled, setSumPayoutsEnabled] = useState<boolean>(false)

  const [specificLimitModalOpen, setSpecificLimitModalOpen] =
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
          distributionLimit={distributionLimit}
          setDistributionLimit={setDistributionLimit}
          onSplitsChanged={onSplitsChanged}
          onCurrencyChange={isFirstSplit ? onCurrencyChange : undefined}
          currencyName={currencyName}
          isLocked={isLocked}
          onSplitDelete={split => {
            let adjustedSplits = allSplits
            if (!distributionLimitIsInfinite && allSplits.length !== 1) {
              const newDistributionLimit = getNewDistributionLimit({
                currentDistributionLimit: distributionLimit,
                newSplitAmount: 0,
                editingSplitPercent: split.percent,
              }).toString()
              adjustedSplits = adjustedSplitPercents({
                splits: editableSplits,
                oldDistributionLimit: distributionLimit,
                newDistributionLimit,
              })
              setDistributionLimit(newDistributionLimit)
            }
            if (allSplits.length === 1) setDistributionLimit('0')
            const splitsAfterDelete = filter(
              adjustedSplits,
              s => s.beneficiary !== split.beneficiary,
            )

            onSplitsChanged(splitsAfterDelete)
          }}
        />
      )
    },
    [
      editableSplits,
      allSplits,
      distributionLimit,
      setDistributionLimit,
      onSplitsChanged,
      onCurrencyChange,
      currencyName,
      distributionLimitIsInfinite,
    ],
  )

  useEffect(() => {
    setDistributionType(distributionLimitIsInfinite ? 'infinite' : 'limit')
  }, [distributionLimitIsInfinite])

  if (!allSplits) return null

  const totalSplitsPercentage = getTotalSplitsPercentage(allSplits)
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100
  const remainingSplitsPercentage = 100 - getTotalSplitsPercentage(allSplits) // this amount goes to the project owner
  let ownerSplit: Split

  if (remainingSplitsPercentage) {
    ownerSplit = {
      beneficiary: userAddress,
      percent: splitPercentFrom(remainingSplitsPercentage).toNumber(),
    } as Split
  }

  function OwnerSplitCard() {
    return (
      <DistributionSplitCard
        split={ownerSplit}
        splits={allSplits}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        onSplitsChanged={onSplitsChanged}
        onCurrencyChange={onCurrencyChange}
        currencyName={currencyName}
        isLocked={distributionLimitIsInfinite}
        isProjectOwner
      />
    )
  }

  return (
    <Form.Item
      {...formItemProps}
      style={{
        ...formItemProps?.style,
        display: 'block',
        marginBottom: 0,
      }}
    >
      <Space
        direction="vertical"
        style={{ width: '100%', minHeight: 0 }}
        size="large"
      >
        <Form.Item style={{ marginBottom: 0 }}>
          <p style={{ color: colors.text.primary }}>
            <Trans>Choose how you would like to configure your payouts.</Trans>
          </p>
          <PayoutConfigurationExplainerCollapse
            style={{ marginBottom: '1rem' }}
          />
          <Radio.Group
            onChange={e => {
              const newType = e.target.value
              if (newType === 'infinite') {
                setDistributionLimit(fromWad(MAX_DISTRIBUTION_LIMIT))
                setDistributionType(newType)
              } else if (newType === 'limit') {
                if (editableSplits.length) {
                  setSpecificLimitModalOpen(true)
                } else {
                  setDistributionLimit('0')
                  setDistributionType(newType)
                }
                if (
                  remainingSplitsPercentage &&
                  remainingSplitsPercentage !== 100
                ) {
                  editableSplits.push(ownerSplit)
                }
              } else if (newType === 'none') {
                setDistributionLimit('0')
                setDistributionType(newType)
              }
            }}
            value={distributionType}
          >
            <Space direction="vertical">
              <Radio value="limit">
                <Trans>Split within a distribution limit</Trans>
                <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                  <Trans>
                    Distribute a specific amount of funds to entities each
                    funding cycle.
                  </Trans>
                </p>
              </Radio>
              {distributionType === 'limit' ? (
                <div style={{ paddingLeft: '25px' }}>
                  <div style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 500, width: '100%' }}>
                      <Trans>Distribution limit:</Trans>
                    </label>
                    <DistributionLimitInput
                      value={distributionLimit}
                      onChange={setDistributionLimit}
                      currencyName={currencyName}
                      onCurrencyChange={onCurrencyChange}
                      disabled={sumPayoutsEnabled}
                    />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  >
                    <Switch
                      checked={sumPayoutsEnabled}
                      onChange={setSumPayoutsEnabled}
                      style={{ marginRight: 10 }}
                    />
                    <label>
                      <Trans>Make distribution limit the sum of payouts</Trans>
                    </label>
                  </div>
                </div>
              ) : null}
              <Radio value="infinite">
                <Trans>Split all funds</Trans>
                <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                  <Trans>
                    Distribute a percentage of all funds received to entities.
                    Your distribution limit will be <strong>infinite</strong>.
                  </Trans>
                </p>
              </Radio>
              <Radio value="none">
                <Trans>None</Trans>
                <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                  <Trans>
                    Nothing can be distributed from the treasury. Funds can only
                    be accessed by token holders redeeming their tokens.
                  </Trans>
                </p>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

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
        {totalSplitsPercentageInvalid ? (
          <span style={{ color: colors.text.failure, fontWeight: 600 }}>
            <Trans>Sum of percentages cannot exceed 100%.</Trans>
          </span>
        ) : remainingSplitsPercentage > 0 && distributionLimit !== '0' ? (
          <OwnerSplitCard />
        ) : null}
        <Form.Item
          extra={
            <Space size="small">
              <Trans>
                Payouts to Ethereum addresses incur a 2.5% JBX membership fee
              </Trans>
              <TooltipIcon
                tip={
                  <Trans>
                    When distributing, payouts to Ethereum addresses incur a
                    2.5% JBX membership fee. Payouts to other Juicebox projects
                    don't incur fees. Your project will receive (the{' '}
                    <Link to="/v2/p/1">JuiceboxDAO</Link> token) in return at
                    the current issuance rate.
                  </Trans>
                }
              />
            </Space>
          }
        >
          <Button
            type="dashed"
            onClick={() => {
              setAddSplitModalVisible(true)
            }}
            block
          >
            <Trans>Add payout</Trans>
          </Button>
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: colors.text.primary }}>
            <Trans>
              Distribution Limit{' '}
              <TooltipIcon
                tip={t`The maximum amount of funds that can be distributed from the treasury each funding cycle.`}
                placement={'topLeft'}
                iconStyle={{ marginRight: 5 }}
              />
              :
            </Trans>
          </span>
          <span>
            <strong>
              <DistributionLimit
                distributionLimit={parseWad(distributionLimit)}
                currencyName={currencyName}
                showTooltip
              />
            </strong>
          </span>
        </div>
      </Space>
      <DistributionSplitModal
        visible={addSplitModalVisible}
        onSplitsChanged={onSplitsChanged}
        mode={'Add'}
        splits={allSplits}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        currencyName={currencyName}
        onCurrencyChange={onCurrencyChange}
        onClose={() => setAddSplitModalVisible(false)}
        sumPayoutsEnabled={sumPayoutsEnabled}
      />
      <SpecificLimitModal
        visible={specificLimitModalOpen}
        onClose={() => setSpecificLimitModalOpen(false)}
        setDistributionLimit={setDistributionLimit}
        currencyName={currencyName}
        onCurrencyChange={onCurrencyChange}
      />
    </Form.Item>
  )
}
