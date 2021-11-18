import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Space, Statistic } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import ConfirmUnstakeTokensModal from 'components/modals/ConfirmUnstakeTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { ContractName } from 'models/contract-name'
import { BallotState } from 'models/funding-cycle'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatPercent, formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import IssueTickets from './IssueTickets'
import SectionHeader from './SectionHeader'

export default function Rewards({
  totalOverflow,
}: {
  totalOverflow: BigNumber | undefined
}) {
  const [stakeModalVisible, setStakeModalVisible] = useState<boolean>()
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] = useState<
    boolean
  >()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)

  const {
    projectId,
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    currentFC,
  } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.TerminalV1,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TerminalV1,
        eventName: 'PrintPreminedTickets',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Redeem',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Convert',
        topics:
          userAddress && projectId
            ? [userAddress, projectId.toHexString()]
            : undefined,
      },
    ],
    [projectId],
  )

  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: ticketContract && userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })

  const currentOverflow = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  const currentBallotState = useContractReader<BallotState>({
    contract: ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const metadata = decodeFCMetadata(currentFC?.metadata)

  const bondingCurveRate =
    currentBallotState === BallotState.Active
      ? metadata?.reconfigurationBondingCurveRate
      : metadata?.bondingCurveRate

  const reservedTicketBalance = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [projectId, metadata.reservedRate]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const totalSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [projectId?.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })?.add(reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0))

  const base =
    totalSupply && redeemAmount && currentOverflow
      ? currentOverflow?.mul(parseWad(redeemAmount)).div(totalSupply)
      : BigNumber.from(0)

  const rewardAmount = useMemo(() => {
    if (
      !bondingCurveRate ||
      !totalSupply ||
      !base ||
      !redeemAmount ||
      !currentOverflow
    )
      return undefined

    if (totalSupply.sub(parseWad(redeemAmount)).isNegative()) {
      return currentOverflow
    }

    const number = base
    const numerator = parseWad(bondingCurveRate).add(
      parseWad(redeemAmount)
        .mul(parseWad(200).sub(parseWad(bondingCurveRate)))
        .div(totalSupply),
    )
    const denominator = parseWad(200)

    return number.mul(numerator).div(denominator)
  }, [redeemAmount, base, bondingCurveRate, totalSupply, currentOverflow])

  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)

  const maxClaimable = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && projectId
        ? [userAddress, projectId.toHexString(), totalBalance?.toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId && userAddress
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const share = formatPercent(totalBalance, totalSupply)

  function redeem() {
    if (!transactor || !contracts || !rewardAmount) return

    setLoadingRedeem(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    // Arbitrary discrete value (wei) subtracted
    const minAmount = rewardAmount?.sub(1e12).toHexString()

    transactor(
      contracts.TerminalV1,
      'redeem',
      [
        userAddress,
        projectId.toHexString(),
        redeemWad.toHexString(),
        minAmount,
        userAddress,
        false, // TODO preferconverted
      ],
      {
        onConfirmed: () => setRedeemAmount(undefined),
        onDone: () => setLoadingRedeem(false),
      },
    )
  }

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const hasIssueTicketsPermission = useHasPermission(OperatorPermission.Issue)

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={tokenSymbol ? tokenSymbol + ' tokens' : 'Tokens'}
              tip={`${
                tokenSymbol ? tokenSymbol + ' ERC20' : 'Tokens'
              } are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet.`}
            />
          }
          valueRender={() => (
            <Descriptions
              layout={
                document.documentElement.clientWidth > 600
                  ? 'horizontal'
                  : 'vertical'
              }
              column={1}
            >
              {ticketsIssued && (
                <Descriptions.Item
                  label="Address"
                  children={
                    <div style={{ width: '100%', textAlign: 'right' }}>
                      <FormattedAddress address={tokenAddress} />
                    </div>
                  }
                />
              )}
              <Descriptions.Item
                label="Total supply"
                children={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      width: '100%',
                    }}
                  >
                    {formatWad(totalSupply, { decimals: 0 })}
                    <Button
                      size="small"
                      type="text"
                      onClick={() => setParticipantsModalVisible(true)}
                      disabled={isPreviewMode}
                    >
                      Holders
                    </Button>
                  </div>
                }
              />
              <Descriptions.Item
                label="Your balance"
                children={
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div>
                      {ticketsIssued && (
                        <div>
                          {ticketsBalance?.gt(0) ? (
                            <>
                              {`${formatWad(ticketsBalance ?? 0, {
                                decimals: 0,
                              })} ${tokenSymbol}`}
                            </>
                          ) : (
                            <>0 {tokenSymbol || 'tokens'}</>
                          )}
                        </div>
                      )}
                      {(iouBalance?.gt(0) || ticketsIssued === false) && (
                        <div>
                          {formatWad(iouBalance ?? 0, { decimals: 0 })}
                          {ticketsIssued && (
                            <>
                              {' '}
                              claimable{' '}
                              <Button
                                onClick={() => setUnstakeModalVisible(true)}
                                type="text"
                                size="small"
                                style={{
                                  color: colors.text.action.primary,
                                }}
                              >
                                Claim
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          cursor: 'default',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: colors.text.tertiary,
                        }}
                      >
                        {share || 0}% of supply
                      </div>
                    </div>
                    <Button
                      loading={loadingRedeem}
                      size="small"
                      onClick={() => setRedeemModalVisible(true)}
                      disabled={isPreviewMode}
                    >
                      Redeem
                    </Button>
                  </div>
                }
              />
            </Descriptions>
          )}
        />

        {!ticketsIssued && hasIssueTicketsPermission && !isPreviewMode && (
          <IssueTickets projectId={projectId} />
        )}
      </Space>

      <Modal
        title={`Redeem ${tokenSymbol ?? 'Tokens'}`}
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
        okButtonProps={{
          disabled:
            redeemDisabled || !redeemAmount || parseInt(redeemAmount) === 0,
        }}
        width={540}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            Balance: {formatWad(totalBalance ?? 0, { decimals: 0 })}{' '}
            {tokenSymbol ?? 'tokens'}
          </div>
          <p>
            Currently worth: <CurrencySymbol currency={0} />
            {formatWad(maxClaimable, { decimals: 4 })}
          </p>
          <p>
            Tokens can be redeemed for a project's overflow according to the
            bonding curve rate of the current funding cycle. Tokens are burned
            when they are redeemed.
          </p>
          {redeemDisabled && (
            <div style={{ color: colors.text.secondary, fontWeight: 500 }}>
              You can redeem tokens once this project has overflow.
            </div>
          )}
          {!redeemDisabled && (
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
              You will receive minimum {formatWad(rewardAmount) || '--'} ETH
            </div>
          )}
        </Space>
      </Modal>
      {/* <ConfirmStakeTokensModal
        visible={stakeModalVisible}
        onCancel={() => setStakeModalVisible(false)}
        ticketsUpdateOn={ticketsUpdateOn}
      /> */}
      <ConfirmUnstakeTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
      />
      <ParticipantsModal
        visible={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
    </div>
  )
}
