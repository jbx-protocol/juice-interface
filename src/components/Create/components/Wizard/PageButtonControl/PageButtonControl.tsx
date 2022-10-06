import { Space } from 'antd'
import { useContext } from 'react'
import { PageContext } from '../contexts/PageContext'
import { BackButton, DoneButton, NextButton } from './components'

export const PageButtonControl = ({
  isNextEnabled = true, // Default enabled if not supplied
  onPageDone,
}: {
  isNextEnabled?: boolean
  onPageDone?: () => void
}) => {
  const { canGoBack, isFinalPage, doneText, goToPreviousPage } =
    useContext(PageContext)

  return (
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
        {isFinalPage && <DoneButton text={doneText} onClick={onPageDone} />}
      </Space>
      <Space style={{ marginLeft: 'auto' }}>
        {!isFinalPage && (
          <NextButton disabled={!isNextEnabled} onClick={onPageDone} />
        )}
      </Space>
    </div>
  )
}
