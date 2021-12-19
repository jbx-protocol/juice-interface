import type { HTMLRewriterDecorator } from './types'
import {
  ElementRemoverContentHandler as ElementRemover,
  AttributeRewriterContentHandler as AttributeRewriter,
} from './element-handlers'

/**
 * Creates a decorator for HTMLRewriter that modifies image url meta tags.
 *
 * @param WithOGImageUrlMetaAttrs
 * @returns HTMLRewriterDecorator
 */
type WithOGImageUrlMetaAttrs = {
  imageUrl: string
}
export function withOGImageUrlMeta({
  imageUrl,
}: WithOGImageUrlMetaAttrs): HTMLRewriterDecorator {
  return (rewriter: HTMLRewriter): HTMLRewriter => {
    return (
      rewriter
        // Remove image url properties
        .on('meta[property="og:image:width"]', new ElementRemover())
        .on('meta[property="og:image:height"]', new ElementRemover())
        .on('meta[property="og:image:type"]', new ElementRemover())
        // Update imageUrl
        .on(
          'meta[property="og:image"]',
          new AttributeRewriter('content', imageUrl),
        )
    )
  }
}
