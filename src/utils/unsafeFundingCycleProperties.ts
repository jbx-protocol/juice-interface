import * as constants from '@ethersproject/constants'

import { RESERVED_RATE_WARNING_THRESHOLD_PERCENT } from 'constants/fundingWarningText'

export default function unsafeFundingCycleProperties({
  ballotAddress,
  reservedRatePercentage,
  hasFundingDuration,
  allowMinting,
}: {
  ballotAddress: string | undefined
  reservedRatePercentage: number | undefined
  hasFundingDuration: boolean | undefined
  allowMinting: boolean | undefined
}) {
  // when we set one of these values to true, we're saying it's potentially unsafe.
  // This object is based on type FundingCycle
  const configFlags = {
    duration: false,
    ballot: false,
    allowMinting: false,
    metadataReservedRate: false,
    metadataMaxReservedRate: false,
  }

  /**
   * Ballot address is 0x0000.
   * Funding cycle reconfigurations can be created moments before a new cycle begins,
   * giving project owners an opportunity to take advantage of contributors, for example by withdrawing overflow.
   */
  if (ballotAddress === constants.AddressZero) {
    configFlags.ballot = true
  }

  /**
   * Duration not set. Reconfigurations can be made at any point without notice.
   */
  if (!hasFundingDuration) {
    configFlags.duration = true
  }

  /**
   * Token minting is enabled.
   * Any supply of tokens could be minted at any time by the project owners, diluting the token share of all existing contributors.
   */
  if (allowMinting) {
    configFlags.allowMinting = true
  }

  /**
   * Reserved rate is very high.
   * Contributors will receive a relatively small portion of tokens in exchange for paying the project.
   */
  if ((reservedRatePercentage ?? 0) > RESERVED_RATE_WARNING_THRESHOLD_PERCENT) {
    configFlags.metadataReservedRate = true
  }

  /**
   * Reserved rate is maximum (100%).
   * Contributors will receive no tokens in exchange for paying the project.
   */
  if (reservedRatePercentage === 100) {
    configFlags.metadataReservedRate = false
    configFlags.metadataMaxReservedRate = true
  }

  return configFlags
}
