import { BigNumber } from '@ethersproject/bignumber'
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Input,
  Progress,
  Tooltip,
} from 'antd'
import Modal from 'antd/lib/modal/Modal'
import moment from 'moment'
import { useState } from 'react'

import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { colors } from '../constants/styles/colors'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { addressExists } from '../utils/addressExists'
import { orEmpty } from '../utils/orEmpty'

export default function BudgetDetail({
  budget,
  contracts,
  transactor,
  userAddress,
  onNeedProvider,
}: {
  budget: Budget
  contracts?: Contracts
  transactor?: Transactor
  userAddress?: string
  onNeedProvider: () => Promise<void>
}) {
  const [tapAmount, setTapAmount] = useState<BigNumber>(BigNumber.from(0))
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const wantTokenName = 'DAI'

  const tappableAmount = useContractReader<BigNumber>({
    contract: contracts?.BudgetStore,
    functionName: 'getTappableAmount',
    args: [budget?.id],
    shouldUpdate: bigNumbersEq,
  })

  const secondsLeft =
    budget &&
    Math.floor(
      budget.start.toNumber() +
        budget.duration.toNumber() -
        new Date().valueOf() / 1000,
    )

  function expandedTimeString(millis: number) {
    if (!millis || millis <= 0) return 0

    const days = millis && millis / 1000 / SECONDS_IN_DAY
    const hours = days && (days % 1) * 24
    const minutes = hours && (hours % 1) * 60
    const seconds = minutes && (minutes % 1) * 60

    return `${days && days >= 1 ? Math.floor(days) + 'd ' : ''}${
      hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
    }
        ${minutes && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
        ${seconds && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`
  }

  const isOwner = budget?.owner === userAddress

  function tap() {
    if (!transactor || !contracts?.Juicer) return onNeedProvider()

    setLoadingWithdraw(true)

    const id = budget.id.toHexString()
    const amount = tapAmount.toHexString()

    console.log('🧃 Calling Juicer.tapBudget(number, amount, address)', {
      id,
      amount,
      userAddress,
    })

    transactor(
      contracts.Juicer?.tapBudget(id, amount, userAddress),
      () => setLoadingWithdraw(false),
      true,
    )
  }

  if (!budget) return null

  const surplus = budget.total.sub(budget.target)

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
  }

  const gutter = 25

  const formatDate = (date: number) => moment(date).format('M-DD-YYYY h:mma')

  const ended: string | undefined =
    budget.start.add(budget.duration).toNumber() * 1000 < new Date().valueOf()
      ? formatDate(budget.start.add(budget.duration).toNumber() * 1000)
      : undefined

  const toolTipLabel = (labelText: string, tip: string) => (
    <span>
      <Tooltip title={tip}>{labelText}</Tooltip>
    </span>
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: 15,
          marginBottom: 0,
          paddingBottom: 15,
          paddingLeft: gutter,
          paddingRight: gutter,
          borderBottom: '1px solid black',
          whiteSpace: 'pre',
        }}
      >
        <h3 style={{ fontWeight: 600, marginRight: gutter, marginBottom: 0 }}>
          # {budget.number.toString()}
        </h3>
        <Progress
          percent={budget.total
            .mul(100)
            .div(budget.target)
            .toNumber()}
          showInfo={false}
          strokeColor={colors.juiceOrange}
        ></Progress>
        <span style={{ marginLeft: gutter }}>
          <span style={{ fontWeight: 600 }}>
            {orEmpty(budget.total.toString())}
          </span>
          /{budget.target.toString()}{' '}
          {surplus.gt(0) ? (
            <span style={{ color: colors.secondary, fontWeight: 600 }}>
              +{surplus.toString()}
            </span>
          ) : null}{' '}
          {wantTokenName}
        </span>
      </div>

      <Descriptions {...descriptionsStyle} column={2} bordered>
        <Descriptions.Item label="Started">
          {formatDate(budget.start.toNumber() * 1000)}
        </Descriptions.Item>

        <Descriptions.Item label="Duration">
          {expandedTimeString(budget && budget.duration.toNumber() * 1000)}
        </Descriptions.Item>

        <Descriptions.Item label={ended ? 'Ended' : 'Time left'}>
          {(secondsLeft && expandedTimeString(secondsLeft * 1000)) || ended}
        </Descriptions.Item>

        <Descriptions.Item label="Tapped">
          {budget.tapped.toString()} {wantTokenName}
        </Descriptions.Item>

        <Descriptions.Item label="Withdrawable" span={2}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {tappableAmount?.toString() ?? '0'} {wantTokenName}
            {isOwner && tappableAmount?.gt(0) ? (
              <div>
                <Button
                  loading={loadingWithdraw}
                  onClick={() => setWithdrawModalVisible(true)}
                >
                  Withdraw
                </Button>
                <Modal
                  title="Withdraw funds"
                  visible={withdrawModalVisible}
                  onOk={() => {
                    tap()
                    setWithdrawModalVisible(false)
                  }}
                  onCancel={() => {
                    setTapAmount(BigNumber.from(0))
                    setWithdrawModalVisible(false)
                  }}
                  okText="Withdraw"
                  width={540}
                >
                  <Input
                    name="withdrawable"
                    placeholder="0"
                    suffix={wantTokenName}
                    value={tapAmount.toString()}
                    max={tappableAmount?.toString()}
                    onChange={e => setTapAmount(BigNumber.from(e.target.value))}
                  />
                </Modal>
              </div>
            ) : null}
          </div>
        </Descriptions.Item>
      </Descriptions>

      {budget?.link ? (
        <div
          style={{
            display: 'block',
            margin: gutter,
          }}
        >
          <a href={budget.link} target="_blank" rel="noopener noreferrer">
            {budget.link}
          </a>
        </div>
      ) : null}

      <div style={{ margin: gutter }}>
        <Descriptions {...descriptionsStyle} size="small" column={2}>
          <Descriptions.Item label="Weight">
            {budget.weight.toString()}
          </Descriptions.Item>

          <Descriptions.Item
            label={toolTipLabel(
              'Discount Rate',
              'Long as ss string Long as ss string Long as ss ',
            )}
          >
            {budget.discountRate.toString()} %
          </Descriptions.Item>

          <Descriptions.Item label="Reserved for owner">
            {budget.o.toString()}%
          </Descriptions.Item>

          {!addressExists(budget.bAddress) ? null : (
            <Descriptions.Item label="Reserved for beneficiary">
              {budget.b.toString()}%
            </Descriptions.Item>
          )}

          {!addressExists(budget.bAddress) ? null : (
            <Descriptions.Item label="Beneficiary address" span={2}>
              {budget.bAddress.toString()}
            </Descriptions.Item>
          )}

          {ended && surplus.gt(0) ? (
            <Descriptions.Item label="Reserves">
              {budget?.hasMintedReserves ? 'Minted' : 'Not minted'}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
      </div>
    </div>
  )
}
