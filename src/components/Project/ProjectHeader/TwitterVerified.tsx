import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'

import useTwitterVerified from 'hooks/TwitterVerified'

const TwitterVerified = () => {
  const { data: verificationInfo } = useTwitterVerified('2-4653')
  if (!verificationInfo) {
    return null
  }
  return (
    <div>
      {verificationInfo.verified ? (
        <Tooltip title={t`Twitter Verified`} placement="right">
          <CheckCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip title={<Trans>Twitter unverified.</Trans>} placement="right">
          <ExclamationCircleOutlined />
        </Tooltip>
      )}
    </div>
  )
}

export default TwitterVerified
