import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space, Statistic } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'
import { useReadProvider } from 'utils/providers'

import TooltipLabel from '../shared/TooltipLabel'
import IssueTickets from './IssueTickets'

export default function Rewards({
  projectId,
  currentCycle,
  isOwner,
}: {
  projectId: BigNumber | undefined
  currentCycle: FundingCycle | undefined
  isOwner: boolean | undefined
}) {
  const { contracts, transactor, userAddress, onNeedProvider } = useContext(
    UserContext,
  )

  const { colors } = useContext(ThemeContext).theme

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingClaim, setLoadingClaim] = useState<boolean>()

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
      {
        contract: ContractName.Tickets,
        eventName: 'Convert',
        topics:
          projectId && userAddress
            ? [userAddress, projectId?.toHexString()]
            : undefined,
      },
    ],
    [projectId],
  )

  const ticketAddress = useContractReader<string>({
    contract: ContractName.Tickets,
    functionName: 'tickets',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: ContractName.Tickets,
          eventName: 'Issue',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
      ],
      [],
    ),
  })
  const readProvider = useReadProvider()
  const ticketContract = useErc20Contract(ticketAddress, readProvider)
  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: ticketContract && userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.Tickets,
    functionName: 'IOU',
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
  const claimableAmount = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'claimableAmount',
    args:
      userAddress && projectId && redeemAmount
        ? [
            userAddress,
            projectId.toHexString(),
            parseWad(redeemAmount).toHexString(),
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId && userAddress
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  console.log('claimable', claimableAmount, parseWad(redeemAmount))

  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)

  const share = ticketSupply?.gt(0)
    ? totalBalance?.mul(100).div(ticketSupply).toString()
    : '0'

  function claim() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!projectId) return

    setLoadingClaim(true)

    transactor(
      contracts.Tickets,
      'convert',
      [userAddress, projectId.toHexString()],
      {
        onDone: () => setLoadingClaim(false),
      },
    )
  }

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!claimableAmount) return

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
        claimableAmount.toHexString(),
        userAddress,
        false,
      ],
      {
        onConfirmed: () => setRedeemAmount(undefined),
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

  const ticketsIssued = ticketAddress
    ? ticketAddress !== constants.AddressZero
    : undefined

  const redeemButton = (
    <Button
      loading={loadingRedeem}
      size="small"
      onClick={() => setRedeemModalVisible(true)}
    >
      Redeem
    </Button>
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
            {iouBalance?.gt(0) || ticketsIssued === false ? (
              <div>
                {formatWad(iouBalance ?? 0)} tickets{' '}
                {ticketsIssued ? (
                  <Button loading={loadingClaim} onClick={claim} size="small">
                    Claim {ticketSymbol}
                  </Button>
                ) : null}
              </div>
            ) : null}
            {ticketsIssued === true ? (
              <div>
                {formatWad(ticketsBalance ?? 0)} <span>{ticketSymbol}</span>
              </div>
            ) : null}
            <div style={{ color: colors.text.secondary }}>
              {subText(
                `${share ?? 0}% of ${formatWad(ticketSupply) ?? 0} ${
                  ticketSymbol ?? 'tickets'
                } in circulation`,
              )}
            </div>
            {redeemButton}
          </div>
        )}
      />

      {!ticketsIssued && isOwner ? (
        <IssueTickets projectId={projectId} />
      ) : null}

      <Modal
        title={`Redeem ${ticketSymbol ?? 'Tickets'}`}
        visible={redeemModalVisible}
        onOk={() => {
          redeem()
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          setRedeemAmount(undefined)
          setRedeemModalVisible(false)
        }}
        okText="Redeem"
        okButtonProps={{ disabled: redeemDisabled }}
        width={540}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>Balance: {formatWad(totalBalance ?? 0)} tickets</div>
          {redeemDisabled ? (
            <div style={{ color: colors.text.secondary, fontWeight: 500 }}>
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
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                }
                onChange={val => setRedeemAmount(val)}
              />
              You will receive minimum {formatWad(claimableAmount) || '--'} ETH
            </div>
          )}
        </Space>
      </Modal>
    </Space>
  )
}
