import { formatAmount, formatAmountWithScale } from './formatAmount'

describe('formatAmount', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [1.5, '1.5'],
    [1234567890, '1,234,567,890'],
    [1234567890.123, '1,234,567,890.12'],
    ['1234567890.123', '1,234,567,890.12'],
  ])('formatAmount(%s) returns %s', (input, expected) => {
    expect(formatAmount(input)).toEqual(expected)
  })
})

describe('formatAmountWithScale', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [1.5, '1.5'],
    [1234567890, '1.23B'],
    [1234567890.123, '1.23B'],
    ['1234567890.123', '1.23B'],
    [1234567.89, '1.23M'],
    [1234.56789, '1.23K'],
  ])('formatAmountWithScale(%s) returns %s', (input, expected) => {
    expect(formatAmountWithScale(input)).toEqual(expected)
  })
})
