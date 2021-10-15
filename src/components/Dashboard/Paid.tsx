import { CrownFilled, RightCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Progress, Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
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
import {
  formattedNum,
  formatWad,
  fracDiv,
  fromWad,
  parseWad,
} from 'utils/formatNumber'
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
  const ownerBalanceInCurrency = currentFC?.currency.eq(0)
    ? ownerBalance
    : parseWad(converter.weiToUsd(ownerBalance))

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
        <CurrencySymbol
          currency={currentFC.currency.toNumber() as CurrencyOption}
        />
        {currentFC.currency.eq(1) ? (
          <span>
            {formatWad(amt, { decimals: 4 })}{' '}
            <span style={subTextStyle}>
              <CurrencySymbol currency={0} />
              {formatWad(converter.usdToWei(fromWad(amt)), {
                decimals: 4,
              })}
            </span>
          </span>
        ) : (
          formatWad(amt, { decimals: 4 })
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
            {projectType === 'bidpool' ? (
              <TooltipLabel
                label="EARNED"
                tip="The total earned by this project since it was created."
              />
            ) : (
              <TooltipLabel
                label="BALANCE"
                tip="The total paid to the project in this funding cycle, plus any unclaimed overflow from the previous funding cycle."
              />
            )}
          </div>
          <div
            style={{
              ...primaryTextStyle,
              display: 'flex',
              alignItems: 'baseline',
              color: colors.text.brand.primary,
            }}
          >
            {projectType === 'bidpool'
              ? formatCurrencyAmount(earned)
              : formatCurrencyAmount(balanceInCurrency)}
          </div>
        </div>

        {totalOverflow?.gt(0) && projectType === 'standard' && (
          <div style={{ fontWeight: 500, textAlign: 'right' }}>
            <div style={smallHeaderStyle(colors)}>
              <TooltipLabel
                label="OVERFLOW"
                tip="The amount paid to this project, minus the current funding cycle's target. Overflow can be claimed by token holders. Any unclaimed overflow from this cycle will go towards the next cycle's target."
              />
            </div>
            {currentFC.currency.eq(1) ? (
              <span>
                <span style={subTextStyle}>
                  <CurrencySymbol currency={0} />
                  {formatWad(totalOverflow ?? 0, { decimals: 4 })}
                </span>{' '}
                <span style={primaryTextStyle}>
                  <CurrencySymbol currency={1} />
                  {formattedNum(converter.weiToUsd(totalOverflow), {
                    decimals: 0,
                  })}
                </span>
              </span>
            ) : (
              <span style={primaryTextStyle}>
                <CurrencySymbol currency={0} />
                {formatWad(totalOverflow ?? 0, { decimals: 4 })}
              </span>
            )}
          </div>
        )}
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
          {projectType === 'bidpool' ? (
            <div>
              <span
                style={{ ...primaryTextStyle, color: colors.text.secondary }}
              >
                {formatCurrencyAmount(balanceInCurrency)}/
                {formatWad(currentFC.target)}
              </span>
              <div style={smallHeaderStyle(colors)}>
                <TooltipLabel
                  label="BALANCE"
                  tip="The current balance of this Juicebox project, out of its  funding target. Only up to the funding target can be withdrawn during this funding cycle."
                />
              </div>
            </div>
          ) : (
            <div>
              <span
                style={{ ...primaryTextStyle, color: colors.text.secondary }}
              >
                <CurrencySymbol
                  currency={currentFC.currency.toNumber() as CurrencyOption}
                />
                {formatWad(currentFC.tapped, { decimals: 4 })}
                <span
                  style={{ fontSize: '0.8rem', color: colors.text.secondary }}
                >
                  {' '}
                  /{' '}
                  <CurrencySymbol
                    currency={currentFC.currency.toNumber() as CurrencyOption}
                  />
                  {formatWad(currentFC.target, {
                    decimals: 4,
                  })}
                </span>
              </span>
              <div style={smallHeaderStyle(colors)}>
                <TooltipLabel
                  label="WITHDRAWN"
                  tip="The portion of the funding target that has been withdrawn in the current funding cycle."
                />
              </div>
            </div>
          )}

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
