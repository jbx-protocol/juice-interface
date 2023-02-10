import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { formattedNum, formatWad } from 'utils/format/formatNumber'
import { sumTierFloors } from 'utils/nftRewards'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'utils/v2v3/currency'
import { weightAmountPermyriad } from 'utils/v2v3/math'
import { useNftRewardTiersToMint } from './hooks/NftRewardTiersToMint'
import { NftRewardCell } from './NftRewardCell'

export function SummaryTable({
  weiAmount,
}: {
  weiAmount: BigNumber | undefined
}) {
  const { fundingCycle, fundingCycleMetadata, tokenSymbol } =
    useContext(V2V3ProjectContext)

  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()
  const isMobile = useMobile()
  const nftRewardTiers = useNftRewardTiersToMint()

  const usdAmount = converter.weiToUsd(weiAmount)

  const reservedRate = fundingCycleMetadata?.reservedRate?.toNumber()

  const receivedTickets = weightAmountPermyriad(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'payer',
  )
  const ownerTickets = weightAmountPermyriad(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'reserved',
  )

  const tokenText = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  return (
    <Descriptions column={1} bordered size={isMobile ? 'small' : 'default'}>
      <Descriptions.Item label={t`Pay amount`} className="content-right">
        {formattedNum(usdAmount)} {V2V3CurrencyName(V2V3_CURRENCY_USD)} (
        {formatWad(weiAmount)} {V2V3CurrencyName(V2V3_CURRENCY_ETH)})
      </Descriptions.Item>
      <Descriptions.Item
        label={<Trans>Tokens for you</Trans>}
        className="content-right"
      >
        <div>
          {formatWad(receivedTickets, { precision: 0 })} {tokenText}
        </div>
        <div className="text-xs">
          {userAddress ? (
            <Trans>
              To: <FormattedAddress address={userAddress} />
            </Trans>
          ) : null}
        </div>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <TooltipLabel
            label={t`Tokens reserved`}
            tip={
              <Trans>
                This project reserves some of the newly minted tokens for
                itself.
              </Trans>
            }
          />
        }
        className="content-right"
      >
        {formatWad(ownerTickets, { precision: 0 })} {tokenText}
      </Descriptions.Item>
      {nftRewardTiers?.length ? (
        <Descriptions.Item
          className="py-3 px-6"
          label={
            <TooltipLabel
              label={t`NFTs for you`}
              tip={
                <Trans>
                  You receive these NFTs for contributing{' '}
                  <strong>{sumTierFloors(nftRewardTiers)} ETH or more</strong>.
                </Trans>
              }
            />
          }
        >
          <NftRewardCell nftRewards={nftRewardTiers} />
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  )
}
