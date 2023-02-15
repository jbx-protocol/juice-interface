import { Button, Space } from 'antd'
import { helpPagePath } from 'utils/routes'
import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import LanguageProvider from 'contexts/Language/LanguageProvider'

const resetSite = () => {
  localStorage.clear()
  sessionStorage.clear()
  // eslint-disable-next-line no-self-assign
  window.location.href = window.location.href
}

export default function ErrorNotificationButtons() {
  return (
    <LanguageProvider>
      <Space>
        <Button
          type="link"
          size="small"
          href={helpPagePath('/user/resources/troubleshoot/')}
        >
          <Trans>Troubleshoot</Trans>
        </Button>
        <Button
          icon={<WarningOutlined />}
          className="bg-error-500 dark:bg-error-300"
          type="primary"
          size="small"
          onClick={resetSite}
        >
          <Trans> Reset Website</Trans>
        </Button>
      </Space>
    </LanguageProvider>
  )
}
