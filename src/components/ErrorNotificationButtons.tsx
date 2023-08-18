import { WarningOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { helpPagePath } from 'utils/routes'
import ExternalLink from './ExternalLink'

const resetSite = () => {
  localStorage.clear()
  sessionStorage.clear()
  // eslint-disable-next-line no-self-assign
  window.location.href = window.location.href
}

export default function ErrorNotificationButtons() {
  return (
    <div className="flex items-center gap-5">
      <ExternalLink
        className="text-grey-900 hover:underline dark:text-slate-100"
        href={helpPagePath('/user/resources/troubleshoot/')}
      >
        Troubleshoot
      </ExternalLink>
      <Button icon={<WarningOutlined />} size="small" onClick={resetSite}>
        <span>Reset website</span>
      </Button>
    </div>
  )
}
