import { Trans } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

import { getEffectedFCNumberAfterReconfig } from 'utils/v2/fundingCycle'

export default function V2ReconfigureUpcomingMessage() {
  const { fundingCycle } = useContext(V2ProjectContext)
  if (!fundingCycle) return null

  const currentFCNumber = fundingCycle.number.toNumber()

  const effectedFCNumber = getEffectedFCNumberAfterReconfig({
    currentFundingCycle: fundingCycle,
  })

  let message: JSX.Element

  // Separating the full message out like this for translation purposes
  // (they need full sentences, can't chop and change)
  if (effectedFCNumber === undefined) {
    message = (
      <Trans>
        Changes will take effect according to the custom reconfiguration rule
        you are using.
      </Trans>
    )
  } else if (effectedFCNumber === currentFCNumber) {
    message = (
      <Trans>
        Because you do not have a funding cycle duration, changes you make will
        take effect immediately.
      </Trans>
    )
  } else if (effectedFCNumber > currentFCNumber + 1) {
    message = (
      <Trans>
        Any changes you make will take effect in FC #{effectedFCNumber}. The
        current funding cycle (#{currentFCNumber}) and any intermediate funding
        cycles won't be altered.
      </Trans>
    )
  } else {
    message = (
      <Trans>
        Any changes you make will take effect in FC #{effectedFCNumber}. The
        current funding cycle (#{currentFCNumber}) won't be altered.
      </Trans>
    )
  }

  return message
}
