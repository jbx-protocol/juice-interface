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

import { reloadWindow } from 'utils/windowUtils'
import { parseWad } from 'utils/formatNumber'

import { emitSuccessNotification } from 'utils/notifications'

import { useVeNftTokenMetadata } from 'hooks/veNft/VeNftTokenMetadata'

import { useVeNftResolverTokenUri } from 'hooks/veNft/VeNftResolverTokenUri'

import Callout from 'components/Callout'
import { VeNftContext } from 'contexts/v2/veNftContext'

import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'

import { MinimalCollapse } from 'components/MinimalCollapse'

import { shadowCard } from 'constants/styles/shadowCard'
import VeNftTokenSelectInput from './formControls/VeNftTokenSelectInput'
import AllowPublicExtensionInput from './formControls/AllowPublicExtensionInput'

export interface StakingFormProps {
  tokensStaked: number
  lockDuration: number
  beneficiary: string
  useJbToken: boolean
  allowPublicExtension: boolean
}

interface VeNftStakingFormProps {
  tokenSymbolDisplayText: string
}

const VeNftStakingForm = ({
  tokenSymbolDisplayText,
}: VeNftStakingFormProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenAddress } = useContext(V2ProjectContext)
  const { lockDurationOptions, contractAddress, baseImagesHash, variants } =
    useContext(VeNftContext)
  const { theme } = useContext(ThemeContext)

  const [form] = useForm<StakingFormProps>()

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)
  const [tokenApprovalLoading, setTokenApprovalLoading] = useState(false)

  const tokensStaked = useWatch('tokensStaked', form) || 1
  const lockDuration = useWatch('lockDuration', form) || 0
  const beneficiary = useWatch('beneficiary', form) || ''
  const useJbToken = useWatch('useJbToken', form) || false

  const { data: nftTokenUri } = useVeNftResolverTokenUri(
    parseWad(tokensStaked),
    lockDuration,
    lockDurationOptions,
  )
  const { data: tokenMetadata, refetch } = useVeNftTokenMetadata(nftTokenUri)

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
  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()
  const tokenBalance = useJbToken ? claimedBalance : unclaimedBalance

  const minTokensAllowedToStake = 1 //TODO: get this from the contract

  const { data: allowance } = useERC20Allowance(
    tokenAddress,
    userAddress,
    contractAddress,
  )
  const hasAdequateApproval = allowance
    ? allowance.gte(parseWad(tokensStaked))
    : false

  const votingPower = tokensStaked * (lockDuration / maxLockDuration)

  const approveTx = useERC20Approve(tokenAddress)
  const approve = async () => {
    if (!contractAddress) {
      return
    }

    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    setTokenApprovalLoading(true)

    const txSuccess = await approveTx(
      {
        spender: contractAddress,
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
    refetch()
    setConfirmStakeModalVisible(true)
  }

  useEffect(() => {
    lockDurationOptionsInSeconds.length > 0 &&
      form.setFieldsValue({ lockDuration: lockDurationOptionsInSeconds[0] })
  }, [lockDurationOptionsInSeconds, form])

  const initialValues: StakingFormProps = {
    tokensStaked: minTokensAllowedToStake,
    lockDuration: 0,
    beneficiary: '',
    useJbToken: false,
    allowPublicExtension: false,
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
            <Callout style={{ background: theme.colors.background.l1 }}>
              <Trans>
                Only project tokens claimed as ERC-20 tokens can be staked for
                NFTs.
              </Trans>
            </Callout>
            <VeNftTokenSelectInput form={form} />
            <div>
              <Row gutter={20}>
                <Col span={14}>
                  <TokensStakedInput
                    form={form}
                    tokenBalance={tokenBalance}
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

            <MinimalCollapse
              header={
                <h3 style={{ margin: 0 }}>
                  <Trans>Advanced Options</Trans>
                </h3>
              }
            >
              <CustomBeneficiaryInput form={form} />
              <AllowPublicExtensionInput form={form} />
            </MinimalCollapse>

            {variants && baseImagesHash && (
              <VeNftCarousel
                tokensStaked={tokensStaked}
                baseImagesHash={baseImagesHash}
                variants={variants}
                form={form}
                tokenMetadata={tokenMetadata}
              />
            )}

            <Space size="middle" direction="vertical" style={{ width: '100%' }}>
              <Button block onClick={() => setTokenRangesModalVisible(true)}>
                <Trans>View token ranges</Trans>
              </Button>
              <StakingFormActionButton
                useJbToken={useJbToken}
                hasAdequateApproval={hasAdequateApproval}
                onReviewButtonClick={handleReviewButtonClick}
                onApproveButtonClick={approve}
                tokenApprovalLoading={tokenApprovalLoading}
              />
            </Space>
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
        tokensStaked={tokensStaked}
        lockDuration={lockDuration}
        beneficiary={beneficiary}
        useJbToken={form.getFieldValue('useJbToken')}
        allowPublicExtension={form.getFieldValue('allowPublicExtension')}
        votingPower={votingPower}
        tokenMetadata={tokenMetadata}
        onCancel={() => setConfirmStakeModalVisible(false)}
        onCompleted={() => setConfirmStakeModalVisible(false)}
      />
    </>
  )
}

export default VeNftStakingForm
