import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
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

  // Separating the full message out like this for translation purposes
  // (they need full sentences, can't chop and change)
  if (!duration || duration === 0) {
    // If duration is unset/0, changes take effect immediately to current FC
    return (
      <Trans>
        Your project's current funding cycle has no duration. Changes you make
        below will take effect immediately.
      </Trans>
    )
  } else if (ballotStrategyLength === undefined) {
    return (
      <Trans>
        Changes will take effect according to the project's custom ballot
        contract.
      </Trans>
    )
  } else if (ballotStrategyLength > secondsUntilNextFC) {
    return (
      <Trans>
        Changes you make will take effect according to your{' '}
        <strong>{ballotStrategy.name}</strong> reconfiguration rule (the first
        funding cycle following{' '}
        <strong>
          {detailedTimeString({
            timeSeconds: BigNumber.from(ballotStrategyLength),
            fullWords: true,
          })}
        </strong>{' '}
        from now).
      </Trans>
    )
  } else {
    return (
      <>
        <div>
          <Trans>
            Any changes you make will take effect in{' '}
            <strong>funding cycle #{currentFCNumber + 1}</strong>. The current
            funding cycle (#{currentFCNumber}) won't be altered.
          </Trans>
        </div>
        <br />
        <div>
          <Trans>
            Time remaining for changes made to affect the next funding cycle:
          </Trans>
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
}
