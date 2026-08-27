import { metadataFromPageHtml } from '../recoverProjectMetadata'

describe('metadataFromPageHtml', () => {
  it('reads the server-rendered metadata out of a project page', () => {
    const html = `<html><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
      { props: { pageProps: { metadata: { name: 'Defend Roman Storm' } } } },
    )}</script></body></html>`
    expect(metadataFromPageHtml(html)?.name).toBe('Defend Roman Storm')
  })

  it('returns undefined for a 404 render', () => {
    const html =
      '<script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"statusCode":404}}}</script>'
    expect(metadataFromPageHtml(html)).toBeUndefined()
  })
})
