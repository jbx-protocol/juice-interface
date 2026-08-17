import axios from 'axios'
import { IPFS_GATEWAY_HOSTNAMES } from 'constants/ipfs'

import { findProjectMetadata } from '../findProjectMetadata'

jest.mock('axios')

const mockedGet = axios.get as jest.Mock
const CID = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'

const gatewayOf = (call: unknown[]) => new URL(String(call[0])).hostname

describe('findProjectMetadata', () => {
  beforeEach(() => {
    mockedGet.mockReset()
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('offers more than one gateway to read from', () => {
    expect(IPFS_GATEWAY_HOSTNAMES.length).toBeGreaterThan(1)
  })

  it('falls through to the next gateway when one stops resolving', async () => {
    // What actually happened in production: the configured gateway's DNS record
    // went away, so every read threw ENOTFOUND.
    const dead = Object.assign(new Error('getaddrinfo ENOTFOUND'), {
      code: 'ENOTFOUND',
    })
    mockedGet
      .mockRejectedValueOnce(dead)
      .mockResolvedValueOnce({ data: { name: 'Test Project', version: 1 } })

    const metadata = await findProjectMetadata({ metadataCid: CID })

    expect(metadata.name).toBe('Test Project')
    expect(gatewayOf(mockedGet.mock.calls[0])).toBe(IPFS_GATEWAY_HOSTNAMES[0])
    expect(gatewayOf(mockedGet.mock.calls[1])).toBe(IPFS_GATEWAY_HOSTNAMES[1])
  })

  it('retries a gateway that is rate limiting before moving on', async () => {
    const rateLimited = { response: { status: 429 } }
    mockedGet
      .mockRejectedValueOnce(rateLimited)
      .mockResolvedValueOnce({ data: { name: 'Test Project', version: 1 } })

    await findProjectMetadata({ metadataCid: CID })

    expect(gatewayOf(mockedGet.mock.calls[0])).toBe(IPFS_GATEWAY_HOSTNAMES[0])
    expect(gatewayOf(mockedGet.mock.calls[1])).toBe(IPFS_GATEWAY_HOSTNAMES[0])
  })

  it('surfaces the failure only once every gateway has been tried', async () => {
    const notFound = { response: { status: 404 }, message: 'not found' }
    mockedGet.mockRejectedValue(notFound)

    await expect(findProjectMetadata({ metadataCid: CID })).rejects.toBe(
      notFound,
    )
    expect(mockedGet).toHaveBeenCalledTimes(IPFS_GATEWAY_HOSTNAMES.length)
  })
})
