import { NetworkContext } from 'contexts/networkContext'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import { useContext } from 'react'

export default function FeedbackFormLink({
  projectHandle,
}: {
  projectHandle?: string
}) {
  const { userAddress } = useContext(NetworkContext)

  const goToFeedbackForm = () => {
    let formUrl = `https://auditor.typeform.com/to/REMUTIbQ#`
    if (projectHandle) {
      formUrl += `project=${projectHandle}&`
    }
    if (userAddress) {
      formUrl += `address=${userAddress}`
    }
    window.open(formUrl)
  }

  return (
    <Button className="feedback-form-link" onClick={goToFeedbackForm}>
      <MessageOutlined /> <Trans>Feedback for Juicebox</Trans>
    </Button>
  )
}
