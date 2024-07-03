export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}
