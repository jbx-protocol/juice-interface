import { Trans } from '@lingui/macro'
import { Button } from 'antd'

import { useRouter } from 'next/router'

import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'

export default function NewDeployNotAvailable({
  handleOrId: name,
}: {
  handleOrId: string | number | undefined
}) {
  const router = useRouter()

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
          Project {name} will be available soon! Try refreshing the page
          shortly.
        </Trans>
        <br />
        <br />
        <Button type="primary" onClick={() => router.reload()}>
          <Trans>Refresh</Trans>
        </Button>
      </h2>
    </div>
  )
}
