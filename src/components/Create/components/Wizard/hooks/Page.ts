import { useCallback, useContext, useMemo } from 'react'
import { WizardContext } from '../contexts'
import { useValidators } from './Validators'

export const usePage = ({ name }: { name: string }) => {
  const { currentPage, pages, goToPage, doneText } = useContext(WizardContext)
  const { validators, addValidator, removeValidator } = useValidators()

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

  const goToNextPage = useCallback(async () => {
    if (!pages || !goToPage) return
    if (pageIndex === pages.length - 1) return
    const nextPage = pages[pageIndex + 1].name

    for (const { validator } of validators) {
      await validator()
    }

    goToPage(nextPage)
  }, [goToPage, pageIndex, pages, validators])

  const goToPreviousPage = useCallback(() => {
    if (!pages || !goToPage) return
    if (pageIndex <= 0) return
    const previousPage = pages[pageIndex - 1].name
    goToPage(previousPage)
  }, [goToPage, pageIndex, pages])

  return {
    isHidden,
    canGoBack,
    isFinalPage,
    doneText,
    goToNextPage,
    goToPreviousPage,
    addValidator,
    removeValidator,
  }
}
