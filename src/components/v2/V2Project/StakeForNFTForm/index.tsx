import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Col, Row, Select, Input } from 'antd'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'

import { StakingNFT } from 'models/v2/stakingNFT'

import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'

import { NetworkContext } from 'contexts/networkContext'

import { fromWad } from 'utils/formatNumber'

import { NFTDelegate } from 'models/v2/nftDelegate'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { OwnedNFT } from './OwnedNFTSection'
import OwnedNFTsSection from './OwnedNFTSection'

import nammuSvg from './SVGs/01.svg'
import farceurSvg from './SVGs/02.svg'
import bronsonSvg from './SVGs/03.svg'
import johnnySvg from './SVGs/04.svg'

import StakingTokenRangesModal from './StakingTokenRangesModal'
import DelegatePickerModal from './DelegatePickerModal'
import StakedTokenStatsSection from './StakedTokenStatsSection'

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

export type LockDurations = [10, 50, 100, 500, 1000]

export default function StakeForNFTForm({
  onFinish,
  onClose,
}: {
  onFinish: VoidFunction
  onClose: VoidFunction
}) {
  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [delegatePickerModalVisible, setdelegatePickerModalVisible] =
    useState(false)

  // const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
  //   useState(false)

  const [tokensStaked, setTokensStaked] = useState('0')
  const [lockDuration, setLockDuration] = useState(10)
  const [delegate, setDelegate] = useState<string | undefined>(
    'tankbottoms.eth',
  )

  const { tokenSymbol, tokenName, projectMetadata, projectId } =
    useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)

  const projectName = projectMetadata?.name ?? 'Untitled Project'
  const stakingNFTs = FakeStakingNFTs
  const maxLockDuration = 1000
  const totalBalanceInWad = parseInt(fromWad(totalBalance))
  const unstakedTokens = totalBalance
    ? totalBalanceInWad - parseInt(tokensStaked)
    : 0
  const votingPower = parseInt(tokensStaked) * (lockDuration / maxLockDuration)

  const handleDelegatePickerOk = (delegate?: NFTDelegate) => {
    if (delegate) {
      setDelegate(delegate.address)
    }
    setdelegatePickerModalVisible(false)
  }

  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
            Voting weight is a function of how many $
            {tokenSymbolText({ tokenSymbol })} you have locked for how long
            intitially divided by how much time left in that lock period.
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
              <Select.Option value={10}>10 Days</Select.Option>
              <Select.Option value={50}>50 Days</Select.Option>
              <Select.Option value={100}>100 Days</Select.Option>
              <Select.Option value={500}>500 Days</Select.Option>
              <Select.Option value={1000}>1000 Days</Select.Option>
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
                <Trans>Days Locked</Trans>
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

      {/* <Row>
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
            / {maxLockDuration} days
          </Space>
        </Row> */}
      {/* <StakingNFTCarousel
          activeIdx={activeIdx}
          stakingNFTs={FakeStakingNFTs}
        /> */}
      {/* <Row align="middle">
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
        </Row> */}
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={() => setdelegatePickerModalVisible(true)}
        >
          Delegate:{' '}
          <span style={{ color: colors.text.primary }}>{delegate}</span>
        </Button>
        <Button block style={{ whiteSpace: 'pre' }} onClick={() => {}}>
          IRREVOCABLY STAKE{' '}
          <span style={{ color: colors.text.primary }}>[{tokensStaked}]</span> $
          {tokenSymbol} for{' '}
          <span style={{ color: colors.text.primary }}>[{lockDuration}]</span>{' '}
          days
        </Button>
      </Space>
      <Divider />
      <OwnedNFTsSection ownedNFTs={FakeOwnedNFTS} tokenSymbol={tokenSymbol!} />
      <StakedTokenStatsSection
        {...FakeTokenStatsData}
        userTokenBalance={totalBalanceInWad}
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
        stakingNFTs={stakingNFTs}
        tokenSymbol={tokenSymbol!}
      />
      <DelegatePickerModal
        visible={delegatePickerModalVisible}
        onCancel={() => setdelegatePickerModalVisible(false)}
        onOk={handleDelegatePickerOk}
      />
      {/* <ConfirmStakeModal
        visible={confirmStakeModalVisible}
        tokenSymbol={tokenSymbol!}
        tokensStaked={parseInt(tokensStaked)}
        votingPower={votingPower}
        daysStaked={lockDuration}
        maxLockDuration={maxLockDuration}
        delegateAddress={delegate}
        nftSvg={stakingNFTs[activeIdx].svg}
        onCancel={() => setConfirmStakeModalVisible(false)}
        onOk={() => setConfirmStakeModalVisible(false)}
      /> */}
    </Form>
  )
}
