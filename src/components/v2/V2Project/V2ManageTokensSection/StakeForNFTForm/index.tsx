import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, InputNumber, Col, Row } from 'antd'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'

import { StakingNFT } from 'models/v2/stakingNFT'

import StakedTokenStats from './StakedTokenStatsSection'
import { OwnedNFT } from './OwnedNFTSection'
import OwnedNFTsSection from './OwnedNFTSection'
import StakingNFTCarousel from './StakingNFTCarousel'

import nammuSvg from './SVGs/01.svg'
import farceurSvg from './SVGs/02.svg'
import bronsonSvg from './SVGs/03.svg'
import johnnySvg from './SVGs/04.svg'

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
  userTokenBalance: 21159000,
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
    tokenMin: 1,
    tokenMax: 99,
  },
  {
    svg: farceurSvg,
    name: 'Farceur',
    tokenMin: 100,
    tokenMax: 199,
  },
  {
    svg: bronsonSvg,
    name: 'Bronson',
    tokenMin: 200,
    tokenMax: 299,
  },
  {
    svg: johnnySvg,
    name: 'Johnny Utah',
    tokenMin: 300,
  },
]

const fakeRemainingToken = 574895789347589

export default function StakeForNFTForm({
  onFinish,
  onClose,
}: {
  onFinish: VoidFunction
  onClose: VoidFunction
}) {
  const { tokenSymbol, projectMetadata } = useContext(V2ProjectContext)
  const projectName = projectMetadata?.name ?? 'Untitled Project'
  const [activeIdx, setActiveIdx] = useState(0)
  const stakingNFTs = FakeStakingNFTs
  const [tokensStaked, setTokensStaked] = useState(0)
  const [votingPower, setVotingPower] = useState(0)
  const daysStaked = 100
  const maxLockTime = 1000
  const unstakedTokens = fakeRemainingToken - tokensStaked

  const votingPowerFormula = (tokensStaked: number) => {
    return tokensStaked * (daysStaked / maxLockTime)
  }

  const tokensStakedFormula = (votingPower: number) => {
    return votingPower / (daysStaked / maxLockTime)
  }

  const handleTokensStakedChange = (value: number) => {
    const newTokensStaked = value
    setTokensStaked(newTokensStaked)
    setVotingPower(votingPowerFormula(newTokensStaked))
    const activeNFTIdx = stakingNFTs.findIndex(nft => {
      if (!nft.tokenMax && newTokensStaked >= nft.tokenMin) {
        return true
      }
      if (
        nft.tokenMax &&
        newTokensStaked >= nft.tokenMin &&
        newTokensStaked < nft.tokenMax
      ) {
        return true
      }
      return false
    })
    if (activeNFTIdx !== -1) {
      setActiveIdx(activeNFTIdx)
    }
  }

  const handleVotingPowerChange = (value: number) => {
    const newVotingPower = value
    setVotingPower(newVotingPower)
    const newTokensStaked = tokensStakedFormula(newVotingPower)
    setTokensStaked(newTokensStaked)
    const activeNFTIdx = stakingNFTs.findIndex(
      nft => nft.tokenMin <= newTokensStaked,
    )
    if (activeNFTIdx !== -1) {
      setActiveIdx(activeNFTIdx)
    }
  }

  const handleNextCarouselButtonClicked = () => {
    const newActiveIdx = Math.min(activeIdx + 1, stakingNFTs.length - 1)
    setActiveIdx(newActiveIdx)
    setTokensStaked(stakingNFTs[newActiveIdx].tokenMin)
    setVotingPower(votingPowerFormula(stakingNFTs[newActiveIdx].tokenMin))
  }

  const handlePrevCarouselButtonClicked = () => {
    const newActiveIdx = Math.max(activeIdx - 1, 0)
    setActiveIdx(newActiveIdx)
    setTokensStaked(stakingNFTs[newActiveIdx].tokenMin)
    setVotingPower(votingPowerFormula(stakingNFTs[newActiveIdx].tokenMin))
  }

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Form layout="vertical" onFinish={() => {}}>
      <Space size="middle" direction="vertical">
        <h1>
          <Trans>Voting Power in {projectName}</Trans>
        </h1>
        <div style={{ color: colors.text.secondary }}>
          <p>
            <Trans>
              Stake Juicebox (${tokenSymbolText({ tokenSymbol })}) tokens for
              irrevocable durations (in days) in exchange for voting weight. In
              return, you will impact {projectName} governance and receive a
              choice anathropomorphic banana character NFT.
            </Trans>
          </p>
        </div>
        <Button block>
          <Trans>View All Token Ranges</Trans>
        </Button>
        <h4>
          <Trans>
            Voting weight is a function of Tokens multiplied by time remaining
            over max lock duration. The following equation determines how much
            voting weight you have. To learn more about the governance process
            at Juicebox visit here.
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
              onChange={handleVotingPowerChange}
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
            <InputNumber disabled={true} value={daysStaked}></InputNumber>
          </Form.Item>
          / {maxLockTime} days
        </Space>
      </Row>
      <StakingNFTCarousel activeIdx={activeIdx} stakingNFTs={FakeStakingNFTs} />
      <Row align="middle">
        <Col span={2}>0</Col>
        <Col span={20}>
          <Space direction="horizontal" size="middle" align="center">
            {stakingNFTs[activeIdx].tokenMin}
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
            {stakingNFTs[activeIdx].tokenMax
              ? stakingNFTs[activeIdx].tokenMax
              : '+'}
          </Space>
        </Col>
        <Col span={2}>3B</Col>
      </Row>
      <div style={{ color: colors.text.secondary }}>
        <p>
          Remaining: {fakeRemainingToken - tokensStaked} {tokenSymbol}
        </p>
      </div>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Button block style={{ whiteSpace: 'pre' }}>
          Delegate:{' '}
          <span style={{ color: colors.text.primary }}>tankbottoms.eth</span>
        </Button>
        <Button block style={{ whiteSpace: 'pre' }}>
          Stake{' '}
          <span style={{ color: colors.text.primary }}>{tokensStaked}</span> of
          ${tokenSymbol} Token for{' '}
          <span style={{ color: colors.text.primary }}>{daysStaked}</span> days
        </Button>
      </Space>

      <Divider />
      <OwnedNFTsSection ownedNFTs={FakeOwnedNFTS} tokenSymbol={tokenSymbol!} />
      <Divider />
      <StakedTokenStats {...FakeTokenStatsData} tokenSymbol={tokenSymbol!} />
      {unstakedTokens > 0 && (
        <h4>
          A remaining balance of non-staked tokens exist. You have enough tokens
          to stake and receive a veBatman.
        </h4>
      )}
      <Space>
        <Form.Item>
          <Button>
            <Trans>Preview</Trans>
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onClose}>
            <Trans>Close</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
