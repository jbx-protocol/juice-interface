import { Trans } from '@lingui/macro'
import useMobile from 'hooks/useMobile'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { PageButtonControl } from './PageButtonControl/PageButtonControl'
import { Steps } from './Steps/Steps'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks/usePage'

export interface PageProps {
  className?: string
  name: string
  title?: ReactNode
  description?: ReactNode
}

export const Page: React.FC<React.PropsWithChildren<PageProps>> & {
  ButtonControl: typeof PageButtonControl
} = ({ className, name, title, description, children }) => {
  const isMobile = useMobile()
  const {
    canGoBack,
    isFinalPage,
    isHidden,
    doneText,
    nextPageName,
    goToPreviousPage,
    goToNextPage,
    lockPageProgress,
    unlockPageProgress,
  } = usePage({
    name,
  })

  if (isHidden) return null

  return (
    <PageContext.Provider
      value={{
        pageName: name,
        isHidden,
        canGoBack,
        isFinalPage,
        doneText,
        goToNextPage,
        goToPreviousPage,
        lockPageProgress,
        unlockPageProgress,
      }}
    >
      <div
        className={twMerge(
          'flex w-full max-w-full flex-col gap-6 md:max-w-xl',
          className,
        )}
      >
        <div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-3xl font-medium text-black dark:text-grey-200">
                {title}
              </h3>
              {isMobile && nextPageName && (
                <div className="pb-6 text-xs font-normal uppercase text-grey-500">
                  <Trans>Next:</Trans> {nextPageName}
                </div>
              )}
            </div>{' '}
            {isMobile && <Steps />}
          </div>

          <p>{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </PageContext.Provider>
  )
}

Page.ButtonControl = PageButtonControl
