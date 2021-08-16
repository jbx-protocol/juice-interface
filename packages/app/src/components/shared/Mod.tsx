import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'

import FormattedAddress from './FormattedAddress'
import ProjectHandle from './ProjectHandle'
import TooltipLabel from './TooltipLabel'

export default function Mod({
  mod,
  value,
  isOwner,
}: {
  mod: PayoutMod | TicketMod | undefined
  value: string | JSX.Element
  isOwner?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
                @
                {(mod as PayoutMod).projectId ? (
                  <ProjectHandle
                    projectId={(mod as PayoutMod).projectId as BigNumber}
                  />
                ) : (
                  '--'
                )}
              </div>
              <div
                style={{
                  fontSize: '.8rem',
                  color: colors.text.secondary,
                  marginLeft: 10,
                }}
              >
                <TooltipLabel
                  label={'Tokens:'}
                  tip={`This address will receive any tokens minted when the recipient project gets paid.`}
                />{' '}
                <FormattedAddress address={mod.beneficiary} />
              </div>
            </div>
          ) : (
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={mod.beneficiary} />
            </div>
          )}
          {isOwner && (
            <span style={{ marginLeft: 5 }}>
              <Tooltip title="Project owner">
                <CrownFilled />
              </Tooltip>
            </span>
          )}
          :
        </div>
        {mod.lockedUntil ? (
          <div style={{ fontSize: '.8rem', color: colors.text.secondary }}>
            <LockOutlined /> until{' '}
            {mod.lockedUntil
              ? formatDate(mod.lockedUntil * 1000, 'MM-DD-yyyy')
              : null}
          </div>
        ) : null}{' '}
      </div>
      <div>{value}</div>
    </div>
  )
}
