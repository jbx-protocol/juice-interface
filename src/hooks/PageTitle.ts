import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from '@lingui/macro'

import { DEFAULT_SITE_TITLE } from 'constants/siteMetadata'

const pageTitles = (): { [k in string]: string } => {
  return {
    '/create': t`Create project`,
    '/projects': t`Projects`,
  }
}

export function usePageTitle({ title }: { title?: string } = {}) {
  const location = useLocation()

  useEffect(() => {
    if (title) {
      document.title = title
      return
    }

    const name = pageTitles()[location.pathname]
    document.title = name ? `${name} | Juicebox` : DEFAULT_SITE_TITLE
  }, [location, title])
}
