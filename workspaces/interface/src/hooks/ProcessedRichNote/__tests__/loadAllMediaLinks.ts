import * as loadURLContentTypeContainer from 'utils/http/loadURLContentType'
import { v4 } from 'uuid'

import { loadAllMediaLinks } from '../loadAllMediaLinks'

const loadURLContentTypeSpy = jest.spyOn(
  loadURLContentTypeContainer,
  'loadURLContentType',
)

jest.mock('utils/http/loadURLContentType')

describe('loadAllMediaLinks', () => {
  it('returns empty if input lines contain no items', async () => {
    await expect(loadAllMediaLinks(['', '', ''])).resolves.toEqual([
      undefined,
      undefined,
      undefined,
    ])
  })

  it('returns undefined if contentType is not found', async () => {
    loadURLContentTypeSpy.mockImplementation(async () => undefined)
    await expect(loadAllMediaLinks(['foobar'])).resolves.toEqual([undefined])
  })

  it.each(['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/svg'])(
    'returns link if content type is %p',
    async contentType => {
      loadURLContentTypeSpy.mockImplementation(async () => contentType)
      await expect(loadAllMediaLinks(['foobar'])).resolves.toEqual(['foobar'])
    },
  )

  it('converts successfully', async () => {
    loadURLContentTypeSpy.mockImplementation(async () => 'image/jpeg')
    const input = ['foo', 'bar', v4(), v4(), v4(), v4()]
    await expect(loadAllMediaLinks(input)).resolves.toEqual(input)
  })

  it('strips successfully', async () => {
    loadURLContentTypeSpy
      .mockImplementationOnce(async () => 'image/jpeg')
      .mockImplementation(async () => '')
    await expect(loadAllMediaLinks(['foo', 'bar'])).resolves.toEqual(['foo'])
  })
})
