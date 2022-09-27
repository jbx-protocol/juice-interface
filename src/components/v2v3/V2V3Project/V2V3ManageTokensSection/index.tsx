import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import SectionHeader from 'components/SectionHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useERC20BalanceOf from 'hooks/ERC20BalanceOf'
import { useWallet } from 'hooks/Wallet'

import FormattedAddress from 'components/FormattedAddress'
import { CSSProperties, useContext, useState } from 'react'
import {
  formatPercent,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/format/formatNumber'

import { IssueErc20TokenButton } from 'components/IssueErc20TokenButton'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'

import ManageTokensModal from 'components/ManageTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import { TextButton } from 'components/TextButton'
import { ThemeContext } from 'contexts/themeContext'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import useUserUnclaimedTokenBalance from 'hooks/v2v3/contractReader/UserUnclaimedTokenBalance'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/TransferUnclaimedTokensTx'

import { tokenSymbolText } from 'utils/tokenSymbolText'

import TooltipIcon from 'components/TooltipIcon'
import { default as useV1HandleForProjectId } from 'hooks/v1/contractReader/HandleForProjectId'
import { useV1ProjectIdOfV2Project } from 'hooks/v2v3/contractReader/V1ProjectIdOfV2Project'
import { useHasV1TokenPaymentTerminal } from 'hooks/v2v3/hasV1TokenPaymentTerminal'
import { featureFlagEnabled } from 'utils/featureFlags'
import { reloadWindow } from 'utils/windowUtils'

import { TransferUnclaimedTokensModal } from 'components/modals/TransferUnclaimedTokensModal'
import RichButton from 'components/RichButton'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { VeNftContext } from 'contexts/veNftContext'
import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'
import Link from 'next/link'
import { veNftPagePath } from 'utils/routes'
import { V1ProjectTokensSection } from './V1ProjectTokensSection/V1ProjectTokensSection'
import V2ClaimTokensModal from './V2ClaimTokensModal'
import V2MintModal from './V2MintModal'
import V2RedeemModal from './V2RedeemModal'

const labelStyle: CSSProperties = {
  width: '10.5rem',
}
const manageTokensRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  justifyContent: 'space-between',
  width: '100%',
}

export default function V2ManageTokensSection() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    totalTokenSupply,
    fundingCycleMetadata,
    primaryTerminalCurrentOverflow,
    handle,
  } = useContext(V2V3ProjectContext)
  const { contractAddress: veNftAddress } = useContext(VeNftContext)
  const { projectMetadata, projectId, cv } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()
  const { totalLocked } = useVeNftSummaryStats()
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const { data: v1ProjectId } = useV1ProjectIdOfV2Project(projectId)
  const hasV1TokenPaymentTerminal = useHasV1TokenPaymentTerminal()
  const v1ProjectHandle = useV1HandleForProjectId(v1ProjectId)
  const hasV1ProjectId = Boolean(v1ProjectId?.toNumber() ?? 0 > 0)
  const v1TokenSwapEnabled = featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)

  const totalBalanceWithLock = parseInt(fromWad(totalBalance)) + totalLocked

  // %age of tokens the user owns.
  const userOwnershipPercentage =
    formatPercent(parseWad(totalBalanceWithLock), totalTokenSupply) || '0'
  const claimedBalanceFormatted = formatWad(claimedBalance ?? 0, {
    precision: 0,
  })
  const unclaimedBalanceFormatted = formatWad(unclaimedBalance ?? 0, {
    precision: 0,
  })

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))
  const redeemDisabled = Boolean(
    !hasOverflow || fundingCycleMetadata?.redemptionRate.eq(0),
  )

  const hasIssuedERC20 = tokenAddress !== constants.AddressZero
  const hasIssueTicketsPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.ISSUE,
  )
  const showIssueErc20TokenButton =
    !hasIssuedERC20 && hasIssueTicketsPermission && !isPreviewMode
  const showV1ProjectTokensSection =
    v1TokenSwapEnabled && hasV1ProjectId && hasV1TokenPaymentTerminal

  const userHasMintPermission = Boolean(
    useV2ConnectedWalletHasPermission(V2OperatorPermission.MINT),
  )
  const projectAllowsMint = Boolean(fundingCycleMetadata?.allowMinting)
  const veNftEnabled = Boolean(
    featureFlagEnabled(FEATURE_FLAGS.VENFT) && veNftAddress,
  )

  return (
    <>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <SectionHeader
                text={<Trans>Tokens</Trans>}
                tip={
                  <Trans>
                    {tokenSymbolText({
                      tokenSymbol,
                      capitalize: true,
                      plural: true,
                      includeTokenWord: true,
                    })}{' '}
                    are distributed to anyone who pays this project. If the
                    project has set a distribution limit, tokens can be redeemed
                    for a portion of the project's overflow whether or not they
                    have been claimed yet.
                  </Trans>
                }
              />
              {showIssueErc20TokenButton && (
                <div style={{ marginBottom: 20 }}>
                  <IssueErc20TokenButton onCompleted={reloadWindow} />
                </div>
              )}
            </div>
          }
          valueRender={() => (
            <Descriptions layout="horizontal" column={1}>
              {hasIssuedERC20 && tokenSymbol && (
                <Descriptions.Item
                  label={t`Project token`}
                  labelStyle={labelStyle}
                >
                  <div style={manageTokensRowStyle}>
                    <div>
                      {tokenSymbol} (
                      <FormattedAddress address={tokenAddress} />)
                    </div>
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item
                label={t`Total supply`}
                labelStyle={labelStyle}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    width: '100%',
                    gap: 5,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div>
                      {formatWad(totalTokenSupply, { precision: 0 })}{' '}
                      {tokenText}
                    </div>
                    <TextButton
                      onClick={() => setParticipantsModalVisible(true)}
                    >
                      <Trans>Holders</Trans>
                    </TextButton>
                  </div>
                </div>
              </Descriptions.Item>
              {userAddress ? (
                <>
                  <Descriptions.Item
                    label={t`Your balance`}
                    labelStyle={labelStyle}
                  >
                    <div style={manageTokensRowStyle}>
                      <div>
                        {hasIssuedERC20 && (
                          <div>
                            {claimedBalanceFormatted} {tokenText}
                          </div>
                        )}
                        <div>
                          {hasIssuedERC20 ? (
                            <Trans>
                              {unclaimedBalanceFormatted} {tokenText} claimable
                            </Trans>
                          ) : (
                            <>
                              {unclaimedBalanceFormatted} {tokenText}
                            </>
                          )}
                        </div>
                        <div>
                          {veNftAddress && (
                            <div>
                              {totalLocked} {tokenText}{' '}
                              <Link
                                href={veNftPagePath('myvenfts', {
                                  projectId,
                                  handle,
                                })}
                              >
                                locked
                              </Link>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            cursor: 'default',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: colors.text.tertiary,
                          }}
                        >
                          <Trans>
                            {userOwnershipPercentage}% of total supply
                          </Trans>
                        </div>
                      </div>

                      <Button
                        size="small"
                        onClick={() => setManageTokensModalVisible(true)}
                        disabled={isPreviewMode}
                      >
                        <Trans>Manage {tokenText}</Trans>
                      </Button>
                    </div>
                  </Descriptions.Item>

                  {showV1ProjectTokensSection && (
                    <Descriptions.Item
                      label={
                        <Space size="small">
                          <Trans>Your V1 balance</Trans>
                          <TooltipIcon
                            tip={
                              <Trans>
                                Your{' '}
                                <a
                                  href={`/p/${v1ProjectHandle}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  @{v1ProjectHandle}
                                </a>{' '}
                                V1 token balance.
                              </Trans>
                            }
                          />
                        </Space>
                      }
                      labelStyle={labelStyle}
                      style={{ paddingBottom: '0.5rem' }}
                    >
                      {v1ProjectHandle && (
                        <V1ProjectTokensSection
                          tokenText={tokenText}
                          v1ProjectHandle={v1ProjectHandle}
                          style={manageTokensRowStyle}
                        />
                      )}
                    </Descriptions.Item>
                  )}
                </>
              ) : null}
            </Descriptions>
          )}
        />
      </Space>

      <ManageTokensModal
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        projectAllowsMint={projectAllowsMint}
        userHasMintPermission={userHasMintPermission}
        hasOverflow={hasOverflow}
        redeemDisabled={redeemDisabled}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        tokenUnclaimedBalance={unclaimedBalance}
        transferUnclaimedTokensTx={useTransferUnclaimedTokensTx}
        RedeemModal={V2RedeemModal}
        ClaimTokensModal={V2ClaimTokensModal}
        MintModal={V2MintModal}
        TransferUnclaimedTokensModal={TransferUnclaimedTokensModal}
      >
        {veNftEnabled && (
          <Link href={veNftPagePath('mint', { projectId, handle })}>
            <RichButton
              heading={<Trans>Lock {tokenText} for Governance NFTs</Trans>}
              description={
                <Trans>
                  Lock your {tokenText} to increase your voting weight and claim
                  Governance NFTs.
                </Trans>
              }
            />
          </Link>
        )}
      </ManageTokensModal>
      <ParticipantsModal
        projectId={projectId}
        projectName={projectMetadata?.name}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        cv={cv}
        totalTokenSupply={totalTokenSupply}
        visible={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
    </>
  )
}
