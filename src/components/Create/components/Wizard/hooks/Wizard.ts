import { useAppSelector } from 'hooks/AppSelector'
import { CreatePage } from 'models/create-page'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useEditingCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { PageProps } from '../Page'

const isPage = (element: ReactNode): element is PageProps => {
  return (element as PageProps)?.name !== undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWizard = ({ children }: { children?: any[] }) => {
  const [currentPage, setCurrentPage] = useState<string>('')
  const { furthestPageReached } = useEditingCreateFurthestPageReached()
  const softLockedPageQueue = useAppSelector(
    state => state.editingV2Project.createSoftLockPageQueue,
  )

  const pages: PageProps[] = useMemo(() => {
    if (!children) return []
    return children
      .map(child => {
        if (!child.props || (child.props && !isPage(child.props))) {
          console.warn('Invalid child in Wizard', { child })
          return undefined
        }
        return {
          name: child.props.name,
          title: child.props.title,
          description: child.props.description,
        }
      })
      .filter(p => !!p) as PageProps[]
  }, [children])

  const firstPageAvailable = useMemo(() => {
    if (softLockedPageQueue?.length) {
      return (
        pages.find(p => softLockedPageQueue.includes(p.name as CreatePage))
          ?.name || ''
      )
    }
    return furthestPageReached ?? ''
  }, [furthestPageReached, pages, softLockedPageQueue])

  const goToPage = useCallback(
    (page: string) => {
      if (pages.find(p => p.name === page)) {
        setCurrentPage(page)
        return
      }
      console.error('Invalid page called to goToPage', {
        page,
        pages: pages.map(p => p.name),
      })
    },
    [pages],
  )

  useEffect(() => {
    setCurrentPage(
      firstPageAvailable ? firstPageAvailable : pages[0]?.name ?? '',
    )
    // We only want to run useEffect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { currentPage, setCurrentPage, pages, goToPage }
}
