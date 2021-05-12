import { InfoCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Collapse, Input, Modal, Progress, Space, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import {
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { currencyName } from 'utils/currency'
import {
  formattedNum,
  formatWad,
  fracDiv,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'
import { detailedTimeString } from 'utils/formatTime'

import FundingCycleDetails from './FundingCycleDetails'

export default function Funding({
  projectId,
  fundingCycle,
  showDetail,
  isOwner,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  showDetail?: boolean
  isOwner?: boolean
}) {
  const { transactor, contracts, onNeedProvider, userAddress } = useContext(
    UserContext,
  )

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const converter = useCurrencyConverter()

  const balance = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
    formatter: useCallback(
      ({ amountWithYield }: { amountWithYield: BigNumber }) => amountWithYield,
      [],
    ),
  })

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  console.log('check overflow', {
    balance: balance?.toString(),
    overflow: totalOverflow?.toString(),
    target: fundingCycle?.target.toString(),
    tapped: fundingCycle?.tapped.toString(),
  })

  function tap() {
    if (!transactor || !contracts?.Juicer || !fundingCycle)
      return onNeedProvider()

    setLoadingWithdraw(true)

    if (!tapAmount) {
      setLoadingWithdraw(false)
      return
    }

    // Arbitrary discrete value (wei) subtracted
    const minAmount =
      currency === 'USD'
        ? converter.usdToWei(tapAmount)
        : parseWad(tapAmount)?.sub(1e12)

    transactor(
      contracts.Juicer,
      'tap',
      [
        projectId.toHexString(),
        parseWad(tapAmount).toHexString(),
        userAddress,
        minAmount?.toHexString(),
      ],
      {
        onDone: () => setLoadingWithdraw(false),
      },
    )
  }

  const currency = currencyName(fundingCycle?.currency)

  const balanceInCurrency = useMemo(
    () =>
      currency === 'USD'
        ? parseWad(converter.weiToUsd(balance)?.toString())
        : balance,
    [currency, balance, converter],
  )

  const paidInCurrency = balanceInCurrency?.add(fundingCycle?.tapped ?? 0)

  const percentPaid = useMemo(
    () =>
      paidInCurrency && fundingCycle?.target
        ? fracDiv(paidInCurrency.toString(), fundingCycle.target.toString()) *
          100
        : 0,
    [fundingCycle?.target, paidInCurrency],
  )

  if (!fundingCycle) return null

  const smallHeader = (text: string, tip?: string) => (
    <span style={{ fontSize: '.7rem', fontWeight: 500, cursor: 'default' }}>
      {tip ? (
        <Tooltip title={tip}>
          {text}
          <span style={{ marginLeft: 5, color: colors.bodySecondary }}>
            <InfoCircleOutlined />
          </span>
        </Tooltip>
      ) : (
        text
      )}
    </span>
  )

  const primaryPaidStyle: CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 500,
  }

  const untapped = fundingCycle.target.sub(fundingCycle.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

  const isRecurring = fundingCycle?.discountRate > 0

  const now = Math.round(new Date().valueOf() / 1000)
  const secondsLeft = fundingCycle.start + fundingCycle.duration - now
  const isEnded = secondsLeft <= 0

  let header: string

  if (isRecurring) {
    header = isEnded
      ? 'Cycle ended'
      : 'Cycle ends in ' + detailedTimeString(secondsLeft)
  } else header = detailedTimeString(secondsLeft) + ' left'

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {smallHeader(
                'PAID',
                'The total paid to the project in this funding cycle, plus any overflow carried over from the previous funding cycle.',
              )}
              {currency === 'USD' ? (
                <div>
                  <span
                    style={{
                      ...primaryPaidStyle,
                      color: colors.juiceOrange,
                    }}
                  >
                    <CurrencySymbol currency="1" />
                    {formatWad(paidInCurrency)}
                  </span>{' '}
                  <span style={{ opacity: 0.6 }}>
                    <CurrencySymbol currency="0" />
                    {formatWad(converter.usdToWei(fromWad(paidInCurrency)))}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    ...primaryPaidStyle,
                    color: colors.juiceOrange,
                  }}
                >
                  <CurrencySymbol currency="0" />
                  {formatWad(paidInCurrency)}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              {smallHeader(
                'OVERFLOW',
                'The amount paid to the project, minus the amount the project can withdraw in this funding cycle. Can be claimed by ticket holders.',
              )}
              {currency === 'USD' ? (
                <div>
                  <span
                    style={{
                      ...primaryPaidStyle,
                      color: colors.cta,
                    }}
                  >
                    <CurrencySymbol currency="1" />
                    {formattedNum(converter.weiToUsd(totalOverflow))}
                  </span>{' '}
                  <span style={{ opacity: 0.6 }}>
                    <CurrencySymbol currency="0" />
                    {formatWad(totalOverflow ?? 0)}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    ...primaryPaidStyle,
                    color: colors.cta,
                  }}
                >
                  <CurrencySymbol currency="0" />
                  {formatWad(totalOverflow ?? 0)}
                </div>
              )}
            </div>
          </div>

          {totalOverflow?.gt(0) ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                percent={percentPaid}
                showInfo={false}
                strokeColor={colors.juiceOrange}
              />
              <div
                style={{
                  width: 4,
                  height: 15,
                  borderRadius: '2px',
                  background: 'white',
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 3,
                }}
              ></div>
              <Progress
                style={{
                  width:
                    fracDiv(
                      totalOverflow?.toString() ?? '0',
                      balanceInCurrency?.toString() ?? '1',
                    ) *
                      100 +
                    '%',
                  minWidth: 10,
                }}
                percent={100}
                showInfo={false}
                strokeColor={colors.cta}
              />
            </div>
          ) : (
            <Progress
              percent={percentPaid}
              showInfo={false}
              strokeColor={colors.juiceOrange}
            />
          )}

          <div>
            <div>
              <span style={{ color: 'white', fontWeight: 500 }}>
                <CurrencySymbol
                  currency={fundingCycle.currency.toString() as CurrencyOption}
                />
                {formatWad(fundingCycle.target)}{' '}
                <span style={{ opacity: 0.6 }}>
                  {smallHeader(
                    'withdraw limit',
                    'The maximum amount this project can withdraw in the current funding cycle.',
                  )}
                </span>
              </span>{' '}
            </div>
          </div>
        </div>

        {isOwner ? (
          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: 20, marginBottom: 10 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div>Withdrawn:</div>
              <div>
                <CurrencySymbol
                  currency={fundingCycle?.currency.toString() as CurrencyOption}
                />
                {formatWad(fundingCycle?.tapped) || '0'}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div>Available:</div>
              <div>
                <CurrencySymbol
                  currency={fundingCycle?.currency.toString() as CurrencyOption}
                />
                {formatWad(withdrawable) || '0'}
                <Button
                  style={{ marginLeft: 10 }}
                  type="ghost"
                  size="small"
                  loading={loadingWithdraw}
                  onClick={() => setWithdrawModalVisible(true)}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </Space>
        ) : null}

        <Collapse
          style={{
            background: 'transparent',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          className="minimal"
          defaultActiveKey={showDetail ? '0' : undefined}
        >
          <CollapsePanel
            key={'0'}
            style={{ border: 'none', padding: 0 }}
            header={header}
          >
            <FundingCycleDetails fundingCycle={fundingCycle} />
          </CollapsePanel>
        </Collapse>
      </Space>

      <Modal
        title="Withdraw funds"
        visible={withdrawModalVisible}
        onOk={() => {
          tap()
          setWithdrawModalVisible(false)
        }}
        onCancel={() => {
          setTapAmount(undefined)
          setWithdrawModalVisible(false)
        }}
        okText="Withdraw"
        width={540}
      >
        <div style={{ marginBottom: 10 }}>
          Withdraw up to:{' '}
          <CurrencySymbol
            currency={fundingCycle.currency.toString() as CurrencyOption}
          />
          {formatWad(withdrawable)}
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            name="withdrawable"
            placeholder="0"
            suffix={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: 8 }}>{currency}</span>
                <InputAccessoryButton
                  content="MAX"
                  onClick={() => setTapAmount(fromWad(withdrawable))}
                />
              </div>
            }
            type="number"
            value={tapAmount}
            max={fromWad(withdrawable)}
            onChange={e => setTapAmount(e.target.value)}
          />
          {currency === 'USD' && (
            <div style={{ textAlign: 'right' }}>
              {formatWad(converter.usdToWei(tapAmount)) || '--'}{' '}
              <CurrencySymbol currency={'0'} />
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}
