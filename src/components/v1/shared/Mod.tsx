import { CrownFilled, LockOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import TooltipLabel from 'components/TooltipLabel'
import V2V3ProjectLink from 'components/v2v3/shared/V2V3ProjectLink'
import {
  NULL_ALLOCATOR_ADDRESS,
  V1_V3_ALLOCATOR_ADDRESS,
} from 'constants/contracts/mainnet/Allocators'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import { PayoutMod, TicketMod } from 'models/v1/mods'
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
                  <Space size="small">
                    <V2V3ProjectLink
                      projectId={projectId.toNumber()}
                      allocator={allocator}
                    />
                  </Space>
                ) : (
                  '--'
                )}
                :
              </div>
              {isV1Project ? (
                <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
                  <TooltipLabel
                    label={t`Tokens` + ':'}
                    tip={t`This address will receive any tokens minted when the recipient project gets paid.`}
                  />{' '}
                  <EthereumAddress address={mod.beneficiary} />{' '}
                  {owner === mod.beneficiary && (
                    <Tooltip title={t`Project owner`}>
                      <CrownFilled />
                    </Tooltip>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-baseline font-medium">
              <EthereumAddress address={mod.beneficiary} />
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
