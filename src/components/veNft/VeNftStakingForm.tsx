import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Form, Row, Space } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import { useContext, useEffect, useMemo, useState } from 'react'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useERC20Allowance from 'hooks/ERC20Allowance'
import useERC20BalanceOf from 'hooks/ERC20BalanceOf'
import useERC20Approve from 'hooks/veNft/transactor/ERC20ApproveTx'
import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'
import LockDurationSelectInput from 'components/veNft/formControls/LockDurationSelectInput'
import StakingFormActionButton from 'components/veNft/formControls/StakingFormActionButton'
import TokensStakedInput from 'components/veNft/formControls/TokensStakedInput'
import VotingPowerDisplayInput from 'components/veNft/formControls/VotingPowerDisplayInput'
import VeNftCarousel from 'components/veNft/VeNftCarousel'
import ConfirmStakeModal from 'components/veNft/VeNftConfirmStakeModal'
import StakingTokenRangesModal from 'components/veNft/VeNftStakingTokenRangesModal'
import { useWallet } from 'hooks/Wallet'
import { parseWad } from 'utils/format/formatNumber'
import { reloadWindow } from 'utils/windowUtils'
import { emitSuccessNotification } from 'utils/notifications'
import { useVeNftTokenMetadata } from 'hooks/veNft/VeNftTokenMetadata'
import { useVeNftResolverTokenUri } from 'hooks/veNft/VeNftResolverTokenUri'
import { VeNftContext } from 'contexts/veNftContext'
import useUserUnclaimedTokenBalance from 'hooks/v2v3/contractReader/UserUnclaimedTokenBalance'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { VARIANTS_HASH } from 'constants/veNft/veNftProject'
import { useVeNftHasProjectTokenPermission } from 'hooks/veNft/VeNftHasProjectTokenPermission'
import { useVeNftLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useVeNftVariants } from 'hooks/veNft/VeNftVariants'
import AllowPublicExtensionInput from './formControls/AllowPublicExtensionInput'
import VeNftTokenSelectInput from './formControls/VeNftTokenSelectInput'

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
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  useWallet()
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { contractAddress } = useContext(VeNftContext)
  const { data: variants } = useVeNftVariants()
  const { data: lockDurationOptions } = useVeNftLockDurationOptions()

  const [form] = useForm<StakingFormProps>()

  const [tokenRangesModalVisible, setTokenRangesModalVisible] = useState(false)
  const [confirmStakeModalVisible, setConfirmStakeModalVisible] =
    useState(false)
  const [tokenApprovalLoading, setTokenApprovalLoading] = useState(false)

  const tokensStaked = useWatch('tokensStaked', form) || 1
  const lockDuration = useWatch('lockDuration', form) || 0
  const beneficiary = useWatch('beneficiary', form) || ''

  const { data: nftTokenUri } = useVeNftResolverTokenUri(
    parseWad(tokensStaked),
    lockDuration,
    lockDurationOptions,
  )
  const { data: tokenMetadata, refetch } = useVeNftTokenMetadata(nftTokenUri)
  const { data: hasUnclaimedTokensPermission } =
    useVeNftHasProjectTokenPermission()

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

  const minTokensAllowedToStake = 1 //TODO: get this from the contract

  const { data: allowance } = useERC20Allowance(
    tokenAddress,
    userAddress,
    contractAddress,
  )
  const hasAdequateApproval = allowance
    ? allowance.gte(parseWad(tokensStaked))
    : false

  const useJbToken = useWatch('useJbToken', form) || false
  const tokenBalance = useJbToken ? claimedBalance : unclaimedBalance

  const cannotSpendProjectToken = !hasUnclaimedTokensPermission && !useJbToken
  const cannotSpendProjectErc20Token = !hasAdequateApproval && useJbToken
  const hasWarning = cannotSpendProjectToken || cannotSpendProjectErc20Token

  const votingPower = tokensStaked * (lockDuration / maxLockDuration)

  const approveTx = useERC20Approve(tokenAddress)
  const approve = async () => {
    if (!contractAddress) {
      return
    }
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
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
        className="w-full"
        form={form}
        initialValues={initialValues}
      >
        <div className="rounded-sm bg-smoke-75 stroke-none p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]">
          <Space direction="vertical" size={'large'} className="w-full">
            <VeNftTokenSelectInput form={form} />
            {cannotSpendProjectToken && (
              <p>
                <Trans>
                  The veNFT contract is currently unable to lock project token.
                  Contact the project owner regarding adding this permission.
                </Trans>
              </p>
            )}
            {cannotSpendProjectErc20Token && (
              <>
                <p>
                  <Trans>
                    Before locking your project ERC-20 token, you must approve
                    the veNFT contract for spending.
                  </Trans>
                </p>
                <StakingFormActionButton
                  useJbToken={useJbToken}
                  hasAdequateApproval={hasAdequateApproval}
                  onReviewButtonClick={handleReviewButtonClick}
                  onApproveButtonClick={approve}
                  tokenApprovalLoading={tokenApprovalLoading}
                />
              </>
            )}
            {!hasWarning && (
              <>
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
                        lockDurationOptionsInSeconds={
                          lockDurationOptionsInSeconds
                        }
                      />
                    </Col>
                  </Row>

                  <VotingPowerDisplayInput votingPower={votingPower} />
                </div>

                <MinimalCollapse
                  header={
                    <h3 className="m-0">
                      <Trans>Advanced Options</Trans>
                    </h3>
                  }
                >
                  <CustomBeneficiaryInput
                    form={form}
                    labelText={t`Mint NFT to a custom address`}
                  />
                  <AllowPublicExtensionInput form={form} />
                </MinimalCollapse>

                {variants && (
                  <VeNftCarousel
                    tokensStaked={tokensStaked}
                    baseImagesHash={VARIANTS_HASH}
                    variants={variants}
                    form={form}
                    tokenMetadata={tokenMetadata}
                  />
                )}

                <Space size="middle" direction="vertical" className="w-full">
                  <Button
                    block
                    onClick={() => setTokenRangesModalVisible(true)}
                  >
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
              </>
            )}
          </Space>
        </div>
      </Form>
      <StakingTokenRangesModal
        open={tokenRangesModalVisible}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        onCancel={() => setTokenRangesModalVisible(false)}
      />
      <ConfirmStakeModal
        open={confirmStakeModalVisible}
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
