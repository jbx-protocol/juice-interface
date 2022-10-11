import React from 'react'
import { WizardContext } from './contexts'
import { useWizard } from './hooks'
import { Page } from './Page'
import { Steps } from './Steps'

// TODO: Make responsive and mobile friendly
const WizardContainer: React.FC = ({ children }) => {
  return (
    <div
      style={{
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '2rem 0',
      }}
    >
      {children}
    </div>
  )
}

export const Wizard: React.FC<{ doneText?: string }> & {
  Page: typeof Page
} = props => {
  const { currentPage, pages, goToPage } = useWizard({
    children: React.Children.toArray(props.children),
  })

  return (
    <WizardContext.Provider
      value={{ currentPage, goToPage, pages, doneText: props.doneText }}
    >
      <WizardContainer>
        <Steps />
        {props.children}
      </WizardContainer>
    </WizardContext.Provider>
  )
}

Wizard.Page = Page
