export const prettyUrl = (url: string) => {
  if (url.startsWith('https://')) {
    if (url.endsWith('/')) {
      return url.replace(/https:|[/]/g, '')
    }

    return url.split('https://')[1]
  } else if (url.startsWith('http://')) {
    if (url.endsWith('/')) {
      return url.replace(/https:|[/]/g, '')
    }

    return url.split('http://')[1]
  } else return url
}

export const linkUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return 'https://' + url
}
