import { isEqualAddress, isZeroAddress } from 'utils/address'

describe('address utilities', () => {
  describe('isEqualAddress', () => {
    it.each`
      addressA                                        | addressB                                        | expectedIsEqual
      ${undefined}                                    | ${undefined}                                    | ${false}
      ${''}                                           | ${''}                                           | ${false}
      ${'not address'}                                | ${'not address'}                                | ${false}
      ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${undefined}                                    | ${false}
      ${undefined}                                    | ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${false}
      ${'0x0028c35095d34c9c8a3bc84cb8542cb182fcfa8e'} | ${'0x0000000000000000000000000000000000000000'} | ${false}
      ${'0x0000000000000000000000000000000000000000'} | ${'0x0028c35095d34c9c8a3bc84cb8542cb182fcfa8e'} | ${false}
      ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${true}
      ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${'0x0028c35095d34c9c8a3bc84cb8542cb182fcfa8e'} | ${true}
      ${'0x0028c35095d34c9c8a3bc84cb8542cb182fcfa8e'} | ${'0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e'} | ${true}
    `(
      'returns "$expectedIsEqual" when addressA is "$addressA" and addressB is "$addressB"',
      ({ addressA, addressB, expectedIsEqual }) => {
        expect(isEqualAddress(addressA, addressB)).toBe(expectedIsEqual)
      },
    )
  })

  describe('isZeroAddress', () => {
    it.each`
      address                                         | expectedIsZero
      ${undefined}                                    | ${false}
      ${''}                                           | ${false}
      ${'0x00'}                                       | ${false}
      ${'0x0028c35095d34c9c8a3bc84cb8542cb182fcfa8e'} | ${false}
      ${'0x0000000000000000000000000000000000000000'} | ${true}
    `(
      'returns "$expectedIsZero" when address is "$address"',
      ({ address, expectedIsZero }) => {
        expect(isZeroAddress(address)).toBe(expectedIsZero)
      },
    )
  })
})
