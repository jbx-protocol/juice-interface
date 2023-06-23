/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateNewPayAmount } from './useRewardEligibilityCallout'

describe('calculateNewPayAmount', () => {
  it.each`
    payAmountEth | eligibleRewards                   | expected
    ${0.1}       | ${[]}                             | ${0.1}
    ${0.1}       | ${[0.1]}                          | ${0}
    ${0.1}       | ${[0.05]}                         | ${0.05}
    ${0.1}       | ${[0.05, 0.05]}                   | ${0}
    ${1}         | ${[0.05, 0.05, 0.05]}             | ${0.85}
    ${1}         | ${[0.05, 0.05, 0.05, 0.05]}       | ${0.8}
    ${100}       | ${[0.05, 0.05, 0.05, 0.05, 0.05]} | ${99.75}
    ${48.46794}  | ${[0.05, 0.05, 0.05, 0.05, 0.05]} | ${48.21794}
  `(
    'should return $expected when payAmountEth is $payAmountEth and eligibleRewards is $eligibleRewards',
    ({ payAmountEth, eligibleRewards, expected }) => {
      const eliRewards = eligibleRewards.map((contributionFloor: any) => ({
        contributionFloor,
      }))
      expect(calculateNewPayAmount(payAmountEth, eliRewards)).toEqual(expected)
    },
  )
})
