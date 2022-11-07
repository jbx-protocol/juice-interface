import { decodeEncodedIPFSUri, encodeIPFSUri } from '../ipfs'

describe('ipfs utilities', () => {
  describe('decodeEncodedIPFSUri', () => {
    it.each`
      encoded                                                                 | expectedDecoded
      ${'0x0000000000000000000000000000000000000000000000000000000000000000'} | ${'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'}
    `(
      'returns "$expectedDecoded" when hex is "$encoded"',
      ({ encoded, expectedDecoded }) => {
        expect(decodeEncodedIPFSUri(encoded)).toBe(expectedDecoded)
      },
    )
  })

  describe('encodeIPFSUri', () => {
    it.each`
      encoded                                             | expectedEncoded
      ${'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'} | ${'0x0000000000000000000000000000000000000000000000000000000000000000'}
    `(
      'returns "$expectedEncoded" when hex is "$encoded"',
      ({ encoded, expectedEncoded }) => {
        expect(encodeIPFSUri(encoded)).toBe(expectedEncoded)
      },
    )
  })
})
