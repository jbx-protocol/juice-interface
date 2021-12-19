import type { HTMLRewriterDecorator } from './types'
import { AttributeRewriterContentHandler as AttributeRewriter } from './element-handlers'

/**
 * Creates a decorator for HTMLRewriter that modifies basic og meta tags.
 *
 * @param WithOGBasicMetaAttrs
 * @returns HTMLRewriterDecorator
 */
type WithOGBasicMetaAttrs = {
  title: string
  description: string
  url: string
}
export function withOGBasicMeta({
  title,
  description,
  url,
}: WithOGBasicMetaAttrs): HTMLRewriterDecorator {
  return (rewriter: HTMLRewriter): HTMLRewriter => {
    // Clean up existing imageUrls
    return rewriter
      .on(
        'meta[property="og:title"]',
        new AttributeRewriter('content', title ?? ''),
      )
      .on(
        'meta[property="og:description"]',
        new AttributeRewriter('content', description ?? ''),
      )
      .on('meta[property="og:url"]', new AttributeRewriter('content', url))
  }
}
