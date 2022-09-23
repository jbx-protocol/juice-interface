import { MaxUint54 } from 'constants/numbers'
import { isValidMustStartAtOrAfter } from '../fundingCycle'

describe('fundingCycle utils', () => {
  describe('isValidMustStartAtOrAfter', () => {
    it.each`
      mustStartAtOrAfter  | duration            | isValid
      ${0}                | ${0}                | ${true}
      ${1}                | ${1}                | ${true}
      ${MaxUint54.sub(1)} | ${0}                | ${true}
      ${0}                | ${MaxUint54.sub(1)} | ${true}
      ${0}                | ${MaxUint54}        | ${false}
      ${MaxUint54}        | ${0}                | ${false}
      ${0}                | ${MaxUint54.add(1)} | ${false}
      ${MaxUint54.add(1)} | ${0}                | ${false}
    `('returns correct result', ({ mustStartAtOrAfter, duration, isValid }) => {
      expect(isValidMustStartAtOrAfter(mustStartAtOrAfter, duration)).toBe(
        isValid,
      )
    })
  })
})
