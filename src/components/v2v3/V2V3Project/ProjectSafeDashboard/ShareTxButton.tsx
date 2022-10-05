import { ShareAltOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import CopyTextButton from 'components/CopyTextButton'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export function ShareTxButton({
  transaction,
  style,
  isPastTransaction,
}: {
  transaction: SafeTransactionType
  style?: CSSProperties
  isPastTransaction?: boolean
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  let linkToTx = `
    ${window.location.origin}
      ${v2v3ProjectRoute({ projectId, handle })}/
      safe?tx=${transaction.safeTxHash}`

  if (isPastTransaction) {
    linkToTx += `&tab=history`
  }

  return (
    <CopyTextButton
      value={linkToTx}
      button={<ShareAltOutlined style={style} />}
      tooltipText={t`Copy link to share.`}
    />
  )
}
