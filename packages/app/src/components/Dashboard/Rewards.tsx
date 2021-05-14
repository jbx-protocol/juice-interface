import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space, Statistic } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useCallback, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'
import { decodeFCMetadata } from 'utils/fundingCycle'

import TooltipLabel from '../shared/TooltipLabel'
import { currencyName } from 'utils/currency'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'

export default function Rewards({
  projectId,
  currentCycle,
}: {
  projectId: BigNumber | undefined
  currentCycle: FundingCycle | undefined
}) {
  const { contracts, transactor, userAddress, onNeedProvider } = useContext(
    UserContext,
  )

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [minRedeemAmount, setMinRedeemAmount] = useState<BigNumber>()

  const converter = useCurrencyConverter()

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.Juicer,
        eventName: 'Redeem',
        topics: projectId ? [[], projectId?.toHexString()] : undefined,
      },
    ],
    [projectId],
  )

  const ticketsBalance = useContractReader<BigNumber>({
    contract: ContractName.Tickets,
    functionName: 'balanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: ContractName.Tickets,
    functionName: 'totalSupply',
    args: [projectId?.toHexString()],
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
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

  const bondingCurveRate = decodeFCMetadata(currentCycle?.metadata)
    ?.bondingCurveRate

  // TODO Juicer.claimableAmount
  const onChangeRedeemAmount = useCallback(
    (amount: string | undefined) => {
      setRedeemAmount(amount)

      if (
        amount === undefined ||
        !totalOverflow ||
        !bondingCurveRate ||
        !ticketSupply ||
        ticketSupply.eq(0)
      ) {
        setMinRedeemAmount(undefined)
      } else {
        setMinRedeemAmount(
          parseWad(amount)
            ?.mul(totalOverflow)
            .mul(bondingCurveRate)
            .div(1000)
            .div(ticketSupply),
        )
      }
    },
    [
      setRedeemAmount,
      setMinRedeemAmount,
      bondingCurveRate,
      ticketSupply,
      totalOverflow,
    ],
  )

  const share = ticketSupply?.gt(0)
    ? ticketsBalance?.mul(100).div(ticketSupply).toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!minRedeemAmount) return

    setLoadingRedeem(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    transactor(
      contracts.Juicer,
      'redeem',
      [
        userAddress,
        projectId.toHexString(),
        redeemWad.toHexString(),
        minRedeemAmount.toHexString(),
        userAddress,
        false,
      ],
      {
        onConfirmed: () => onChangeRedeemAmount(undefined),
        onDone: () => setLoadingRedeem(false),
      },
    )
  }

  const subText = (text: string) => (
    <div
      style={{
        fontSize: '.8rem',
        fontWeight: 500,
        color: 'inherit',
      }}
    >
      {text}
    </div>
  )

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  return (
    <Space direction="vertical" size="large">
      <Statistic
        title={
          <TooltipLabel
            label="Overflow"
            tip="The amount paid to the project, minus the amount the project can withdraw in this funding cycle. Can be claimed by ticket holders."
            placement="bottom"
          />
        }
        valueRender={() =>
          currentCycle?.currency === 1 ? (
            <div>
              <span>
                <CurrencySymbol currency={1} />
                {formattedNum(converter.weiToUsd(totalOverflow))}{' '}
              </span>
              <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                <CurrencySymbol currency={0} />
                {formatWad(totalOverflow ?? 0)}
              </span>
            </div>
          ) : (
            <div>
              <CurrencySymbol currency={0} />
              {formatWad(totalOverflow ?? 0)}
            </div>
          )
        }
      />

      <Statistic
        title={
          <TooltipLabel
            label="Your wallet"
            tip="Tickets can be redeemed for your project's overflow according to the current term's bonding
        curve rate. Meaning, if the rate is 70% and there's 100 ETH overflow available
        with 100 of your Tickets in circulation, 10 Tickets could be redeemed
        for 7 ETH from the overflow. The rest is left to share between the
        remaining ticket hodlers."
            placement="bottom"
          />
        }
        valueRender={() => (
          <div>
            <div>
              {formatWad(ticketsBalance ?? 0)} tickets{' '}
              <Button
                loading={loadingRedeem}
                size="small"
                onClick={() => setRedeemModalVisible(true)}
              >
                Redeem
              </Button>
            </div>
            <div style={{ color: colors.bodySecondary }}>
              {subText(
                `${share ?? 0}% of ${
                  formatWad(ticketSupply) ?? 0
                } tickets in circulation`,
              )}
            </div>
          </div>
        )}
      />

      <Modal
        title="Redeem Tickets"
        visible={redeemModalVisible}
        onOk={() => {
          redeem()
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          onChangeRedeemAmount(undefined)
          setRedeemModalVisible(false)
        }}
        okText="Redeem"
        okButtonProps={{ disabled: redeemDisabled }}
        width={540}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>Balance: {formatWad(ticketsBalance ?? 0)} tickets</div>
          {redeemDisabled ? (
            <div style={{ color: colors.juiceLight, fontWeight: 500 }}>
              You can redeem tickets once this project has overflow.
            </div>
          ) : (
            <div>
              <FormattedNumberInput
                min={0}
                step={0.001}
                placeholder="0"
                value={redeemAmount}
                disabled={redeemDisabled}
                accessory={
                  <InputAccessoryButton
                    content="MAX"
                    onClick={() =>
                      onChangeRedeemAmount(fromWad(ticketsBalance))
                    }
                  />
                }
                onChange={val => onChangeRedeemAmount(val)}
              />
              You will receive minimum {formatWad(minRedeemAmount) || '--'} ETH
            </div>
          )}
        </Space>
      </Modal>
    </Space>
  )
}
