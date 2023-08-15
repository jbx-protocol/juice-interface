export const wrapNonAnchorsInAnchor = (text: string) => {
  const urlRegex =
    /\b((http|https):\/\/[a-zA-Z0-9-._~:/?#@\\[\]!$&'()*+,;=%]+)\b/g

  return text.replace(urlRegex, (match, url, _, offset) => {
    // Check character before the match for a quotation mark
    if (offset > 0 && text[offset - 1] === '"') {
      return match // If there's a quotation mark, just return the original match
    }
    return '<a href="' + url + '">' + url + '</a>'
  })
}
