import type { HTMLRewriterDecorator } from './types'
import { AttributeRewriterContentHandler as AttributeRewriter } from './element-handlers'

/**
 * Creates a decorator for HTMLRewriter that switches a cloudfare meta tag
 * to yes. Useful for apps that need to know that it's been served through
 * cloudflare.
 *
 * @returns HTMLRewriterDecorator
 */
export function withCloudflareMeta(): HTMLRewriterDecorator {
  return (rewriter: HTMLRewriter): HTMLRewriter => {
    return rewriter.on(
      'meta[name="cloudflare"]',
      new AttributeRewriter('content', 'yes'),
    )
  }
}
