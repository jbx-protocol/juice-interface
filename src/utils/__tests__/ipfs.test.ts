import {
  convertToV1CID,
  decodeEncodedIpfsUri,
  encodeIpfsUri,
  ethSucksGatewayUrl,
  ipfsUriToGatewayUrl,
  pinataToGatewayUrl,
} from '../ipfs'

const CID = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'

describe('ipfs gateway urls', () => {
  // The gateway serves the subdomain form. Its path form
  // (`ipfs.banny.eth.sucks/ipfs/<cid>`) answers 410 Gone, which is what left
  // every project logo and NFT tier image broken.
  it('addresses eth.sucks by subdomain with a v1 CID', () => {
    expect(ethSucksGatewayUrl(CID)).toBe(`https://${convertToV1CID(CID)}.eth.sucks/`)
    expect(ethSucksGatewayUrl(CID)).not.toContain('/ipfs/')
  })

  it('routes ipfs:// uris there', () => {
    expect(ipfsUriToGatewayUrl(`ipfs://${CID}`)).toBe(ethSucksGatewayUrl(CID))
  })

  it('rewrites urls on the retired dedicated gateway', () => {
    expect(pinataToGatewayUrl(`https://jbx.mypinata.cloud/ipfs/${CID}`)).toBe(
      ethSucksGatewayUrl(CID),
    )
  })

  it('leaves other urls alone', () => {
    expect(pinataToGatewayUrl('https://example.com/logo.png')).toBe(
      'https://example.com/logo.png',
    )
  })
})

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
