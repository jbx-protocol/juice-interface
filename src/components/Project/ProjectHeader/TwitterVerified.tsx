import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'

import useTwitterVerified, {
  TwitterVerificationInfo,
} from 'hooks/TwitterVerified'

const TwitterVerified = () => {
  const [value] = useTwitterVerified('2-4356')
  const info = value as TwitterVerificationInfo
  if (!info) {
    return null
  }
  return (
    <div>
      {info.verified ? (
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
