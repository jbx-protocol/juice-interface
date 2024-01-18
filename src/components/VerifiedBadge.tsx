import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

const JUICEBOX_VERIFIED_PROJECTS: Record<NetworkName, number[]> = {
  [NetworkName.goerli]: [],
  [NetworkName.localhost]: [],
  [NetworkName.mainnet]: [],
}

type VerifiedBadgeProps = {
  className?: string
  projectId?: number
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  className,
  projectId,
}) => {
  const isVerified = useMemo(
    () =>
      projectId
        ? JUICEBOX_VERIFIED_PROJECTS[readNetwork.name].includes(projectId)
        : false,
    [projectId],
  )

  if (!isVerified) return null

  return (
    <Tooltip
      title={
        <span className="text-xs">
          <Trans>This project has been verified by Juicebox</Trans>
        </span>
      }
    >
      <CheckBadgeIcon
        className={twMerge('h-7 w-7 fill-bluebs-500', className)}
      />
    </Tooltip>
  )
}
