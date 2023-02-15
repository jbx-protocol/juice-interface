import { decodeEncodedIpfsUri, encodeIpfsUri } from '../ipfs'

describe('ipfs utilities', () => {
  describe('decodeEncodedIpfsUri', () => {
    it.each`
      encoded                                                                 | expectedDecoded
      ${'0x0000000000000000000000000000000000000000000000000000000000000000'} | ${'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'}
    `(
      'returns "$expectedDecoded" when hex is "$encoded"',
      ({ encoded, expectedDecoded }) => {
        expect(decodeEncodedIpfsUri(encoded)).toBe(expectedDecoded)
      },
    )
  })

  describe('encodeIpfsUri', () => {
    it.each`
      encoded                                             | expectedEncoded
      ${'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'} | ${'0x0000000000000000000000000000000000000000000000000000000000000000'}
    `(
      'returns "$expectedEncoded" when hex is "$encoded"',
      ({ encoded, expectedEncoded }) => {
        expect(encodeIpfsUri(encoded)).toBe(expectedEncoded)
      },
    )
  })
})
