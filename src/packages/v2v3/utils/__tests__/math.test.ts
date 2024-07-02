import {
  discountRateFrom,
  formatDiscountRate,
  formatFee,
  formatRedemptionRate,
  formatReservedRate,
  formatSplitPercent,
  MAX_DISCOUNT_RATE,
  MAX_REDEMPTION_RATE,
  MAX_RESERVED_RATE,
  redemptionRateFrom,
  reservedRateFrom,
  splitPercentFrom,
  SPLITS_TOTAL_PERCENT,
} from '../math'

describe('math', () => {
  describe.each`
    input      | output
    ${'100'}   | ${BigInt(MAX_RESERVED_RATE)}
    ${'0'}     | ${BigInt(0)}
    ${'1'}     | ${BigInt(100)}
    ${'20'}    | ${BigInt(2000)}
    ${'1.5'}   | ${BigInt(150)}
    ${'10.69'} | ${BigInt(1069)}
  `('reserved rate helpers', ({ input, output }) => {
    describe('reservedRateFrom', () => {
      it(`returns BigInt "${output.toString()}" when given "${input}"`, () => {
        expect(reservedRateFrom(input)).toEqual(output)
      })
    })

    describe('formatReservedRate', () => {
      it(`returns "${input}" when given BigInt "${output.toString()}"`, () => {
        expect(formatReservedRate(output)).toBe(input)
      })

      it('returns "0" when input is `undefined`', () => {
        expect(formatReservedRate(undefined)).toBe('0')
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigInt(MAX_DISCOUNT_RATE)}
    ${'0'}     | ${BigInt(0)}
    ${'1'}     | ${BigInt(10000000)}
    ${'20'}    | ${BigInt(200000000)}
    ${'1.5'}   | ${BigInt(15000000)}
    ${'10.69'} | ${BigInt(106900000)}
  `('discount rate helpers', ({ input, output }) => {
    describe('discountRateFrom', () => {
      it(`returns BigInt "${output.toString()}" when given "${input}"`, () => {
        expect(discountRateFrom(input)).toEqual(output)
      })
    })

    describe('formatDiscountRate', () => {
      it(`returns "${input}" when given BigInt "${output.toString()}"`, () => {
        expect(formatDiscountRate(output)).toBe(input)
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigInt(MAX_REDEMPTION_RATE)}
    ${'0'}     | ${BigInt(0)}
    ${'1'}     | ${BigInt(100)}
    ${'20'}    | ${BigInt(2000)}
    ${'1.5'}   | ${BigInt(150)}
    ${'10.69'} | ${BigInt(1069)}
  `('redemption rate helpers', ({ input, output }) => {
    describe('redemptionRateFrom', () => {
      it(`returns BigInt "${output.toString()}" when given "${input}"`, () => {
        expect(redemptionRateFrom(input)).toEqual(output)
      })
    })

    describe('formatRedemptionRate', () => {
      it(`returns "${input}" when given BigInt "${output.toString()}"`, () => {
        expect(formatRedemptionRate(output)).toBe(input)
      })
    })
  })

  describe.each`
    input      | output
    ${'100'}   | ${BigInt(SPLITS_TOTAL_PERCENT)}
    ${'0'}     | ${BigInt(0)}
    ${'1'}     | ${BigInt(10000000)}
    ${'20'}    | ${BigInt(200000000)}
    ${'1.5'}   | ${BigInt(15000000)}
    ${'10.69'} | ${BigInt(106900000)}
  `('split percent helpers', ({ input, output }) => {
    describe('splitPercentFrom', () => {
      it(`returns BigInt "${output.toString()}" when given "${input}"`, () => {
        expect(splitPercentFrom(input)).toEqual(output)
      })
    })

    describe('formatSplitPercent', () => {
      it(`returns "${input}" when given BigInt "${output.toString()}"`, () => {
        expect(formatSplitPercent(output)).toBe(input)
      })
    })
  })

  describe('formatFee', () => {
    it('returns 2.5 when fee is 25,000,000', () => {
      expect(formatFee(BigInt(25000000))).toBe('2.5')
    })
  })
})
