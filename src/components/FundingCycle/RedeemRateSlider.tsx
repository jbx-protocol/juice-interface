import { FundingCycle } from 'models/funding-cycle'
import { Trans } from '@lingui/macro'

import { useRedeemRate } from 'hooks/v1/contractReader/RedeemRate'
import React, { useState } from 'react'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/TotalSupplyOfProjectToken'
import { BigNumber } from 'ethers'
import { Slider } from 'antd'
import { formatWad, fromWad } from 'utils/formatNumber'
import { pluralTokenShort } from 'utils/tokenSymbolText'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'

export default function RedeemRateSlider({
  projectId,
  fundingCycle,
  tokenSymbol,
}: {
  projectId?: BigNumber
  fundingCycle: FundingCycle
  tokenSymbol?: string
}) {
  const zeroBN = BigNumber.from(0)
  const metadata = decodeFundingCycleMetadata(fundingCycle.metadata)
  const reservedTicketBalance = useReservedTokensOfProject(
    metadata?.reservedRate,
  )

  const totalSupply = useTotalSupplyOfProjectToken(projectId)?.add(
    reservedTicketBalance ? reservedTicketBalance : zeroBN,
  )
  const [tokenPercent, setTokenPercent] = useState<number>(15)
  const tokenAmount = totalSupply?.mul(tokenPercent * 10).div(1000) // muL(10) then div(1000) to make % an int

  const rewardAmount = useRedeemRate({
    tokenAmount: fromWad(tokenAmount),
    fundingCycle: fundingCycle,
  })

  const minAmount = fundingCycle?.currency.eq(CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  const inputConfig = {
    min: 0,
    max: 100,
    step: 0.1,
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Slider
          {...inputConfig}
          tooltipVisible={false}
          style={{
            flex: 1,
            marginRight: 20,
            width: '100%',
            marginTop: 5,
            marginBottom: 5,
          }}
          value={tokenPercent}
          onChange={setTokenPercent}
          defaultValue={50}
        />
        {rewardAmount.gt(0) ? (
          <span>
            <Trans>
              {formatWad(tokenAmount, { precision: 0 })}{' '}
              {pluralTokenShort(tokenSymbol)} redeems for{' '}
              <CurrencySymbol currency={CURRENCY_ETH} />
              {`${formatWad(minAmount, { precision: 0 }) || '--'}`}
            </Trans>
          </span>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}
