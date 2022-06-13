import { Trans } from '@lingui/macro'
import { Button, Form, Space, Col, Row, Select, Input, Switch } from 'antd'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { MaxUint256 } from '@ethersproject/constants'

import { useContext, useState } from 'react'
import { NetworkContext } from 'contexts/networkContext'
import { fromWad, parseWad } from 'utils/formatNumber'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { BigNumber } from '@ethersproject/bignumber'
import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'
import { detailedTimeString } from 'utils/formatTime'

import { useNFTMetadata } from 'hooks/veNft/VeNftMetadata'

import { useNFTResolverTokenURI } from 'hooks/veNft/VeNftResolverTokenURI'

import useERC20Approve from 'hooks/v2/transactor/ERC20ApproveTx'

import useERC20Allowance from 'hooks/ERC20Allowance'

import { VeNftProjectContext } from 'contexts/v2/veNftProjectContext'

import StakingTokenRangesModal from 'components/v2/V2Project/VeNftStakingForm/StakingTokenRangesModal'
import ConfirmStakeModal from 'components/v2/V2Project/VeNftStakingForm/ConfirmStakeModal'
import OwnedNFTSection from 'components/v2/V2Project/VeNftStakingForm/OwnedNFTSection'
import StakingNFTCarousel from 'components/v2/V2Project/VeNftStakingForm/StakingNFTCarousel'

import {
  JBX_CONTRACT_ADDRESS,
  VEBANNY_CONTRACT_ADDRESS,
} from 'constants/v2/nft/nftProject'

import { shadowCard } from 'constants/styles/shadowCard'

export default function StakeForNFTForm() {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenSymbol, tokenName, projectMetadata, tokenAddress } =
    useContext(V2ProjectContext)
  const {
    lockDurationOptions,
    resolverAddress,
    baseImagesHash,
    userTokens,
    variants,
  } = useContext(VeNftProjectContext)
  const { theme } = useContext(ThemeContext)

  const [tokensStaked, setTokensStaked] = useState('1')
  const [lockDuration, setLockDuration] = useState(1)
  const [beneficiary, setBeneficiary] = useState('')
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState(false)

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)

  const lockDurationOptionsInSeconds = lockDurationOptions
    ? lockDurationOptions.map((option: BigNumber) => {
        return option.toNumber()
      })
    : []
  const maxLockDuration =
    lockDurationOptionsInSeconds.length > 0
      ? lockDurationOptionsInSeconds[lockDurationOptionsInSeconds.length - 1]
      : 0

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const totalBalanceInWad = fromWad(claimedBalance)
  const unstakedTokens = claimedBalance
    ? parseInt(totalBalanceInWad) - parseInt(tokensStaked)
    : 0

  const projectName = projectMetadata?.name ?? 'Untitled Project'
  const votingPower = parseInt(tokensStaked) * (lockDuration / maxLockDuration)

  const { data: nftTokenURI } = useNFTResolverTokenURI(
    resolverAddress,
    parseInt(tokensStaked),
    lockDuration,
    lockDurationOptions,
  )
  const { data: metadata, refetch } = useNFTMetadata(nftTokenURI)

  const { data: allowance } = useERC20Allowance(
    JBX_CONTRACT_ADDRESS,
    userAddress,
    VEBANNY_CONTRACT_ADDRESS,
  )
  const hasAdequateApproval = allowance
    ? allowance.gte(parseWad(tokensStaked))
    : false

  const approveTx = useERC20Approve(JBX_CONTRACT_ADDRESS)

  async function approve() {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await approveTx({
      spender: VEBANNY_CONTRACT_ADDRESS,
      amount: MaxUint256,
    })

    if (!txSuccess) {
      return
    }
  }

  const handleReviewButtonClick = () => {
    refetch()
    setConfirmStakeModalVisible(true)
  }

  const renderActionButton = () => {
    if (!userAddress && onSelectWallet) {
      return (
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={() => onSelectWallet()}
        >
          Connect Wallet
        </Button>
      )
    }
    if (!hasAdequateApproval) {
      return (
        <Button block style={{ whiteSpace: 'pre' }} onClick={approve}>
          Approve Token for Transaction
        </Button>
      )
    } else {
      return (
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={handleReviewButtonClick}
        >
          Review and Confirm Stake
        </Button>
      )
    }
  }

  return (
    <>
      <h1>
        <Trans>Lock {tokenName} for Voting Power</Trans>
      </h1>
      <p>
        <Trans>
          Stake {tokenName} (${tokenSymbolText({ tokenSymbol })}) tokens in
          exchange for voting weight. In return, you will impact {projectName}{' '}
          governance and receive a choice NFT.
        </Trans>
      </p>
      <Form layout="vertical" style={{ width: '100%' }}>
        <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
          <Space size="middle" direction="vertical">
            <h4>
              <Trans>
                Currently, only project tokens claimed as ERC-20 tokens can be
                staked for NFTs.
              </Trans>
            </h4>
          </Space>
          <Form.Item
            extra={
              <div
                style={{ color: theme.colors.text.primary, marginBottom: 10 }}
              >
                <p style={{ float: 'left' }}>
                  <Trans>{tokenSymbolText({ tokenSymbol })} to lock</Trans>
                </p>
                <p style={{ float: 'right' }}>
                  <Trans>Remaining: {unstakedTokens}</Trans>
                </p>
              </div>
            }
          >
            <FormattedNumberInput
              name="tokensStaked"
              value={tokensStaked}
              onChange={val => {
                setTokensStaked(val ?? '0')
              }}
            />
          </Form.Item>
          <Row>
            <Col span={14}>
              <Form.Item
                extra={
                  <div
                    style={{
                      color: theme.colors.text.primary,
                      marginBottom: 10,
                    }}
                  >
                    <Trans>Days Locked</Trans>
                  </div>
                }
              >
                <Select
                  value={lockDuration}
                  onChange={val => setLockDuration(val)}
                >
                  {lockDurationOptionsInSeconds.map((duration: number) => {
                    return (
                      <Select.Option key={duration} value={duration}>
                        {detailedTimeString({
                          timeSeconds: duration,
                          fullWords: true,
                        })}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <p style={{ textAlign: 'center' }}>=</p>
            </Col>
            <Col span={6}>
              <Form.Item
                extra={
                  <div
                    style={{
                      color: theme.colors.text.primary,
                      marginBottom: 10,
                      textAlign: 'right',
                    }}
                  >
                    <Trans>Voting Power</Trans>
                  </div>
                }
              >
                <Input disabled={true} value={`${votingPower} VotePWR`} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <>
                <Trans>Custom token beneficiary</Trans>
                <Switch
                  checked={customBeneficiaryEnabled}
                  onChange={setCustomBeneficiaryEnabled}
                  style={{ marginLeft: 10 }}
                />
              </>
            }
            extra={
              <div
                style={{ color: theme.colors.text.primary, marginBottom: 10 }}
              >
                <p>
                  <Trans>Mint NFT to a custom address</Trans>
                </p>
              </div>
            }
            style={{ marginBottom: '1rem' }}
          />
          {customBeneficiaryEnabled && (
            <Form.Item>
              <Input
                value={beneficiary}
                onChange={e => setBeneficiary(e.target.value)}
              />
            </Form.Item>
          )}
          {variants && baseImagesHash && (
            <StakingNFTCarousel
              activeIdx={0}
              variants={variants}
              baseImagesHash={baseImagesHash}
            />
          )}
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Button block onClick={() => setTokenRangesModalVisible(true)}>
              <Trans>View Token Ranges</Trans>
            </Button>
            {renderActionButton()}
          </Space>
        </div>
        {userTokens && userTokens.length > 0 && (
          <>
            <OwnedNFTSection
              tokenSymbol={tokenSymbol!}
              userTokens={userTokens}
            />
            {/* <StakedTokenStatsSection
              tokenSymbol={tokenSymbol!}
              userTokens={userTokens}
            /> */}
          </>
        )}

        <StakingTokenRangesModal
          visible={tokenRangesModalVisible}
          onCancel={() => setTokenRangesModalVisible(false)}
          tokenSymbol={tokenSymbol!}
        />
        <ConfirmStakeModal
          visible={confirmStakeModalVisible}
          tokenSymbol={tokenSymbol!}
          tokensStaked={parseInt(tokensStaked)}
          votingPower={votingPower}
          lockDuration={lockDuration}
          beneficiary={beneficiary}
          maxLockDuration={maxLockDuration}
          tokenMetadata={metadata}
          onCancel={() => setConfirmStakeModalVisible(false)}
        />
      </Form>
    </>
  )
}
