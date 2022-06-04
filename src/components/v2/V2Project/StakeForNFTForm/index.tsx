import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Col, Row, Select, Input } from 'antd'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'
import { NetworkContext } from 'contexts/networkContext'
import { fromWad } from 'utils/formatNumber'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NFTProjectContext } from 'contexts/v2/nftProjectContext'
import { BigNumber } from '@ethersproject/bignumber'
import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'
import { detailedTimeString } from 'utils/formatTime'

import { useNFTMetadata } from 'hooks/v2/nft/NFTMetadata'

import { useNFTResolverTokenURI } from 'hooks/v2/nft/NFTResolverTokenURI'

import StakedTokenStatsSection from './StakedTokenStatsSection'
import StakingTokenRangesModal from './StakingTokenRangesModal'
import ConfirmStakeModal from './ConfirmStakeModal'

const FakeTokenStatsData = {
  initialLocked: 0.0,
  totalStaked: 2668000000,
  userTotalLocked: 10159000,
  totalStakedPeriodInDays: 10,
}

export default function StakeForNFTForm({
  onClose,
}: {
  onClose: VoidFunction
}) {
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, tokenName, projectMetadata, tokenAddress } =
    useContext(V2ProjectContext)
  const { lockDurationOptions, resolverAddress } = useContext(NFTProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [tokensStaked, setTokensStaked] = useState('0')
  const [lockDuration, setLockDuration] = useState(864000)

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
  const nftHash = nftTokenURI ? nftTokenURI.split('ipfs://')[1] : undefined
  const { data: metadata, refetch } = useNFTMetadata(nftHash)

  const handleReviewButtonClick = () => {
    refetch()
    setConfirmStakeModalVisible(true)
  }

  return (
    <Form layout="vertical" style={{ width: '100%' }}>
      <Space size="middle" direction="vertical">
        <h1>
          <Trans>Lock {tokenName} for Voting Power</Trans>
        </h1>
        <div style={{ color: colors.text.secondary }}>
          <p>
            <Trans>
              Stake {tokenName} (${tokenSymbolText({ tokenSymbol })}) tokens for
              irrevocable durations (in days) in exchange for voting weight. In
              return, you will impact {projectName} governance and receive a
              choice anathropomorphic banana character NFT.
            </Trans>
          </p>
        </div>
        <Button block onClick={() => setTokenRangesModalVisible(true)}>
          <Trans>View Token Ranges</Trans>
        </Button>
        <h4>
          <Trans>
            Currently, only project tokens claimed as ERC-20 tokens can be
            staked for NFTs.
          </Trans>
        </h4>
      </Space>
      <Form.Item
        extra={
          <div style={{ color: colors.text.primary, marginBottom: 10 }}>
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
              <div style={{ color: colors.text.primary, marginBottom: 10 }}>
                <Trans>Days Locked</Trans>
              </div>
            }
          >
            <Select value={lockDuration} onChange={val => setLockDuration(val)}>
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
                  color: colors.text.primary,
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

      <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
        <p>
          <Trans>
            Voting weight is a function of how many $
            {tokenSymbolText({ tokenSymbol })} you have locked for how long
            intitially divided by how much time left in that lock period.
          </Trans>
        </p>
        <p>
          <Trans>
            Voting Power = Tokens * ( Lock Time Remaining / Max Lock Time )
          </Trans>
        </p>
        <p>
          <Trans>
            VP decays over time linearly. When @ 5 days of 19 day lock = 50%
            PWR.
          </Trans>
        </p>
      </div>

      {/* <StakingNFTCarousel activeIdx={1} stakingNFTs={FakeStakingNFTs} /> */}
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={handleReviewButtonClick}
          disabled={!userAddress}
        >
          {userAddress ? 'Review and Confirm Stake' : 'Connect Wallet'}
        </Button>
      </Space>
      <Divider />
      {/* <OwnedNFTsSection ownedNFTs={FakeOwnedNFTS} tokenSymbol={tokenSymbol!} /> */}
      <StakedTokenStatsSection
        {...FakeTokenStatsData}
        tokenSymbol={tokenSymbol!}
      />
      <Form.Item>
        <Button block onClick={onClose}>
          <Trans>Close</Trans>
        </Button>
      </Form.Item>
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
        maxLockDuration={maxLockDuration}
        tokenMetadata={metadata}
        onCancel={() => setConfirmStakeModalVisible(false)}
        onOk={() => setConfirmStakeModalVisible(false)}
      />
    </Form>
  )
}
