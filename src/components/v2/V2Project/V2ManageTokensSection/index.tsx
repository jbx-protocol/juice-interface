import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import SectionHeader from 'components/shared/SectionHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'
import { NetworkContext } from 'contexts/networkContext'

import { CSSProperties, useContext, useState } from 'react'
import FormattedAddress from 'components/shared/FormattedAddress'

import V2ManageTokensModal from './V2ManageTokensModal'

export default function V2ManageTokensSection() {
  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)

  const { tokenAddress } = useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  // TODO:
  // const claimedBalance = useERC20BalanceOf(tokenAddress, userAddress)
  // const unclaimedBalance = useUnclaimedBalanceOfUser()

  const labelStyle: CSSProperties = {
    width: 128,
  }

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={t`Tokens`}
              tip={t`Tokens are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet.`}
            />
          }
          valueRender={() => (
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
                        {ticketsIssued &&
                          // <div>
                          //   {`${formatWad(claimedBalance ?? 0, {
                          //     precision: 0,
                          //   })} ${tokenSymbol}`}
                          // </div>
                          'TODO: claimed balance'}
                        <div>
                          {/* <Trans>
                            {formatWad(unclaimedBalance ?? 0, { precision: 0 })}
                            {ticketsIssued ? <> claimable</> : null}
                          </Trans> */}
                          'TODO: unclaimed balance'
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
          )}
        />
      </Space>

      <V2ManageTokensModal
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
      />
      {/* TODO: 'Holders modal */}
    </div>
  )
}
