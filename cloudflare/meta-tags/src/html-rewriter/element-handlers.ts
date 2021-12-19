export class AttributeRewriterContentHandler {
  name: string
  value: string

  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }

  element(element: Element): void {
    const attribute = element.getAttribute(this.name)
    if (attribute) {
      element.setAttribute(this.name, this.value)
    }
  }
}

export class ElementRemoverContentHandler {
  element(element: Element): void {
    element.remove()
  }
}
