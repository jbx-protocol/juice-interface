import { Space } from 'antd'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks'
import { PageButtonControl } from './PageButtonControl'

export interface PageProps {
  name: string
  title?: string
  description?: string
  isSkippable?: boolean
}

export const Page: React.FC<PageProps> & {
  ButtonControl: typeof PageButtonControl
} = ({ name, title, description, isSkippable = false, children }) => {
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
        isSkippable,
        isHidden,
        canGoBack,
        isFinalPage,
        doneText,
        goToNextPage,
        goToPreviousPage,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
