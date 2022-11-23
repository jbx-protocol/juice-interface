import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { formatDate } from 'utils/format/formatDate'

import V1ProjectHandle from './V1ProjectHandle'

export default function Mod({
  mod,
  value,
}: {
  mod: PayoutMod | TicketMod | undefined
  value: string | JSX.Element
}) {
  const { owner } = useContext(V1ProjectContext)

  if (!mod) return null

  return (
    <div className="mb-1 flex items-baseline justify-between">
      <div className="leading-6">
        <div className="flex items-baseline">
          {(mod as PayoutMod).projectId &&
          BigNumber.from((mod as PayoutMod).projectId).gt(0) ? (
            <div>
              <div className="font-medium">
                {(mod as PayoutMod).projectId ? (
                  <V1ProjectHandle
                    projectId={(mod as PayoutMod).projectId as BigNumber}
                  />
                ) : (
                  '--'
                )}
                :
              </div>
              <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
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
            <div className="flex items-baseline font-medium">
              <FormattedAddress address={mod.beneficiary} />
              {owner === mod.beneficiary && (
                <span className="ml-1">
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
          <div className="text-sm text-grey-500 dark:text-grey-300">
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
