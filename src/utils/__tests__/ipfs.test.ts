import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

import {
  decodeEncodedIpfsUri,
  encodeIpfsUri,
  ipfsUriToGatewayUrl,
  pinataToGatewayUrl,
} from '../ipfs'

const CID = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'

describe('ipfs gateway urls', () => {
  // Both of these used to resolve to gateways that stopped serving: the
  // dedicated Pinata one is NXDOMAIN and eth.sucks answers 410, so every image
  // routed through them rendered broken.
  it('routes ipfs:// uris at the read gateway', () => {
    expect(ipfsUriToGatewayUrl(`ipfs://${CID}`)).toBe(
      `https://${OPEN_IPFS_GATEWAY_HOSTNAME}/ipfs/${CID}`,
    )
  })

  it('rewrites urls on the retired dedicated gateway', () => {
    expect(pinataToGatewayUrl(`https://jbx.mypinata.cloud/ipfs/${CID}`)).toBe(
      `https://${OPEN_IPFS_GATEWAY_HOSTNAME}/ipfs/${CID}`,
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
