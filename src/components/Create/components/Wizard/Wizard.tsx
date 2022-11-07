import useMobile from 'hooks/Mobile'
import React, { CSSProperties, ReactNode } from 'react'
import { WizardContext } from './contexts'
import { useWizard } from './hooks'
import { Page } from './Page'
import { Steps } from './Steps'

// TODO: Make responsive and mobile friendly
const WizardContainer: React.FC<{
  className?: string
  style?: CSSProperties
}> = ({ children, className, style }) => {
  const isMobile = useMobile()
  return (
    <div
      className={className}
      style={{
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '4rem',
        padding: isMobile ? '2rem 1rem' : '2rem 4rem',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const Wizard: React.FC<{
  className?: string
  style?: CSSProperties
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
      <WizardContainer className={props.className} style={props.style}>
        {!isMobile && <Steps />}
        {props.children}
      </WizardContainer>
    </WizardContext.Provider>
  )
}

Wizard.Page = Page
