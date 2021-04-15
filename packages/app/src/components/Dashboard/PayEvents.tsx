import { ArrowLeftOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { ContractName } from 'constants/contract-name'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useEventListener from 'hooks/EventListener'
import React, { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatCurrency'
import { formatDate } from 'utils/formatDate'
import { toUint256 } from 'utils/formatNumber'

import { PayEvent } from '../../models/events/pay-event'

export default function PayEvents({
  projectId,
}: {
  projectId: BigNumber | undefined
}) {
  const { signingProvider } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const events = useEventListener<PayEvent>({
    contractName: ContractName.Juicer,
    eventName: 'Pay',
    topics: projectId ? [undefined, toUint256(projectId)] : undefined,
    provider: signingProvider,
    includeHistory: true,
  })

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    color: colors.grape,
  }

  const contentLineHeight = 1.5

  return (
    <div>
      {events?.length ? (
        events.map((event, i) => (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.grapeHint,
            }}
            key={i}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}
            >
              <div>
                <div style={smallHeaderStyle}>Received</div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginRight: 10,
                    color: colors.bodyPrimary,
                  }}
                >
                  <CurrencySymbol currency={event.currency} />
                  {event.currency === '0' ? (
                    formatWad(event.amount)
                  ) : (
                    <span>
                      {converter.weiToUsd(event.amount)?.toString()}{' '}
                      <span style={{ fontSize: '.8rem', fontWeight: 400 }}>
                        <CurrencySymbol currency="0" />
                        {formatWad(event.amount)}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(event.timestamp * 1000)}
                </div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    color: colors.bodySecondary,
                    marginTop: '.3rem',
                    lineHeight: contentLineHeight,
                  }}
                >
                  {event.payer}
                </div>
              </div>
            </div>

            {event.note ? (
              <div style={{ color: colors.bodySecondary, marginTop: 5 }}>
                "{event.note}"
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <div
          style={{
            color: colors.bodySecondary,
            paddingTop: 20,
            borderTop: '1px solid ' + colors.grapeHint,
          }}
        >
          No activity yet
        </div>
      )}
    </div>
  )
}
