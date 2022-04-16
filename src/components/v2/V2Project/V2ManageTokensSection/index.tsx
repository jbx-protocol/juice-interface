import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import SectionHeader from 'components/shared/SectionHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'
import { NetworkContext } from 'contexts/networkContext'
import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'

import { CSSProperties, useContext, useState } from 'react'
import FormattedAddress from 'components/shared/FormattedAddress'
import { formatPercent, formatWad } from 'utils/formatNumber'

import IssueTicketsButton from 'components/shared/IssueTicketsButton'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { ThemeContext } from 'contexts/themeContext'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useLocation } from 'react-router-dom'
import ManageTokensModal from 'components/shared/ManageTokensModal'

import V2RedeemModal from './V2RedeemModal'
import V2ClaimTokensModal from './V2ClaimTokensModal'
import V2MintModal from './V2MintModal'

export default function V2ManageTokensSection() {
  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)

  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    totalTokenSupply,
    fundingCycleMetadata,
    projectId,
    primaryTerminalCurrentOverflow,
  } = useContext(V2ProjectContext)

  // Checks URL to see if user was just directed from project deploy
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isNewDeploy = Boolean(params.get('newDeploy'))

  const { userAddress } = useContext(NetworkContext)

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()

  const labelStyle: CSSProperties = {
    width: 128,
  }

  const hasIssuedERC20 = tokenAddress !== constants.AddressZero

  const hasIssueTicketsPermission = useHasPermission(V2OperatorPermission.ISSUE)

  const tokenText = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)

  // %age of tokens the user owns.
  const userOwnershipPercentage =
    formatPercent(totalBalance, totalTokenSupply) || '0'

  const showIssueTokensButton =
    !hasIssuedERC20 && hasIssueTicketsPermission && !isPreviewMode

  const claimedBalanceFormatted = formatWad(claimedBalance ?? 0, {
    precision: 0,
  })
  const unclaimedBalanceFormatted = formatWad(unclaimedBalance ?? 0, {
    precision: 0,
  })

  const manageTokensRowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
    width: '100%',
  }
  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))

  const userHasMintPermission = Boolean(
    useHasPermission(V2OperatorPermission.MINT),
  )
  const projectAllowsMint = Boolean(fundingCycleMetadata?.allowMinting)

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
                      tokenSymbol: tokenSymbol,
                      capitalize: true,
                      plural: true,
                      includeTokenWord: true,
                    })}{' '}
                    are distributed to anyone who pays this project. If the
                    project has set a funding target, tokens can be redeemed for
                    a portion of the project's overflow whether or not they have
                    been claimed yet.
                  </Trans>
                }
              />
              {showIssueTokensButton && (
                <div style={{ marginBottom: 20 }}>
                  <IssueTicketsButton
                    isNewDeploy={isNewDeploy}
                    useIssueTokensTx={useIssueTokensTx}
                  />
                </div>
              )}
            </div>
          }
          valueRender={() => (
            <>
              <Descriptions layout="horizontal" column={1} size="small">
                {hasIssuedERC20 && tokenSymbol && (
                  <>
                    <Descriptions.Item
                      label={t`Project token`}
                      labelStyle={labelStyle}
                      children={
                        <div style={manageTokensRowStyle}>
                          <div>
                            {tokenSymbol} (
                            <FormattedAddress address={tokenAddress} />)
                          </div>
                        </div>
                      }
                    />
                  </>
                )}
                <Descriptions.Item
                  label={t`Total supply`}
                  labelStyle={labelStyle}
                  children={
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
                      {formatWad(totalTokenSupply, { precision: 0 })}{' '}
                      {tokenText}
                      {/* TODO: Holders modal button */}
                    </div>
                  }
                />
                {userAddress ? (
                  <Descriptions.Item
                    label={t`Your balance`}
                    labelStyle={labelStyle}
                    style={{ paddingBottom: '0.5rem' }}
                    children={
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
                                {unclaimedBalanceFormatted} {tokenText}{' '}
                                claimable
                              </Trans>
                            ) : (
                              <>
                                {unclaimedBalanceFormatted} {tokenText}
                              </>
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
                    }
                  />
                ) : null}
              </Descriptions>
            </>
          )}
        />
      </Space>

      <ManageTokensModal
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        projectAllowsMint={projectAllowsMint}
        userHasMintPermission={userHasMintPermission}
        hasOverflow={hasOverflow}
        tokenSymbol={tokenSymbol}
        RedeemModal={V2RedeemModal}
        ClaimTokensModal={V2ClaimTokensModal}
        MintModal={V2MintModal}
      />
      {/* TODO: 'Holders modal */}
    </>
  )
}
