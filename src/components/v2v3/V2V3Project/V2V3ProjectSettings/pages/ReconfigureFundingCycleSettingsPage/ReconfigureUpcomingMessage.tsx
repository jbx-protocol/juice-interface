import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Callout } from 'components/Callout'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

import { detailedTimeString, secondsUntil } from 'utils/format/formatTime'

import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'

export default function V2V3ReconfigureUpcomingMessage() {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  if (!fundingCycle) return null

  const currentFCNumber = fundingCycle.number.toNumber()

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const ballotStrategyLength = ballotStrategy.durationSeconds

  const duration = fundingCycle.duration.toNumber()

  const secondsUntilNextFC = secondsUntil(fundingCycle.start.add(duration))

  let message

  // Separating the full message out like this for translation purposes
  // (they need full sentences, can't chop and change)
  if (!duration || duration === 0) {
    // If duration is unset/0, changes take effect immediately to current FC
    message = (
      <Trans>
        Your project's current cycle has no duration. Edits you make below will
        take effect immediately.
      </Trans>
    )
  } else if (ballotStrategyLength === undefined) {
    message = (
      <Trans>
        The edits you make below may take effect, depending on the project's
        custom edit deadline contract.
      </Trans>
    )
  } else if (ballotStrategyLength > secondsUntilNextFC) {
    message = (
      <Trans>
        Due to your <strong>{ballotStrategy.name}</strong> contract, edits you
        make will not take effect until the first funding cycle which starts at
        least{' '}
        <strong>
          {detailedTimeString({
            timeSeconds: BigNumber.from(ballotStrategyLength),
            fullWords: true,
          })}
        </strong>{' '}
        from now.
      </Trans>
    )
  } else {
    message = (
      <>
        <div>
          <Trans>
            Your edits will take effect in{' '}
            <strong>cycle #{currentFCNumber + 1}</strong>. The current cycle (#
            {currentFCNumber}) won't be altered.
          </Trans>
        </div>
        <br />
        <div>
          <Trans>Time remaining for edits to affect the next cycle:</Trans>
        </div>
        <div>
          <strong>
            {detailedTimeString({
              timeSeconds: BigNumber.from(
                secondsUntilNextFC - ballotStrategyLength,
              ),
              fullWords: true,
            })}
          </strong>
          .
        </div>
      </>
    )
  }

  return !message ? null : <Callout.Info>{message}</Callout.Info>
}
