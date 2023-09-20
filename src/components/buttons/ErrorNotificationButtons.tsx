import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import { helpPagePath } from 'utils/routes'
import ExternalLink from '../ExternalLink'

const resetSite = () => {
  localStorage.clear()
  sessionStorage.clear()
  // eslint-disable-next-line no-self-assign
  window.location.href = window.location.href
}

export default function ErrorNotificationButtons() {
  return (
    <LanguageProvider>
      <div className="flex items-center gap-5">
        <ExternalLink
          className="text-grey-900 hover:underline dark:text-slate-100"
          href={helpPagePath('/user/resources/troubleshoot/')}
        >
          <Trans>Troubleshoot</Trans>
        </ExternalLink>
        <Button icon={<WarningOutlined />} size="small" onClick={resetSite}>
          <span>
            <Trans>Reset website</Trans>
          </span>
        </Button>
      </div>
    </LanguageProvider>
  )
}
