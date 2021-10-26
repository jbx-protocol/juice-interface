import { RightCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Progress, Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import ProjectTokenBalance from 'components/shared/ProjectTokenBalance'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useEthBalance } from 'hooks/EthBalance'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formattedNum, formatWad, fracDiv, fromWad } from 'utils/formatNumber'
import { hasFundingTarget } from 'utils/fundingCycle'

import BalancesModal from '../modals/BalancesModal'
import { smallHeaderStyle } from './styles'

export default function Paid() {
  const [balancesModalVisible, setBalancesModalVisible] = useState<boolean>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    projectId,
    projectType,
    currentFC,
    balanceInCurrency,
    owner,
    earned,
  } = useContext(ProjectContext)

  const converter = useCurrencyConverter()

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

  const overflowInCurrency = useMemo(
    () =>
      totalOverflow &&
      converter.wadToCurrency(
        totalOverflow,
        currentFC?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [currentFC?.currency, totalOverflow, converter],
  )

  const ownerBalance = useEthBalance(owner)

  const ownerBalanceInCurrency = useMemo(
    () =>
      ownerBalance &&
      converter.wadToCurrency(
        ownerBalance,
        currentFC?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [currentFC?.currency, ownerBalance, converter],
  )

  const percentPaid = useMemo(
    () =>
      balanceInCurrency && currentFC?.target
        ? fracDiv(
            balanceInCurrency.add(currentFC.tapped).toString(),
            currentFC.target.toString(),
          ) * 100
        : 0,
    [currentFC?.target, balanceInCurrency],
  )

  const percentOverflow = fracDiv(
    overflowInCurrency?.toString() ?? '0',
    balanceInCurrency?.toString() ?? '1',
  )

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.2rem',
  }

  const subTextStyle: CSSProperties = {
    color: colors.text.tertiary,
    fontSize: '0.8rem',
  }

  if (!currentFC) return null

  const formatCurrencyAmount = (amt: BigNumber | undefined) =>
    amt ? (
      <>
        {currentFC.currency.eq(1) ? (
          <span>
            <Tooltip
              title={
                <span>
                  <CurrencySymbol currency={0} />
                  {formatWad(converter.usdToWei(fromWad(amt)), {
                    decimals: 2,
                  })}
                </span>
              }
            >
              <CurrencySymbol currency={1} />
              {formatWad(amt, { decimals: 2 })}
            </Tooltip>
          </span>
        ) : (
          <span>
            <CurrencySymbol currency={0} />
            {formatWad(amt, { decimals: 2 })}
          </span>
        )}
      </>
    ) : null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>
            <TooltipLabel
              label="FUNDING"
              tip={
                hasFundingTarget(currentFC)
                  ? "The project's Juicebox balance, out of its current funding target."
                  : "The project's Juicebox balance."
              }
            />
          </div>
          <div
            style={{
              ...primaryTextStyle,
              display: 'flex',
              alignItems: 'baseline',
              color: colors.text.brand.primary,
            }}
          >
            {formatCurrencyAmount(balanceInCurrency?.add(currentFC.tapped))}

            {hasFundingTarget(currentFC) && (
              <span style={{ ...subTextStyle, marginLeft: 8 }}>
                / {formatCurrencyAmount(currentFC.target)}
              </span>
            )}
          </div>
        </div>

        <div style={{ fontWeight: 500, textAlign: 'right' }}>
          <div style={smallHeaderStyle(colors)}>
            <TooltipLabel
              label="LIFETIME"
              tip="The total amount this project has earned in its lifetime."
            />
          </div>
          <span style={primaryTextStyle}>
            <CurrencySymbol currency={0} />
            {formatWad(earned, { decimals: 2 })}
          </span>
        </div>
      </div>

      {hasFundingTarget(currentFC) &&
        (totalOverflow?.gt(0) ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Progress
              style={{
                width: (1 - percentOverflow) * 100 + '%',
                minWidth: 10,
              }}
              percent={percentPaid}
              showInfo={false}
              strokeColor={colors.text.brand.primary}
            />
            <div
              style={{
                width: 4,
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
            percent={percentPaid}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
        ))}

      {hasFundingTarget(currentFC) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            marginTop: 4,
          }}
        >
          <div>
            <span style={{ ...primaryTextStyle, color: colors.text.secondary }}>
              {formatCurrencyAmount(ownerBalanceInCurrency)}
            </span>
            <div style={smallHeaderStyle(colors)}>
              <TooltipLabel
                label="WALLET"
                tip="ETH balance of the project owner's wallet."
              />
            </div>
          </div>

          <div
            style={{ textAlign: 'right', cursor: 'pointer' }}
            onClick={() => setBalancesModalVisible(true)}
          >
            <ProjectTokenBalance
              style={{
                display: 'inline-block',
                color: colors.text.tertiary,
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
              wallet={owner}
              projectId={BigNumber.from('0x01')}
              hideHandle
            />
            <div style={{ ...smallHeaderStyle(colors), cursor: 'pointer' }}>
              <span style={{ marginRight: 5 }}>ASSETS</span>
              <RightCircleOutlined />
            </div>
          </div>
        </div>
      )}

      <BalancesModal
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </div>
  )
}
