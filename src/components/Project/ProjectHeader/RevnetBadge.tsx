import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import Image from 'next/legacy/image'
import revnetLogo from '/public/assets/images/revnet.png'

export function RevnetBadge() {
  return (
    <Tooltip
      placement="bottom"
      title={<Trans>This project is a Revnet</Trans>}
    >
      <span className="flex h-4 w-4">
        <Image src={revnetLogo} alt="Revnet" width={16} height={16} />
      </span>
    </Tooltip>
  )
}
