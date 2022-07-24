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
import VeNftCarousel from 'components/veNft/veNftCarousel'
import StakingTokenRangesModal from 'components/veNft/veNftStakingTokenRangesModal'
import ConfirmStakeModal from 'components/veNft/veNftConfirmStakeModal'

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
        <div style={{ ...shadowCard(theme), padding: 25 }}>
          <Space direction="vertical" size={'large'} style={{ width: '100%' }}>
            <div>
              <Row gutter={20}>
                <Col span={14}>
                  <TokensStakedInput
                    form={form}
                    claimedBalance={claimedBalance}
                    tokenSymbolDisplayText={tokenSymbolDisplayText}
                    tokensStaked={tokensStaked}
                    minTokensAllowedToStake={minTokensAllowedToStake}
                  />
                </Col>
                <Col span={10}>
                  <LockDurationSelectInput
                    form={form}
                    lockDurationOptionsInSeconds={lockDurationOptionsInSeconds}
                  />
                </Col>
              </Row>

              <VotingPowerDisplayInput votingPower={votingPower} />
            </div>

            <CustomBeneficiaryInput form={form} />

            <VeNftCarousel />

            <Space size="middle" direction="vertical" style={{ width: '100%' }}>
              <Button block onClick={() => setTokenRangesModalVisible(true)}>
                <Trans>View token ranges</Trans>
              </Button>
              <StakingFormActionButton
                hasAdequateApproval={hasAdequateApproval}
                onReviewButtonClick={handleReviewButtonClick}
              />
            </Space>
          </Space>
        </div>
      </Form>
      <StakingTokenRangesModal
        visible={tokenRangesModalVisible}
        onCancel={() => setTokenRangesModalVisible(false)}
      />
      <ConfirmStakeModal
        visible={confirmStakeModalVisible}
        onCancel={() => setConfirmStakeModalVisible(false)}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
    </>
  )
}

export default VeNftStakingForm
