import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import FeedbackPromptModal from 'components/v1/V1Project/modals/FeedbackPromptModal'

import { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'

export default function DashboardNewDeploy({
  handle,
  projectId,
  owner,
  initialFeedbackModalOpen = false,
  isV2 = false,
}: {
  handle?: string
  projectId?: BigNumber
  owner: string | undefined
  initialFeedbackModalOpen?: boolean
  isV2?: boolean
}) {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(
    initialFeedbackModalOpen,
  )
  const history = useHistory()

  const removeModalQuery = () => {
    history.push(
      `${isV2 ? '/v2' : ''}/p/${
        handle || projectId?.toString()
      }?newDeploy=true`,
    )
  }

  // Close feedback modal and remove search query from URL
  const removeModalQueryAndCloseModal = () => {
    removeModalQuery()
    setFeedbackModalVisible(false)
  }

  // Removes feedbackModalOpen from search query and refreshes page
  const removeModalSearchQueryAndRefesh = () => {
    removeModalQuery()
    history.go(0)
  }
  return (
    <div
      style={{
        padding: padding.app,
        height: '100%',
        ...layouts.centered,
        textAlign: 'center',
      }}
    >
      <h2>
        <Trans>
          {handle ?? 'Project'} will be available soon! Try refreshing the page
          shortly.
        </Trans>
        <br />
        <br />
        <Button type="primary" onClick={removeModalSearchQueryAndRefesh}>
          <Trans>Refresh</Trans>
        </Button>
      </h2>
      <FeedbackPromptModal
        visible={feedbackModalVisible}
        onOk={removeModalQueryAndCloseModal}
        // In this case we close without removing search query
        onCancel={removeModalQueryAndCloseModal}
        projectHandle={handle}
        userAddress={owner}
      />
    </div>
  )
}
