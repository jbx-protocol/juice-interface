import { CheckCircleFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'

const GnosisSafeBadge = ({
  ownerIsGnosisSafe,
  ownerIsGnosisSafeLoading,
}: {
  ownerIsGnosisSafe?: boolean
  ownerIsGnosisSafeLoading?: boolean
}) => {
  return (
    <>
      {!ownerIsGnosisSafeLoading && ownerIsGnosisSafe && (
        <div>
          <Tooltip
            placement="bottom"
            title={t`This project is owned by a Gnosis Safe.`}
          >
            <CheckCircleFilled />
          </Tooltip>
        </div>
      )}
    </>
  )
}

export default GnosisSafeBadge
