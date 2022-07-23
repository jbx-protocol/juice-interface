import { t, Trans } from '@lingui/macro'
import { Button, Col, Form, Row, Space } from 'antd'
import { MaxUint256 } from '@ethersproject/constants'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useMemo, useState, useEffect } from 'react'
import { useForm, useWatch } from 'antd/lib/form/Form'
import { BigNumber } from '@ethersproject/bignumber'

import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'
import useERC20Approve from 'hooks/veNft/transactor/ERC20ApproveTx'
import useERC20Allowance from 'hooks/ERC20Allowance'

import TokensStakedInput from 'components/veNft/formControls/TokensStakedInput'
import LockDurationSelectInput from 'components/veNft/formControls/LockDurationSelectInput'
import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'
import StakingFormActionButton from 'components/veNft/formControls/StakingFormActionButton'
import VotingPowerDisplayInput from 'components/veNft/formControls/VotingPowerDisplayInput'
import VeNftCarousel from 'components/veNft/VeNftCarousel'
import StakingTokenRangesModal from 'components/veNft/VeNftStakingTokenRangesModal'
import ConfirmStakeModal from 'components/veNft/VeNftConfirmStakeModal'
import Callout from 'components/Callout'

import { reloadWindow } from 'utils/windowUtils'
import { parseWad } from 'utils/formatNumber'

import { emitSuccessNotification } from 'utils/notifications'

import { shadowCard } from 'constants/styles/shadowCard'
import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

interface StakingFormProps {
  tokensStaked: string
  lockDuration: number
  beneficiary: string
}

interface VeNftStakingFormProps {
  tokenSymbolDisplayText: string
}

const VeNftStakingForm = ({
  tokenSymbolDisplayText,
}: VeNftStakingFormProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const {
    tokenAddress,
    veNft: { lockDurationOptions },
  } = useContext(V2ProjectContext)
  const { theme } = useContext(ThemeContext)

  const [form] = useForm<StakingFormProps>()

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)
  const [tokenApprovalLoading, setTokenApprovalLoading] = useState(false)

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

  const { data: allowance } = useERC20Allowance(
    tokenAddress,
    userAddress,
    VENFT_CONTRACT_ADDRESS,
  )
  const hasAdequateApproval = allowance
    ? allowance.gte(parseWad(tokensStaked))
    : false

  const votingPower = parseInt(tokensStaked) * (lockDuration / maxLockDuration)

  const approveTx = useERC20Approve(tokenAddress)
  const approve = async () => {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    setTokenApprovalLoading(true)

    const txSuccess = await approveTx(
      {
        spender: VENFT_CONTRACT_ADDRESS,
        amount: MaxUint256,
      },
      {
        onConfirmed() {
          setTokenApprovalLoading(false)
          emitSuccessNotification(t`Successfully approved ERC-20 spending.`)
          reloadWindow()
        },
      },
    )

    if (!txSuccess) {
      setTokenApprovalLoading(false)
    }
  }

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
              tokenApprovalLoading={tokenApprovalLoading}
              onApproveButtonClick={approve}
              onReviewButtonClick={handleReviewButtonClick}
            />
          </Space>
        </div>
      </Form>
      <StakingTokenRangesModal
        visible={tokenRangesModalVisible}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
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
