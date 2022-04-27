import { Trans } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'

import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'

export default function Dashboard404({
  projectId,
  ensName,
}: {
  projectId: BigNumber | string | undefined
  ensName?: string
}) {
  return (
    <div
      style={{
        padding: padding.app,
        height: '100%',
        ...layouts.centered,
      }}
    >
      <h2>
        {ensName ? (
          <Trans>Project for {ensName} not found</Trans>
        ) : (
          <Trans>Project {projectId} not found</Trans>
        )}
      </h2>
    </div>
  )
}
