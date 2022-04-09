import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { BigNumber } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'

import FormattedAddress from './FormattedAddress'
import V1ProjectHandle from '../v1/shared/V1ProjectHandle'
import TooltipLabel from './TooltipLabel'

export default function Mod({
  mod,
  value,
}: {
  mod: PayoutMod | TicketMod | undefined
  value: string | JSX.Element
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { owner } = useContext(V1ProjectContext)

  if (!mod) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}
    >
      <div style={{ lineHeight: 1.4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {(mod as PayoutMod).projectId &&
          BigNumber.from((mod as PayoutMod).projectId).gt(0) ? (
            <div>
              <div style={{ fontWeight: 500 }}>
                {(mod as PayoutMod).projectId ? (
                  <V1ProjectHandle
                    projectId={(mod as PayoutMod).projectId as BigNumber}
                  />
                ) : (
                  '--'
                )}
                :
              </div>
              <div
                style={{
                  fontSize: '.8rem',
                  color: colors.text.secondary,
                  marginLeft: 10,
                }}
              >
                <TooltipLabel
                  label={t`Tokens` + ':'}
                  tip={t`This address will receive any tokens minted when the recipient project gets paid.`}
                />{' '}
                <FormattedAddress address={mod.beneficiary} />{' '}
                {owner === mod.beneficiary && (
                  <Tooltip title={t`Project owner`}>
                    <CrownFilled />
                  </Tooltip>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                fontWeight: 500,
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              <FormattedAddress address={mod.beneficiary} />
              {owner === mod.beneficiary && (
                <span style={{ marginLeft: 5 }}>
                  <Tooltip title={t`Project owner`}>
                    <CrownFilled />
                  </Tooltip>
                </span>
              )}
              :
            </div>
          )}
        </div>
        {mod.lockedUntil ? (
          <div style={{ fontSize: '.8rem', color: colors.text.secondary }}>
            <LockOutlined /> <Trans>until</Trans>{' '}
            {mod.lockedUntil
              ? formatDate(mod.lockedUntil * 1000, 'yyyy-MM-DD')
              : null}
          </div>
        ) : null}{' '}
      </div>
      <div>{value}</div>
    </div>
  )
}
