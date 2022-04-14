import { BigNumber } from '@ethersproject/bignumber'

import {
  reservedRateFrom,
  formatReservedRate,
  MAX_RESERVED_RATE,
  MAX_DISCOUNT_RATE,
  formatDiscountRate,
  discountRateFrom,
  redemptionRateFrom,
  formatRedemptionRate,
  MAX_REDEMPTION_RATE,
  splitPercentFrom,
  formatSplitPercent,
  SPLITS_TOTAL_PERCENT,
  formatFee,
} from '../math'

describe('math', () => {
  describe.each`
    input      | output
    ${'100'}   | ${BigNumber.from(MAX_RESERVED_RATE)}
    ${'0'}     | ${BigNumber.from(0)}
    ${'1'}     | ${BigNumber.from(100)}
    ${'20'}    | ${BigNumber.from(2000)}
    ${'1.5'}   | ${BigNumber.from(150)}
    ${'10.69'} | ${BigNumber.from(1069)}
  `('reserved rate helpers', ({ input, output }) => {
    describe('reservedRateFrom', () => {
      it(`returns BigNumber from "${output.toString()}" when given "${input}"`, () => {
        expect(reservedRateFrom(input)).toEqual(output)
      })
    })

    describe('formatReservedRate', () => {
      it(`returns "${input}" when given BigNumber from "${output.toString()}"`, () => {
        expect(formatReservedRate(output)).toBe(input)
      })

      it('returns "0" when input is `undefined`', () => {
        expect(formatReservedRate(undefined)).toBe('0')
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigNumber.from(MAX_DISCOUNT_RATE)}
    ${'0'}     | ${BigNumber.from(0)}
    ${'1'}     | ${BigNumber.from(10000000)}
    ${'20'}    | ${BigNumber.from(200000000)}
    ${'1.5'}   | ${BigNumber.from(15000000)}
    ${'10.69'} | ${BigNumber.from(106900000)}
  `('discount rate helpers', ({ input, output }) => {
    describe('discountRateFrom', () => {
      it(`returns BigNumber from "${output.toString()}" when given "${input}"`, () => {
        expect(discountRateFrom(input)).toEqual(output)
      })
    })

    describe('formatDiscountRate', () => {
      it(`returns "${input}" when given BigNumber from "${output.toString()}"`, () => {
        expect(formatDiscountRate(output)).toBe(input)
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigNumber.from(MAX_REDEMPTION_RATE)}
    ${'0'}     | ${BigNumber.from(0)}
    ${'1'}     | ${BigNumber.from(100)}
    ${'20'}    | ${BigNumber.from(2000)}
    ${'1.5'}   | ${BigNumber.from(150)}
    ${'10.69'} | ${BigNumber.from(1069)}
  `('redemption rate helpers', ({ input, output }) => {
    describe('redemptionRateFrom', () => {
      it(`returns BigNumber from "${output.toString()}" when given "${input}"`, () => {
        expect(redemptionRateFrom(input)).toEqual(output)
      })
    })

    describe('formatRedemptionRate', () => {
      it(`returns "${input}" when given BigNumber from "${output.toString()}"`, () => {
        expect(formatRedemptionRate(output)).toBe(input)
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigNumber.from(SPLITS_TOTAL_PERCENT)}
    ${'0'}     | ${BigNumber.from(0)}
    ${'1'}     | ${BigNumber.from(10000000)}
    ${'20'}    | ${BigNumber.from(200000000)}
    ${'1.5'}   | ${BigNumber.from(15000000)}
    ${'10.69'} | ${BigNumber.from(106900000)}
  `('split percent helpers', ({ input, output }) => {
    describe('splitPercentFrom', () => {
      it(`returns BigNumber from "${output.toString()}" when given "${input}"`, () => {
        expect(splitPercentFrom(input)).toEqual(output)
      })
    })

    describe('formatSplitPercent', () => {
      it(`returns "${input}" when given BigNumber from "${output.toString()}"`, () => {
        expect(formatSplitPercent(output)).toBe(input)
      })
    })
  })

  describe('formatFee', () => {
    it('returns 2.5 when fee is 25,000,000', () => {
      expect(formatFee(BigNumber.from(25000000))).toBe('2.5')
    })
  })
})
