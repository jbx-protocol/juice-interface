import { t, Trans } from '@lingui/macro'
import { Collapse, Form, Input, Switch } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import TooltipLabel from 'components/TooltipLabel'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import * as constants from '@ethersproject/constants'
import { EthAddressInput } from 'components/inputs/EthAddressInput'

export default function AdvancedOptionsCollapse({
  tokenMintingEnabled,
  setTokenMintingEnabled,
  preferClaimed,
  setPreferClaimed,
}: {
  tokenMintingEnabled: boolean
  setTokenMintingEnabled: Dispatch<SetStateAction<boolean>>
  preferClaimed: boolean
  setPreferClaimed: Dispatch<SetStateAction<boolean>>
}) {
  const { tokenAddress } = useContext(V2ProjectContext)

  const [activeKey, setActiveKey] = useState<number>()
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)

  const advancedSettingsMargin = '20px'
  const switchMargin = '20px'

  return (
    <Collapse style={{ border: 'none' }} activeKey={activeKey}>
      <CollapsePanel
        header={
          <span onClick={() => setActiveKey(activeKey === 0 ? undefined : 0)}>
            <Trans>Advanced options (optional)</Trans>
          </span>
        }
        key={0}
        style={{ border: 'none', marginLeft: '-18px' }}
      >
        <div style={{ paddingLeft: '24px', marginTop: '-15px' }}>
          <div>
            <TooltipLabel
              label={t`Custom memo`}
              tip={
                <Trans>
                  The onchain memo for each transaction made through the
                  address. It will appear in the project's payment feed when
                  someone pays this address.
                </Trans>
              }
            />
            <Form.Item name="memo">
              <Input
                placeholder={t`Payment made through payable address`}
                type="string"
                autoComplete="off"
                style={{ marginTop: 5 }}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', marginTop: advancedSettingsMargin }}>
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
          {tokenMintingEnabled ? (
            <div
              style={{
                display: 'flex',
                margin: `${advancedSettingsMargin} 0 14px`,
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
                }}
                checked={customBeneficiaryEnabled}
                style={{ marginLeft: switchMargin }}
              />
            </div>
          ) : null}
          {tokenMintingEnabled && customBeneficiaryEnabled ? (
            <Form.Item name="customBeneficiaryAddress">
              <EthAddressInput />
            </Form.Item>
          ) : null}
          {tokenMintingEnabled &&
          tokenAddress &&
          tokenAddress !== constants.AddressZero ? (
            <div style={{ display: 'flex', marginTop: advancedSettingsMargin }}>
              <TooltipLabel
                label={t`Mint tokens as ERC-20`}
                tip={
                  <Trans>
                    When checked, payments to this address will mint this
                    project's ERC-20 tokens to the beneficiary's wallet.
                    Payments will cost more gas. When unchecked, Juicebox will
                    track the beneficiary's new tokens when they pay. The
                    beneficiary can claim their ERC-20 tokens at any time.
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
        </div>
      </CollapsePanel>
    </Collapse>
  )
}
