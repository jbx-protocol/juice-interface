import { Progress, Tooltip } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fracDiv } from 'utils/formatNumber'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { BigNumber } from '@ethersproject/bignumber'
import { hasFundingTarget } from 'utils/fundingCycle'

export default function FundingProgressBar() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const converter = useCurrencyConverter()
  const { projectId, currentFC, balanceInCurrency } = useContext(ProjectContext)

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const overflowInCurrency = converter.wadToCurrency(
    totalOverflow ?? 0,
    currentFC?.currency.toNumber() as CurrencyOption,
    0,
  )

  const percentPaid = useMemo(
    () =>
      balanceInCurrency && currentFC?.target
        ? fracDiv(balanceInCurrency.toString(), currentFC.target.toString()) *
          100
        : 0,
    [balanceInCurrency, currentFC],
  )

  // Percent overflow of target
  const percentOverflow = fracDiv(
    (overflowInCurrency?.sub(currentFC?.target ?? 0) ?? 0).toString(),
    (currentFC?.target ?? 0).toString(),
  )

  if (!currentFC || (hasFundingTarget(currentFC) && currentFC.target.gt(0))) {
    return null
  }

  return (
    <Tooltip title="">
      {totalOverflow?.gt(0) ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress
            style={{
              width: (1 - percentOverflow) * 100 + '%',
              minWidth: 10,
            }}
            percent={100}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
          <div
            style={{
              minWidth: 4,
              height: 15,
              borderRadius: 2,
              background: colors.text.primary,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 3,
            }}
          ></div>

          <Progress
            style={{
              width: percentOverflow * 100 + '%',
              minWidth: 10,
            }}
            percent={100}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
        </div>
      ) : (
        <Progress
          percent={percentPaid ? Math.max(percentPaid, 1) : 0}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />
      )}
    </Tooltip>
  )
}
