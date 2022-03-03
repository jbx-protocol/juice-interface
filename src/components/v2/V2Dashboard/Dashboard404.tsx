import { Trans } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'

import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'

export default function Dashboard404({ projectId }: { projectId: BigNumber }) {
  return (
    <div
      style={{
        padding: padding.app,
        height: '100%',
        ...layouts.centered,
      }}
    >
      <h2>
        <Trans>Project {projectId} not found</Trans>
      </h2>
    </div>
  )
}
