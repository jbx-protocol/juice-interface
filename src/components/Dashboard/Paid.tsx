import { RightCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Progress, Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import EtherscanLink from 'components/shared/EtherscanLink'
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
import { formatWad, fracDiv, fromWad, parseWad } from 'utils/formatNumber'
import { hasFundingTarget } from 'utils/fundingCycle'

import BalancesModal from '../modals/BalancesModal'

export default function Paid() {
  const [balancesModalVisible, setBalancesModalVisible] = useState<boolean>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    projectId,
    currentFC,
    balanceInCurrency,
    balance,
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

  const percentPaid = useMemo(
    () =>
      balanceInCurrency && currentFC?.target
        ? fracDiv(balanceInCurrency.toString(), currentFC.target.toString()) *
          100
        : 0,
    [currentFC?.target, balanceInCurrency],
  )

  const percentOverflow = fracDiv(
    overflowInCurrency?.toString() ?? '0',
    balanceInCurrency?.toString() ?? '1',
  )

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.1rem',
  }

  const secondaryTextStyle: CSSProperties = {
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontWeight: 500,
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
          alignItems: 'baseline',
        }}
      >
        <span style={secondaryTextStyle}>
          <TooltipLabel
            label="Volume"
            tip="The total amount received by this project since it was created."
          />
        </span>
        <span style={primaryTextStyle}>
          <CurrencySymbol currency={0} />
          {earned?.lt(parseWad('1')) && earned.gt(0)
            ? '<1'
            : formatWad(earned, { decimals: 0 })}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'nowrap',
          marginTop: 10,
        }}
      >
        <div style={secondaryTextStyle}>
          <TooltipLabel
            label="In Juicebox"
            tip="The balance of this project in the Juicebox contract."
          />
        </div>

        <div
          style={{
            ...primaryTextStyle,
            color: colors.text.brand.primary,
            marginLeft: 10,
          }}
        >
          {currentFC.currency.eq(1) ? (
            <span style={secondaryTextStyle}>
              <CurrencySymbol currency={0} />
              {formatWad(balance, { decimals: 0 })}{' '}
            </span>
          ) : (
            ''
          )}
          {formatCurrencyAmount(balanceInCurrency)}
        </div>
      </div>

      {hasFundingTarget(currentFC) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div style={secondaryTextStyle}>
            <TooltipLabel
              label="Funding target"
              tip="No more than the funding target can be withdrawn by the project owner in a given funding cycle."
            />
          </div>

          <div
            style={{
              ...secondaryTextStyle,
              color: colors.text.primary,
              fontWeight: 500,
            }}
          >
            {formatCurrencyAmount(currentFC.target)}
          </div>
        </div>
      )}

      {hasFundingTarget(currentFC) &&
        (totalOverflow?.gt(0) ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Progress
              style={{
                width: (1 - percentOverflow) * 100 + '%',
                minWidth: 10,
              }}
              percent={percentPaid ? Math.max(percentPaid, 1) : 0}
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
            percent={percentPaid ? Math.max(percentPaid, 1) : 0}
            showInfo={false}
            strokeColor={colors.text.brand.primary}
          />
        ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 10,
        }}
      >
        <span style={secondaryTextStyle}>
          <TooltipLabel
            label="Wallet balance"
            tip={
              <div>
                <p>
                  The balance of the wallet that owns this Juicebox project.
                </p>
                <span style={{ userSelect: 'all' }}>{owner}</span>{' '}
                <EtherscanLink value={owner} type="address" />
              </div>
            }
          />
        </span>
        <span style={primaryTextStyle}>
          <CurrencySymbol currency={0} />
          {formatWad(ownerBalance, { decimals: 2 })}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={secondaryTextStyle}>
          <TooltipLabel
            label="Other assets"
            tip="Other tokens in the wallet that owns this Juicebox project. New tokens can be tracked by editing the project."
          />
        </span>
        <span
          style={{ ...secondaryTextStyle, cursor: 'pointer' }}
          onClick={() => setBalancesModalVisible(true)}
        >
          <ProjectTokenBalance
            style={{ display: 'inline-block' }}
            wallet={owner}
            projectId={BigNumber.from('0x01')}
            hideHandle
          />{' '}
          <RightCircleOutlined />
        </span>
      </div>

      <BalancesModal
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </div>
  )
}
