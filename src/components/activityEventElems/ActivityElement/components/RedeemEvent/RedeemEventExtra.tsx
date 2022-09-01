import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export function RedeemEventExtra({
  returnAmount,
}: {
  returnAmount: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div style={{ color: colors.text.secondary }}>
      <Trans>
        <ETHAmount amount={returnAmount} /> overflow received
      </Trans>
    </div>
  )
}
