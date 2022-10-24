import { useAppDispatch } from 'hooks/AppDispatch'
import { CreatePage } from 'models/create-page'
import { useCallback, useContext, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { WizardContext } from '../contexts'

export const usePage = ({ name }: { name: string }) => {
  const dispatch = useAppDispatch()
  const { currentPage, pages, goToPage, doneText } = useContext(WizardContext)

  const pageIndex = useMemo(
    () => pages?.findIndex(p => p.name === name) ?? -1,
    [name, pages],
  )
  const isHidden = useMemo(() => name !== currentPage, [name, currentPage])
  const canGoBack = useMemo(() => pageIndex > 0, [pageIndex])
  const isFinalPage = useMemo(
    () => pageIndex >= 0 && pageIndex === (pages?.length ?? 0) - 1,
    [pageIndex, pages?.length],
  )

  const nextPageName = useMemo(
    () => (!isFinalPage && pages ? pages[pageIndex + 1].title : undefined),
    [isFinalPage, pageIndex, pages],
  )

  const goToNextPage = useCallback(() => {
    if (!pages || !goToPage) return
    if (pageIndex === pages.length - 1) return
    const nextPage = pages[pageIndex + 1].name

    goToPage(nextPage)
  }, [goToPage, pageIndex, pages])

  const goToPreviousPage = useCallback(() => {
    if (!pages || !goToPage) return
    if (pageIndex <= 0) return
    const previousPage = pages[pageIndex - 1].name
    goToPage(previousPage)
  }, [goToPage, pageIndex, pages])

  const lockPageProgress = useCallback(() => {
    dispatch(
      editingV2ProjectActions.addCreateSoftLockedPage(name as CreatePage),
    )
  }, [dispatch, name])

  const unlockPageProgress = useCallback(() => {
    // We need to make sure pages can't unsoftlock other pages :\
    dispatch(
      editingV2ProjectActions.removeCreateSoftLockedPage(name as CreatePage),
    )
  }, [dispatch, name])

  return {
    isHidden,
    canGoBack,
    isFinalPage,
    doneText,
    nextPageName,
    goToNextPage,
    goToPreviousPage,
    lockPageProgress,
    unlockPageProgress,
  }
}
