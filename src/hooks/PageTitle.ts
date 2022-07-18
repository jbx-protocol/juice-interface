import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { t } from '@lingui/macro'

import { DEFAULT_SITE_TITLE } from 'constants/siteMetadata'

const pageTitles = (): { [k in string]: string } => {
  return {
    '/create': t`Create project`,
    '/projects': t`Projects`,
  }
}

export function usePageTitle({ title }: { title?: string } = {}) {
  const router = useRouter()

  useEffect(() => {
    if (title) {
      document.title = title
      return
    }

    const name = pageTitles()[router.pathname]
    document.title = name ? `${name} | Juicebox` : DEFAULT_SITE_TITLE
  }, [router, title])
}
