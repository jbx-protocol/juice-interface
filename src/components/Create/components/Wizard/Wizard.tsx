import useMobile from 'hooks/Mobile'
import React, { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import { Page } from './Page'
import { Steps } from './Steps'
import { WizardContext } from './contexts'
import { useWizard } from './hooks'

const WizardContainer: React.FC<{
  className?: string
}> = ({ children, className }) => {
  return (
    <div
      className={twJoin(
        className,
        'm-auto flex flex-col items-center gap-16 py-8 px-4 md:px-16',
      )}
    >
      {children}
    </div>
  )
}

export const Wizard: React.FC<{
  className?: string
  doneText?: ReactNode
}> & {
  Page: typeof Page
} = props => {
  const isMobile = useMobile()
  const { currentPage, pages, goToPage } = useWizard({
    children: React.Children.toArray(props.children),
  })

  return (
    <WizardContext.Provider
      value={{ currentPage, goToPage, pages, doneText: props.doneText }}
    >
      <WizardContainer className={props.className}>
        {!isMobile && <Steps />}
        {props.children}
      </WizardContainer>
    </WizardContext.Provider>
  )
}

Wizard.Page = Page
