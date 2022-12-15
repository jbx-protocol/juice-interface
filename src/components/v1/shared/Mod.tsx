import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { AllocatorBadge } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/AllocatorBadge'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import {
  NULL_ALLOCATOR_ADDRESS,
  V1_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'
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

  const _mod = mod as PayoutMod
  const projectId = _mod.projectId as BigNumber
  const allocator = _mod.allocator

  const isV1Project = projectId && allocator === NULL_ALLOCATOR_ADDRESS
  const isV3Project = projectId && allocator === V1_V3_ALLOCATOR_ADDRESS

  return (
    <div className="mb-1 flex items-baseline justify-between">
      <div className="leading-6">
        <div className="flex items-baseline">
          {projectId?.gt(0) ? (
            <div>
              <div className="font-medium">
                {isV1Project ? (
                  <V1ProjectHandle projectId={projectId} />
                ) : isV3Project ? (
                  <Space size="middle">
                    <V2V3ProjectHandleLink projectId={projectId.toNumber()} />
                    <AllocatorBadge allocator={allocator} />
                  </Space>
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
