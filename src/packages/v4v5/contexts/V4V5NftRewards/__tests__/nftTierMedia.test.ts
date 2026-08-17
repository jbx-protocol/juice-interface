import axios from 'axios'
import { ethSucksGatewayUrl, pinataGatewayUrl } from 'utils/ipfs'

import { fetchTierMetadata, liveMediaUrl } from '../tierMedia'

jest.mock('axios')

const mockedGet = axios.get as jest.Mock
const CID = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'

describe('NFT tier media', () => {
  beforeEach(() => {
    mockedGet.mockReset()
    jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => jest.restoreAllMocks())

  it('walks to the next gateway when one fails', async () => {
    mockedGet
      .mockRejectedValueOnce(new Error('410'))
      .mockResolvedValueOnce({ data: { name: 'Tier 1' } })

    await expect(fetchTierMetadata(CID)).resolves.toEqual({ name: 'Tier 1' })
    expect(mockedGet).toHaveBeenCalledTimes(2)
    expect(mockedGet.mock.calls[0][0]).toBe(ethSucksGatewayUrl(CID))
  })

  it('falls all the way through to Pinata', async () => {
    mockedGet
      .mockRejectedValueOnce(new Error('down'))
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce({ data: { name: 'Tier 1' } })

    await fetchTierMetadata(CID)
    expect(mockedGet.mock.calls[2][0]).toBe(pinataGatewayUrl(CID))
  })

  it('throws once every gateway has been tried', async () => {
    mockedGet.mockRejectedValue(new Error('down'))
    await expect(fetchTierMetadata(CID)).rejects.toThrow('down')
    expect(mockedGet).toHaveBeenCalledTimes(3)
  })

  it.each([
    `https://jbx.mypinata.cloud/ipfs/${CID}`,
    `https://jbm.infura-ipfs.io/ipfs/${CID}`,
    `https://cid.v2ex.pro/ipfs/${CID}`,
    `https://ipfs.banny.eth.sucks/ipfs/${CID}`,
  ])('re-points media stored on a retired gateway (%s)', image => {
    expect(liveMediaUrl(image)).toBe(ethSucksGatewayUrl(CID))
  })

  it('leaves media on a live host alone', () => {
    expect(liveMediaUrl('https://example.com/tier.png')).toBe(
      'https://example.com/tier.png',
    )
    expect(liveMediaUrl('data:image/svg+xml;base64,abc')).toBe(
      'data:image/svg+xml;base64,abc',
    )
  })
})
