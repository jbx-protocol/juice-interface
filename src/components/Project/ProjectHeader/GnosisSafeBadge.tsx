import Icon from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'

const SafeIcon = () => (
  <img src="/assets/gnosis.svg" alt="Gnosis Safe" width={20} height={20} />
)

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
            <Icon component={SafeIcon} />
          </Tooltip>
        </div>
      )}
    </>
  )
}

export default GnosisSafeBadge
