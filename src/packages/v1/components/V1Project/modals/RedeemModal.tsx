import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { TokenAmount } from 'components/TokenAmount'
import { readNetwork } from 'constants/networks'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { NetworkName } from 'models/networkName'
import { V1_CURRENCY_USD } from 'packages/v1/constants/currency'
import { V1_PROJECT_IDS } from 'packages/v1/constants/projectIds'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import useClaimableOverflowOf from 'packages/v1/hooks/contractReader/useClaimableOverflowOf'
import { useRedeemRate } from 'packages/v1/hooks/contractReader/useRedeemRate'
import useTotalBalanceOf from 'packages/v1/hooks/contractReader/useTotalBalanceOf'
import { useRedeemTokensTx } from 'packages/v1/hooks/transactor/useRedeemTokensTx'
import { decodeFundingCycleMetadata } from 'packages/v1/utils/fundingCycle'
import { useContext, useState } from 'react'
import { formattedNum, fromWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

// This double as the 'Redeem' and 'Burn' modal depending on if project has overflow
export default function RedeemModal({
  open,
  onOk,
  onCancel,
}: {
  open?: boolean
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { tokenSymbol, currentFC, terminal, overflow } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const redeemTokensTx = useRedeemTokensTx()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const { userAddress } = useWallet()
  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)
  const maxClaimable = useClaimableOverflowOf()
  const rewardAmount = useRedeemRate({
    tokenAmount: redeemAmount,
    fundingCycle: currentFC,
  })

  // 0.5% slippage for USD-denominated projects
  const minAmount = currentFC?.currency.eq(V1_CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  async function redeem() {
    await form.validateFields()
    if (!minAmount) return

    setLoading(true)

    redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minAmount,
        preferConverted: false,
      },
      {
        onConfirmed: () => setRedeemAmount(undefined),
        onDone: () => {
          setLoading(false)
          onOk?.()
        },
      },
    )
  }

  const tokensTextLong = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })
  const tokensTextShort = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  let modalTitle: string
  // Defining whole sentence for translations
  if (overflow?.gt(0)) {
    modalTitle = t`Redeem ${tokensTextLong} for ETH`
  } else {
    modalTitle = t`Burn ${tokensTextLong}`
  }

  let buttonText: string
  // Defining whole sentence for translations
  if (overflow?.gt(0)) {
    buttonText = t`Redeem ${formattedNum(redeemAmount, {
      precision: 2,
    })} ${tokensTextShort} for ETH`
  } else {
    buttonText = t`Burn ${formattedNum(redeemAmount, {
      precision: 2,
    })} ${tokensTextShort}`
  }

  const redeemBN = parseWad(redeemAmount ?? 0)

  const validateRedeemAmount = () => {
    if (redeemBN.eq(0)) {
      return Promise.reject(t`Required`)
    } else if (redeemBN.gt(totalBalance ?? 0)) {
      return Promise.reject(t`Balance exceeded`)
    }
    return Promise.resolve()
  }

  const isConstitutionDao =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.CONSTITUTION_DAO

  return (
    <Modal
      title={modalTitle}
      open={open}
      confirmLoading={loading}
      onOk={() => {
        redeem()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        if (onCancel) onCancel()
      }}
      okText={buttonText}
      okButtonProps={{
        disabled: !redeemAmount || parseInt(redeemAmount) === 0,
      }}
      width={540}
      centered
    >
      <div className="flex flex-col gap-6">
        {isConstitutionDao ? (
          <Callout.Warning>
            <strong>
              <Trans>Get more for your PEOPLE.</Trans>
            </strong>{' '}
            <div>
              <Trans>
                Check{' '}
                <a
                  href="https://app.uniswap.org/explore/tokens/ethereum/0x7a58c0be72be218b41c608b7fe7c5bb630736c71"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uniswap
                </a>
                ,{' '}
                <a
                  href="https://www.sushi.com/swap?chainId=1&token0=0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71&token1=NATIVE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SushiSwap
                </a>
                , or other third-party exchanges for better rates before
                redeeming on Juicebox.
              </Trans>
            </div>
          </Callout.Warning>
        ) : null}
        <hr />
        <div className="flex flex-col gap-2">
          <p className="m-0 flex items-baseline justify-between">
            Your {tokenSymbolText({ tokenSymbol, capitalize: true })} balance:{' '}
            <span>
              {totalBalance ? (
                <TokenAmount
                  amountWad={totalBalance}
                  tokenSymbol={tokenSymbol}
                />
              ) : null}
            </span>
          </p>

          <p className="m-0 flex items-baseline justify-between">
            <Trans>Current Redemption Rate:</Trans>{' '}
            <span>
              {fcMetadata?.bondingCurveRate !== undefined
                ? fcMetadata.bondingCurveRate / 2
                : '--'}
              %
            </span>
          </p>

          <p className="m-0 flex items-baseline justify-between">
            <Trans>
              Currently worth:{' '}
              <span>
                <ETHAmount amount={maxClaimable} />
              </span>
            </Trans>
          </p>
        </div>
        <hr />

        <p>
          {overflow?.gt(0) ? (
            <Trans>
              Project tokens can be redeemed to reclaim a portion of the ETH not
              needed for this cycle's payouts. The amount of ETH returned
              depends on this cycle's redemption rate.{' '}
              <span className="font-medium text-warning-800 dark:text-warning-400">
                Tokens are burned when they are redeemed.
              </span>
            </Trans>
          ) : (
            <Trans>
              <span className="font-medium text-warning-800 dark:text-warning-100">
                You won't receive ETH because this project has no ETH, or is
                using all of its ETH for payouts .
              </span>
            </Trans>
          )}
        </p>
        <div>
          <Form
            form={form}
            onKeyDown={e => {
              if (e.key === 'Enter') redeem()
            }}
          >
            <Form.Item
              name="redeemAmount"
              rules={[{ validator: validateRedeemAmount }]}
            >
              <FormattedNumberInput
                min={0}
                step={0.001}
                placeholder="0"
                value={redeemAmount}
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                }
                disabled={totalBalance?.eq(0)}
                onChange={val => setRedeemAmount(val)}
              />
            </Form.Item>
          </Form>
          {overflow?.gt(0) ? (
            <div className="mt-5 font-medium">
              <Trans>
                You will receive{' '}
                {currentFC?.currency.eq(V1_CURRENCY_USD) ? 'minimum ' : ' '}
                <ETHAmount amount={rewardAmount} />
              </Trans>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
