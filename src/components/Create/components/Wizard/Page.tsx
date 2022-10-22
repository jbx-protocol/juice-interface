import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { Property } from 'csstype'
import useMobile from 'hooks/Mobile'
import { ReactNode, useContext } from 'react'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks'
import { PageButtonControl } from './PageButtonControl'
import { Steps } from './Steps'

export interface PageProps {
  name: string
  title?: ReactNode
  description?: ReactNode
  maxWidth?: Property.MaxWidth<string | number>
}

export const Page: React.FC<PageProps> & {
  ButtonControl: typeof PageButtonControl
} = ({ name, title, description, children, maxWidth = '600px' }) => {
  const isMobile = useMobile()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    canGoBack,
    isFinalPage,
    isHidden,
    doneText,
    nextPageName,
    goToPreviousPage,
    goToNextPage,
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
      }}
    >
      <Space direction="vertical" size="large" style={{ maxWidth }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h1>{title}</h1>
              {isMobile && nextPageName && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: colors.text.secondary,
                    textTransform: 'uppercase',
                    paddingBottom: '1.5rem',
                  }}
                >
                  <Trans>Next:</Trans> {nextPageName}
                </div>
              )}
            </div>{' '}
            {isMobile && <Steps />}
          </div>

          <p>{description}</p>
        </div>
        <div>{children}</div>
      </Space>
    </PageContext.Provider>
  )
}

Page.ButtonControl = PageButtonControl
