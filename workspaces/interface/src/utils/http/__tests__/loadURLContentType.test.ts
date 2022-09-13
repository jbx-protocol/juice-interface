import axios from 'axios'
import { v4 } from 'uuid'

import { loadURLContentType } from '../loadURLContentType'

const axiosSpy = jest.spyOn(axios, 'get')

describe('loadURLContentType', () => {
  it('returns undefined if input is undefined', async () => {
    await expect(loadURLContentType(undefined)).resolves.toEqual(undefined)
  })

  it('returns undefined on request error', async () => {
    axiosSpy.mockImplementation(() => {
      throw 'Error'
    })
    await expect(loadURLContentType('')).resolves.toEqual(undefined)
  })

  it('returns contentType on request', async () => {
    const contentType = v4()
    axiosSpy.mockImplementation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { headers: { 'content-type': contentType } } as any
    })
    await expect(loadURLContentType('')).resolves.toEqual(contentType)
  })
})
