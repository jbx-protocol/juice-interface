import { Space } from 'antd'
import { Property } from 'csstype'
import { ReactNode } from 'react'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks'
import { PageButtonControl } from './PageButtonControl'

export interface PageProps {
  name: string
  title?: ReactNode
  description?: ReactNode
  width?: Property.Width<string | number>
}

export const Page: React.FC<PageProps> & {
  ButtonControl: typeof PageButtonControl
} = ({ name, title, description, children, width = '600px' }) => {
  const {
    canGoBack,
    isFinalPage,
    isHidden,
    doneText,
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
      <Space direction="vertical" size="large" style={{ width }}>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div>{children}</div>
      </Space>
    </PageContext.Provider>
  )
}

Page.ButtonControl = PageButtonControl
