import { Trans } from '@lingui/macro'
import {
  Button,
  Divider,
  Form,
  Space,
  InputNumber,
  Col,
  Row,
  Select,
} from 'antd'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'

import { StakingNFT } from 'models/v2/stakingNFT'

import ExternalLink from 'components/shared/ExternalLink'

import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'

import { NetworkContext } from 'contexts/networkContext'

import { fromWad } from 'utils/formatNumber'

import { NFTDelegate } from 'models/v2/nftDelegate'

import StakedTokenStats from './StakedTokenStatsSection'
import { OwnedNFT } from './OwnedNFTSection'
import OwnedNFTsSection from './OwnedNFTSection'
import StakingNFTCarousel from './StakingNFTCarousel'

import nammuSvg from './SVGs/01.svg'
import farceurSvg from './SVGs/02.svg'
import bronsonSvg from './SVGs/03.svg'
import johnnySvg from './SVGs/04.svg'

import StakingTokenRangesModal from './StakingTokenRangesModal'
import DelegatePickerModal from './DelegatePickerModal'
import ConfirmStakeModal from './ConfirmStakeModal'

const FakeOwnedNFTS: OwnedNFT[] = [
  {
    stakedAmount: 28000,
    startLockTime: new Date(),
    stakedPeriod: 10,
    delegate: '0x0000000000000000000000000000000000000000',
    nftSvg: bronsonSvg,
  },
  {
    stakedAmount: 28000,
    startLockTime: new Date(),
    stakedPeriod: 10,
    delegate: '0x0000000000000000000000000000000000000000',
    nftSvg: johnnySvg,
  },
  {
    stakedAmount: 28000,
    startLockTime: new Date(),
    stakedPeriod: 10,
    delegate: '0x0000000000000000000000000000000000000000',
    nftSvg: farceurSvg,
  },
]

const FakeTokenStatsData = {
  initialLocked: 0.0,
  totalStaked: 2668000000,
  userTotalLocked: 10159000,
  totalStakedPeriodInDays: 1600,
  delegates: [
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
  ],
}

const FakeStakingNFTs: StakingNFT[] = [
  {
    svg: nammuSvg,
    name: 'Nammu',
    votingPowerMin: 1,
    votingPowerMax: 99,
  },
  {
    svg: farceurSvg,
    name: 'Farceur',
    votingPowerMin: 100,
    votingPowerMax: 199,
  },
  {
    svg: bronsonSvg,
    name: 'Bronson',
    votingPowerMin: 200,
    votingPowerMax: 299,
  },
  {
    svg: johnnySvg,
    name: 'Johnny Utah',
    votingPowerMin: 300,
    votingPowerMax: 499,
  },
  {
    svg: nammuSvg,
    name: 'Nammu',
    votingPowerMin: 500,
    votingPowerMax: 999,
  },
  {
    svg: farceurSvg,
    name: 'Farceur',
    votingPowerMin: 1000,
    votingPowerMax: 1999,
  },
  {
    svg: bronsonSvg,
    name: 'Bronson',
    votingPowerMin: 2000,
    votingPowerMax: 4999,
  },
  {
    svg: johnnySvg,
    name: 'Johnny Utah',
    votingPowerMin: 5000,
  },
]

export default function StakeForNFTForm({
  onFinish,
  onClose,
}: {
  onFinish: VoidFunction
  onClose: VoidFunction
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tokensStaked, setTokensStaked] = useState(0)
  const [daysStaked, setDaysStaked] = useState(100)
  const [selectedDelgate, setSelectedDelgate] = useState('tankbottoms.eth')

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [delegatePickerModalVisible, setdelegatePickerModalVisible] =
    useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)

  const { tokenSymbol, projectMetadata, projectId } =
    useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)

  const projectName = projectMetadata?.name ?? 'Untitled Project'
  const stakingNFTs = FakeStakingNFTs
  const maxLockTime = 1000
  const totalBalanceInWad = parseInt(fromWad(totalBalance))
  const unstakedTokens = totalBalanceInWad
    ? totalBalanceInWad - tokensStaked
    : 0
  const votingPower = tokensStaked * (daysStaked / maxLockTime)

  const solveForTokensStaked = (votingPower: number) => {
    return Math.floor(votingPower / (daysStaked / maxLockTime))
  }

  const checkVotingPower = (newTokensStaked: number, newDaysStaked: number) => {
    const newVotingPower = newTokensStaked * (newDaysStaked / maxLockTime)
    const activeNFTIdx = stakingNFTs.findIndex(nft => {
      if (!nft.votingPowerMax && newVotingPower >= nft.votingPowerMin) {
        return true
      }
      if (
        nft.votingPowerMax &&
        newVotingPower >= nft.votingPowerMin &&
        newVotingPower < nft.votingPowerMax
      ) {
        return true
      }
      return false
    })
    if (activeNFTIdx !== -1) {
      setActiveIdx(activeNFTIdx)
    }
  }
  const handleTokensStakedChange = (value: number) => {
    const newTokensStaked = value
    setTokensStaked(newTokensStaked)
    checkVotingPower(newTokensStaked, daysStaked)
  }

  const handleDaysStakedChange = (value: number) => {
    const newDaysStaked = value
    setDaysStaked(newDaysStaked)
    checkVotingPower(tokensStaked, newDaysStaked)
  }

  const handleNextCarouselButtonClicked = () => {
    const newActiveIdx = Math.min(activeIdx + 1, stakingNFTs.length - 1)
    setActiveIdx(newActiveIdx)
    const neededTokens = solveForTokensStaked(
      stakingNFTs[newActiveIdx].votingPowerMin,
    )
    setTokensStaked(neededTokens)
  }

  const handlePrevCarouselButtonClicked = () => {
    const newActiveIdx = Math.max(activeIdx - 1, 0)
    setActiveIdx(newActiveIdx)
    const neededTokens = solveForTokensStaked(
      stakingNFTs[newActiveIdx].votingPowerMin,
    )
    setTokensStaked(neededTokens)
  }

  const handleDelegatePickerOk = (delegate?: NFTDelegate) => {
    if (delegate) {
      setSelectedDelgate(delegate.address)
    }
    setdelegatePickerModalVisible(false)
  }

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div>
      <Form layout="vertical" onFinish={() => {}}>
        <Space size="middle" direction="vertical">
          <h1>
            <Trans>Voting Power in {projectName}</Trans>
          </h1>
          <div style={{ color: colors.text.secondary }}>
            <p>
              <Trans>
                Stake Juicebox (${tokenSymbolText({ tokenSymbol })}) tokens for
                irrevocable durations (in days) in exchange for voting weight.
                In return, you will impact {projectName} governance and receive
                a choice anathropomorphic banana character NFT.
              </Trans>
            </p>
          </div>
          <Button block onClick={() => setTokenRangesModalVisible(true)}>
            <Trans>View All Token Ranges</Trans>
          </Button>
          <h4>
            <Trans>
              Voting weight is a function of Tokens multiplied by time remaining
              over max lock duration. The following equation determines how much
              voting weight you have. To learn more about the governance process
              at Juicebox visit <ExternalLink href={''}>here.</ExternalLink>
            </Trans>
          </h4>
        </Space>
        <Divider />
        <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
          <p>
            <Trans>
              Voting Power = Tokens * ( Lock Time Remaining / Max Lock Time )
            </Trans>
          </p>
        </div>
        <Row>
          <Space direction="horizontal">
            <Form.Item>
              <InputNumber
                value={votingPower}
                id="votingPower"
                disabled={true}
              ></InputNumber>
            </Form.Item>
            =
            <Form.Item>
              <InputNumber
                value={tokensStaked}
                id="tokensStaked"
                onChange={handleTokensStakedChange}
              ></InputNumber>
            </Form.Item>
            ${tokenSymbol} *
            <Form.Item>
              <Select value={daysStaked} onChange={handleDaysStakedChange}>
                <Select.Option value={10}>10 Days</Select.Option>
                <Select.Option value={50}>50 Days</Select.Option>
                <Select.Option value={100}>100 Days</Select.Option>
                <Select.Option value={500}>500 Days</Select.Option>
                <Select.Option value={1000}>1000 Days</Select.Option>
              </Select>
            </Form.Item>
            / {maxLockTime} days
          </Space>
        </Row>
        <StakingNFTCarousel
          activeIdx={activeIdx}
          stakingNFTs={FakeStakingNFTs}
        />
        <Row align="middle">
          <Col span={2}>0</Col>
          <Col span={20}>
            <Space direction="horizontal" size="middle" align="center">
              {stakingNFTs[activeIdx].votingPowerMin}
              <Button
                disabled={activeIdx === 0}
                onClick={handlePrevCarouselButtonClicked}
              >
                {'<'}
              </Button>
              X
              <Button
                disabled={activeIdx === stakingNFTs.length - 1}
                onClick={handleNextCarouselButtonClicked}
              >
                {'>'}
              </Button>
              {stakingNFTs[activeIdx].votingPowerMax
                ? stakingNFTs[activeIdx].votingPowerMax
                : '+'}
            </Space>
          </Col>
          <Col span={2}>3B</Col>
        </Row>
        <div style={{ color: colors.text.secondary }}>
          <p>
            Remaining: {unstakedTokens} {tokenSymbol}
          </p>
        </div>
        <Space size="middle" direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            style={{ whiteSpace: 'pre' }}
            onClick={() => setdelegatePickerModalVisible(true)}
          >
            Delegate:{' '}
            <span style={{ color: colors.text.primary }}>
              {selectedDelgate}
            </span>
          </Button>
          <Button
            block
            style={{ whiteSpace: 'pre' }}
            onClick={() => setConfirmStakeModalVisible(true)}
          >
            Stake{' '}
            <span style={{ color: colors.text.primary }}>{tokensStaked}</span>{' '}
            of ${tokenSymbol} Token for{' '}
            <span style={{ color: colors.text.primary }}>{daysStaked}</span>{' '}
            days
          </Button>
        </Space>
        <Divider />
        <OwnedNFTsSection
          ownedNFTs={FakeOwnedNFTS}
          tokenSymbol={tokenSymbol!}
        />
        <Divider />
        <StakedTokenStats
          {...FakeTokenStatsData}
          userTokenBalance={totalBalanceInWad}
          tokenSymbol={tokenSymbol!}
        />
        {unstakedTokens > 0 && (
          <h4>A remaining balance of non-staked tokens exist.</h4>
        )}
        <Form.Item>
          <Button onClick={onClose}>
            <Trans>Close</Trans>
          </Button>
        </Form.Item>
      </Form>
      <StakingTokenRangesModal
        visible={tokenRangesModalVisible}
        onCancel={() => setTokenRangesModalVisible(false)}
        stakingNFTs={stakingNFTs}
        tokenSymbol={tokenSymbol!}
      />
      <DelegatePickerModal
        visible={delegatePickerModalVisible}
        onCancel={() => setdelegatePickerModalVisible(false)}
        onOk={handleDelegatePickerOk}
      />
      <ConfirmStakeModal
        visible={confirmStakeModalVisible}
        tokenSymbol={tokenSymbol!}
        tokensStaked={tokensStaked}
        votingPower={votingPower}
        daysStaked={daysStaked}
        maxLockTime={maxLockTime}
        delegateAddress={selectedDelgate}
        nftSvg={stakingNFTs[activeIdx].svg}
        onCancel={() => setConfirmStakeModalVisible(false)}
        onOk={() => setConfirmStakeModalVisible(false)}
      />
    </div>
  )
}
