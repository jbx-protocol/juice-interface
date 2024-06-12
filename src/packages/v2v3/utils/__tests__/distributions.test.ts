import { Split } from 'models/splits'
import {
  amountFromPercent,
  deriveAmountAfterFee,
  deriveAmountBeforeFee,
  getTotalSplitsPercentage,
} from '../distributions'

const dummySplit: Omit<Split, 'percent'> = {
  beneficiary: 'bob',
  preferClaimed: false,
  lockedUntil: 0,
  projectId: '0x00',
  allocator: '0x000000000000000000',
}

describe('Distributions utils', () => {
  describe('deriveAmountAfterFee', () => {
    it.each`
      amount | expected
      ${100} | ${97.5}
      ${200} | ${195}
      ${50}  | ${48.75}
    `('should calculate amount after fee correctly', ({ amount, expected }) => {
      expect(deriveAmountAfterFee(amount)).toBeCloseTo(expected, 2)
    })
  })

  describe('deriveAmountBeforeFee', () => {
    it.each`
      amount   | expected
      ${97.5}  | ${100}
      ${195}   | ${200}
      ${48.75} | ${50}
    `(
      'should calculate amount before fee correctly',
      ({ amount, expected }) => {
        expect(deriveAmountBeforeFee(amount)).toBeCloseTo(expected, 2)
      },
    )
  })

  describe('getTotalSplitsPercentage', () => {
    it('should sum up all split percentages', () => {
      const splits = [
        { percent: 100000000, ...dummySplit },
        { percent: 200000000, ...dummySplit },
        { percent: 300000000, ...dummySplit },
      ]

      expect(getTotalSplitsPercentage(splits)).toBe(60)
    })
  })
  describe('amountFromPercent', () => {
    it.each`
      percent | amount    | expected
      ${10}   | ${'1000'} | ${100}
      ${20}   | ${'2000'} | ${400}
      ${5}    | ${'100'}  | ${5}
    `(
      'should correctly derive amount from percent',
      ({ percent, amount, expected }) => {
        expect(amountFromPercent({ percent, amount })).toBeCloseTo(expected, 2)
      },
    )
  })
})
