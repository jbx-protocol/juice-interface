export const wrapNonAnchorsInAnchor = (text: string) => {
  const urlRegex =
    /(?<!")\b((http|https):\/\/[a-zA-Z0-9-._~:/?#@\\[\]!$&'()*+,;=%]+)\b(?!")/g

  return text.replace(urlRegex, url => {
    return '<a href="' + url + '">' + url + '</a>'
  })
}
