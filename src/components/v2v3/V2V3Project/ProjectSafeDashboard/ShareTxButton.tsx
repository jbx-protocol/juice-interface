import { ShareAltOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { CSSProperties, useContext, useState } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export function ShareTxButton({
  transactionId,
  style,
}: {
  transactionId: string
  style?: CSSProperties
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  const [copied, setCopied] = useState<boolean>(false)

  const linkToTx = `
    ${window.location.origin}/
      ${v2v3ProjectRoute({ projectId, handle })}/
      safe?tx=${transactionId}
  `

  const copyLinkToKeyboard = () => {
    if (navigator) {
      navigator.clipboard.writeText(linkToTx)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }
  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : t`Copy link to share.`}</span>}
    >
      <ShareAltOutlined
        onClick={e => {
          e.stopPropagation()
          copyLinkToKeyboard()
        }}
        style={style}
      />
    </Tooltip>
  )
}
