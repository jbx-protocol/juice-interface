import { Tooltip } from 'antd'
import { useContext } from 'react'
import { PageContext } from '../contexts/PageContext'
import { BackButton } from './components/BackButton'
import { NextButton } from './components/NextButton'

export const PageButtonControl = ({
  isNextEnabled = true, // Default enabled if not supplied
  isNextLoading = false, // Default not loading if not supplied
  onPageDone,
}: {
  isNextEnabled?: boolean
  isNextLoading?: boolean
  onPageDone?: () => void
}) => {
  const { canGoBack, isFinalPage, doneText, goToPreviousPage } =
    useContext(PageContext)

  return (
    <div className="mt-12 flex items-center justify-between">
      {canGoBack && <BackButton onClick={goToPreviousPage} />}
      <div className="ml-auto">
        {!isFinalPage ? (
          <NextButton
            loading={isNextLoading}
            disabled={!isNextEnabled}
            onClick={onPageDone}
          />
        ) : (
          <Tooltip title="Oops! We're experiencing an issue with project launches. Please try again later.">
            <div className="bg-grey-500 rounded-lg px-3 py-4">Launch project</div>
            {/* <DoneButton
              disabled={true}//!isNextEnabled}
              loading={isNextLoading}
              text={doneText}
              onClick={onPageDone}
            /> */}
          </Tooltip>
        )}
      </div>
    </div>
  )
}
