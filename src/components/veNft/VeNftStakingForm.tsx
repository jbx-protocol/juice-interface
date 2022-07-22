import { Trans } from '@lingui/macro'
import { Button, Col, Form, Row, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext, useMemo, useState, useEffect } from 'react'

import { useForm, useWatch } from 'antd/lib/form/Form'
import { BigNumber } from '@ethersproject/bignumber'
import { NetworkContext } from 'contexts/networkContext'
import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import TokensStakedInput from 'components/veNft/formControls/TokensStakedInput'

import LockDurationSelectInput from 'components/veNft/formControls/LockDurationSelectInput'
import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'
import StakingFormActionButton from 'components/veNft/formControls/StakingFormActionButton'
import VotingPowerDisplayInput from 'components/veNft/formControls/VotingPowerDisplayInput'
import VeNftCarousel from 'components/veNft/VeNftCarousel'
import StakingTokenRangesModal from 'components/veNft/veNftStakingTokenRangesModal'
import ConfirmStakeModal from 'components/veNft/VeNftConfirmStakeModal'

import Callout from 'components/Callout'

import { shadowCard } from 'constants/styles/shadowCard'

interface StakingFormProps {
  tokensStaked: string
  lockDuration: number
  beneficiary: string
}

interface VeNftStakingFormProps {
  tokenSymbolDisplayText: string
  lockDurationOptions: BigNumber[]
}

const VeNftStakingForm = ({
  lockDurationOptions,
  tokenSymbolDisplayText,
}: VeNftStakingFormProps) => {
  const { userAddress } = useContext(NetworkContext)
  const { tokenAddress } = useContext(V2ProjectContext)
  const { theme } = useContext(ThemeContext)

  const [form] = useForm<StakingFormProps>()

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)

  const tokensStaked = useWatch('tokensStaked', form) || '1'
  const lockDuration = useWatch('lockDuration', form) || 0
  const beneficiary = useWatch('beneficiary', form) || ''

  const lockDurationOptionsInSeconds = useMemo(() => {
    return lockDurationOptions
      ? lockDurationOptions.map((option: BigNumber) => {
          return option.toNumber()
        })
      : []
  }, [lockDurationOptions])

  const maxLockDuration =
    lockDurationOptionsInSeconds.length > 0
      ? lockDurationOptionsInSeconds[lockDurationOptionsInSeconds.length - 1]
      : 0

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)

  const minTokensAllowedToStake = 1 //TODO: get this from the contract
  const hasAdequateApproval = true //TODO: get this from the contract

  const votingPower = parseInt(tokensStaked) * (lockDuration / maxLockDuration)

  const handleReviewButtonClick = async () => {
    await form.validateFields()
    // refetch()
    setConfirmStakeModalVisible(true)
  }

  useEffect(() => {
    lockDurationOptionsInSeconds.length > 0 &&
      form.setFieldsValue({ lockDuration: lockDurationOptionsInSeconds[0] })
  }, [lockDurationOptionsInSeconds, form])

  const initialValues: StakingFormProps = {
    tokensStaked: minTokensAllowedToStake.toString(),
    lockDuration: 0,
    beneficiary: '',
  }

  return (
    <>
      <Form
        layout="vertical"
        style={{ width: '100%' }}
        form={form}
        initialValues={initialValues}
      >
        <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
          <Space size="middle" direction="vertical">
            <Callout>
              <Trans>
                Only project tokens claimed as ERC-20 tokens can be staked for
                NFTs.
              </Trans>
            </Callout>
          </Space>
          <TokensStakedInput
            form={form}
            claimedBalance={claimedBalance}
            tokenSymbolDisplayText={tokenSymbolDisplayText}
            tokensStaked={tokensStaked}
            minTokensAllowedToStake={minTokensAllowedToStake}
          />
          <Row>
            <Col span={14}>
              <LockDurationSelectInput
                form={form}
                lockDurationOptionsInSeconds={lockDurationOptionsInSeconds}
              />
            </Col>
            <Col span={4}>
              <p style={{ textAlign: 'center' }}>=</p>
            </Col>
            <Col span={6}>
              <VotingPowerDisplayInput votingPower={votingPower} />
            </Col>
          </Row>
          <CustomBeneficiaryInput form={form} />
          <VeNftCarousel />
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            <Button block onClick={() => setTokenRangesModalVisible(true)}>
              <Trans>View Token Ranges</Trans>
            </Button>
            <StakingFormActionButton
              hasAdequateApproval={hasAdequateApproval}
              onReviewButtonClick={handleReviewButtonClick}
            />
          </Space>
        </div>
      </Form>
      <StakingTokenRangesModal
        visible={tokenRangesModalVisible}
        onCancel={() => setTokenRangesModalVisible(false)}
      />
      <ConfirmStakeModal
        visible={confirmStakeModalVisible}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        tokensStaked={parseInt(tokensStaked)}
        lockDuration={lockDuration}
        beneficiary={beneficiary}
        votingPower={votingPower}
        onCancel={() => setConfirmStakeModalVisible(false)}
        onCompleted={() => setConfirmStakeModalVisible(false)}
      />
    </>
  )
}

export default VeNftStakingForm
