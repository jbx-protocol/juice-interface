class AttributeRewriter {
  name: string
  value: string

  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }

  element(element: Element) {
    const attribute = element.getAttribute(this.name)
    if (attribute) {
      element.setAttribute(this.name, this.value)
    }
  }
}

class ElementRemover {
  element(element: Element) {
    element.remove()
  }
}

interface OGMetaTags {
  title: string
  description: string
  url: string
  imageUrl?: string
}

export function rewriteMetaTags(
  res: Response,
  { title, description, url, imageUrl }: OGMetaTags,
): Response {
  let rewriter = new HTMLRewriter()
    .on('meta[name="cloudflare"]', new AttributeRewriter('content', 'yes'))
    .on(
      'meta[property="og:title"]',
      new AttributeRewriter('content', title ?? ''),
    )
    .on(
      'meta[property="og:description"]',
      new AttributeRewriter('content', description ?? ''),
    )
    .on('meta[property="og:url"]', new AttributeRewriter('content', url))

  if (imageUrl) {
    rewriter = rewriter
      .on(
        'meta[property="og:image"]',
        new AttributeRewriter('content', imageUrl),
      )
      .on('meta[property="og:image:width"]', new ElementRemover())
      .on('meta[property="og:image:height"]', new ElementRemover())
      .on('meta[property="og:image:height"]', new ElementRemover())
  }

  return rewriter.transform(res)
}
