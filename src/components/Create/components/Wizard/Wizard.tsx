import useMobile from 'hooks/useMobile'
import React, { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import { Page } from './Page'
import { Steps } from './Steps/Steps'
import { WizardContext } from './contexts/WizardContext'
import { useWizard } from './hooks/useWizard'

const WizardContainer: React.FC<
  React.PropsWithChildren<{
    className?: string
  }>
> = ({ children, className }) => {
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

export const Wizard: React.FC<
  React.PropsWithChildren<{
    className?: string
    doneText?: ReactNode
  }>
> & {
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
