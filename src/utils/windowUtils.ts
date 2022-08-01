export const reloadWindow = () => {
  if (typeof window === 'undefined') return
  window.location.reload()
}

export const redirectTo = (href: string) => {
  if (typeof window === 'undefined') return
  window.location.href = href
}

export const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const windowOpen = (url: string, blank = true) => {
  if (typeof window === 'undefined') return
  if (blank) {
    window.open(url, '_blank')
  } else {
    window.open(url)
  }
}
