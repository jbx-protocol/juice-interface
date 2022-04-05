import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import SectionHeader from 'components/shared/SectionHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'
import { NetworkContext } from 'contexts/networkContext'
import useERC20BalanceOf from 'hooks/v2/contractReader/ERC20BalanceOf'

import { CSSProperties, useContext, useState } from 'react'
import FormattedAddress from 'components/shared/FormattedAddress'
import { formatWad } from 'utils/formatNumber'

import IssueTicketsButton from 'components/shared/IssueTicketsButton'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import V2ManageTokensModal from './V2ManageTokensModal'

export default function V2ManageTokensSection() {
  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)

  const { tokenAddress, tokenSymbol, isPreviewMode } =
    useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const claimedBalance = useERC20BalanceOf(tokenAddress, userAddress).data
  // TODO: const unclaimedBalance = useUnclaimedBalanceOfUser()

  const labelStyle: CSSProperties = {
    width: 128,
  }

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const hasIssueTicketsPermission = useHasPermission(V2OperatorPermission.ISSUE)

  const tokenText = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: true,
    plural: true,
  })

  const showIssueTokensButton =
    !ticketsIssued && hasIssueTicketsPermission && !isPreviewMode

  return (
    <>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <div>
              <SectionHeader
                text={tokenText}
                tip={
                  <Trans>
                    {tokenText} are distributed to anyone who pays this project.
                    If the project has set a funding target, tokens can be
                    redeemed for a portion of the project's overflow whether or
                    not they have been claimed yet.
                  </Trans>
                }
              />
            </div>
          }
          valueRender={() => (
            <>
              <Descriptions layout="horizontal" column={1}>
                {ticketsIssued && (
                  <Descriptions.Item
                    label={t`Address`}
                    labelStyle={labelStyle}
                    children={
                      <div style={{ width: '100%' }}>
                        <FormattedAddress address={tokenAddress} />
                      </div>
                    }
                  />
                )}
                {userAddress ? (
                  <Descriptions.Item
                    label={t`Your balance`}
                    labelStyle={labelStyle}
                    style={{ paddingBottom: '0.5rem' }}
                    children={
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 5,
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <div>
                          {ticketsIssued ? (
                            <div>
                              {`${formatWad(claimedBalance ?? 0, {
                                precision: 0,
                              })} `}
                            </div>
                          ) : (
                            0
                          )}
                          <div>
                            {/* <Trans>
                            {formatWad(unclaimedBalance ?? 0, { precision: 0 })}
                            {ticketsIssued ? <> claimable</> : null}
                          </Trans> */}
                            {/* 'TODO: unclaimed balance' */}
                          </div>
                          {/* TODO: % of total supply */}
                        </div>

                        <Button
                          size="small"
                          onClick={() => setManageTokensModalVisible(true)}
                        >
                          <Trans>Manage</Trans>
                        </Button>
                      </div>
                    }
                  />
                ) : null}
              </Descriptions>
              {/* TODO: 'Holders modal button */}
              {showIssueTokensButton && (
                <IssueTicketsButton useIssueTokensTx={useIssueTokensTx} />
              )}
            </>
          )}
        />
      </Space>

      <V2ManageTokensModal
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
      />
      {/* TODO: 'Holders modal */}
    </>
  )
}
