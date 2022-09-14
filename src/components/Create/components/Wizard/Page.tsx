import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, ButtonProps, Space } from 'antd'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks'

const BackButton = (props: ButtonProps) => {
  return (
    <Button size="large" {...props}>
      <ArrowLeftOutlined /> <Trans>Back</Trans>
    </Button>
  )
}

const SkipButton = (props: ButtonProps) => {
  return (
    <Button type="link" {...props}>
      <span style={{ textDecoration: 'underline' }}>
        <Trans>Skip</Trans>
      </span>
    </Button>
  )
}

const NextButton = (props: ButtonProps) => {
  return (
    <Button type="primary" size="large" {...props}>
      <Trans>Next</Trans> <ArrowRightOutlined />
    </Button>
  )
}

const DoneButton = (props: ButtonProps & { text?: string }) => {
  return (
    <Button type="primary" size="large" {...props}>
      {props.text ?? t`Done`}
    </Button>
  )
}

export interface PageProps {
  name: string
  title?: string
  description?: string
  isSkippable?: boolean
}

export const Page: React.FC<PageProps> = ({
  name,
  title,
  description,
  isSkippable = false,
  children,
}) => {
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
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space>
            {canGoBack && <BackButton onClick={goToPreviousPage} />}
            {isFinalPage && <DoneButton text={doneText} />}
          </Space>
          <Space style={{ marginLeft: 'auto' }}>
            {!isFinalPage && isSkippable && (
              <SkipButton onClick={goToNextPage} />
            )}
            {!isFinalPage && <NextButton onClick={goToNextPage} />}
          </Space>
        </div>
      </Space>
    </PageContext.Provider>
  )
}
