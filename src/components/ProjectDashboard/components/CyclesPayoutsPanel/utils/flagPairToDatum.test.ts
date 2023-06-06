/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { flagPairToDatum } from './flagPairToDatum'

jest.mock('./flagPairToDatum', () => ({
  flagPairToDatum: jest.fn(),
}))

describe('flagPairToDatum', () => {
  beforeEach(() => {
    ;(flagPairToDatum as jest.Mock).mockClear()
    ;(flagPairToDatum as jest.Mock).mockImplementation(
      (name, current, upcoming) => ({ name, current, upcoming }),
    )
  })

  it.each([
    ['Name', true, false],
    ['Name', false, true],
    ['Name', undefined, false],
    ['Name', undefined, true],
    ['Name', undefined, undefined],
    ['Name', undefined, null],
    ['Name', true, undefined],
    ['Name', false, undefined],
    ['Name', true, null],
    ['Name', false, null],
  ])(
    'calls flagPairToDatum with the correct arguments',
    (name, current, upcoming) => {
      flagPairToDatum(name, current, upcoming)

      expect(flagPairToDatum).toHaveBeenCalledWith(name, current, upcoming)
    },
  )
})
