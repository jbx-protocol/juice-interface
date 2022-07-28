import { t, Trans } from '@lingui/macro'
import { Input, Space, Switch } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import * as constants from '@ethersproject/constants'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { MinimalCollapse } from 'components/MinimalCollapse'

export default function AdvancedOptionsCollapse({
  memo,
  setMemo,
  customBeneficiaryAddress,
  setCustomBeneficiaryAddress,
  tokenMintingEnabled,
  setTokenMintingEnabled,
  preferClaimed,
  setPreferClaimed,
}: {
  memo: string | undefined
  setMemo: Dispatch<SetStateAction<string | undefined>>
  customBeneficiaryAddress: string | undefined
  setCustomBeneficiaryAddress: Dispatch<SetStateAction<string | undefined>>
  tokenMintingEnabled: boolean
  setTokenMintingEnabled: Dispatch<SetStateAction<boolean>>
  preferClaimed: boolean
  setPreferClaimed: Dispatch<SetStateAction<boolean>>
}) {
  const { tokenAddress } = useContext(V2ProjectContext)

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)

  const switchMargin = '1rem'

  return (
    <MinimalCollapse header={<Trans>Advanced (optional)</Trans>}>
      <Space size="middle" direction="vertical">
        <div>
          <TooltipLabel
            label={t`Payment memo`}
            tip={
              <Trans>
                The onchain memo for each payment made to this address. The
                project's payment feed will include the memo alongside the
                payment.
              </Trans>
            }
          />
          <Input
            value={memo}
            onChange={e => setMemo(e.target.value)}
            type="string"
            autoComplete="off"
            style={{ marginTop: 5 }}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <TooltipLabel
            label={t`Token minting enabled`}
            tip={t`Determines whether tokens will be minted from payments to this address.`}
          />
          <Switch
            onChange={setTokenMintingEnabled}
            checked={tokenMintingEnabled}
            style={{ marginLeft: switchMargin }}
          />
        </div>
        {tokenMintingEnabled &&
        tokenAddress &&
        tokenAddress !== constants.AddressZero ? (
          <div style={{ display: 'flex' }}>
            <TooltipLabel
              label={t`Mint tokens as ERC-20`}
              tip={
                <Trans>
                  When checked, payments to this address will mint this
                  project's ERC-20 tokens to the beneficiary's wallet. Payments
                  will cost more gas. When unchecked, Juicebox will track the
                  beneficiary's new tokens when they pay. The beneficiary can
                  claim their ERC-20 tokens at any time.
                </Trans>
              }
            />
            <Switch
              style={{ marginLeft: switchMargin }}
              checked={preferClaimed}
              onChange={setPreferClaimed}
            />
          </div>
        ) : null}

        {tokenMintingEnabled ? (
          <div
            style={{
              display: 'flex',
            }}
          >
            <TooltipLabel
              label={t`Custom token beneficiary`}
              tip={
                <Trans>
                  By default, newly minted tokens will go to the wallet who
                  sends funds to the address. You can enable this to set the
                  token beneficiary to a custom address.
                </Trans>
              }
            />
            <Switch
              onChange={checked => {
                setCustomBeneficiaryEnabled(checked)
                if (!checked) {
                  setCustomBeneficiaryAddress(undefined)
                }
              }}
              checked={customBeneficiaryEnabled}
              style={{ marginLeft: switchMargin }}
            />
          </div>
        ) : null}
        {tokenMintingEnabled && customBeneficiaryEnabled ? (
          <EthAddressInput
            value={customBeneficiaryAddress}
            onChange={setCustomBeneficiaryAddress}
          />
        ) : null}
      </Space>
    </MinimalCollapse>
  )
}
