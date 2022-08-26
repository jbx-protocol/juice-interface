import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { TransactorInstance } from 'hooks/Transactor'
import { CV } from 'models/cv'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

import axios from 'axios'
import { useWallet } from 'hooks/Wallet'
import { V1TerminalVersion } from 'models/v1/terminals'
import { revalidateProject } from 'utils/revalidateProject'
import { reloadWindow } from 'utils/windowUtils'

export default function ArchiveProject({
  storeCidTx,
  metadata,
  projectId,
  owner,
  handle,
  canTakePaymentsWhenArchived = false,
  showHeader = true,
  cv,
}: {
  storeCidTx: TransactorInstance<{ cid: string }>
  metadata: ProjectMetadataV4 | undefined
  projectId: number | undefined
  owner: string | undefined
  handle?: string | undefined // Used on V1 projects
  canTakePaymentsWhenArchived?: boolean
  showHeader?: boolean
  cv: CV
}) {
  const { userAddress } = useWallet()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false)

  const revalidateProjectAfterArchive = async () => {
    switch (cv) {
      case '1':
      case '1.1':
        if (handle) {
          await revalidateProject({
            cv: cv as V1TerminalVersion,
            handle,
          })
        }
        break
      case '2':
        if (projectId) {
          await revalidateProject({
            cv: '2',
            projectId: String(projectId),
          })
        }
        break
    }
  }

  const setArchived = (archived: boolean) => async () => {
    if (!userAddress || userAddress.toLowerCase() !== owner?.toLowerCase()) {
      return emitErrorNotification(t`Connected wallet not authorized`)
    }
    setIsLoadingArchive(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...metadata,
      archived,
    })
    if (!uploadedMetadata.IpfsHash) {
      return emitErrorNotification(t`Failed to update project metadata`)
    }

    // Create github issue when archive is requested
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    // Do this first, in case the user closes the page before the on-chain tx completes
    axios.post(`/api/github/archive-project`, {
      archived,
      projectId,
      metadata,
      handle,
      cv,
    })

    const txSuccessful = await storeCidTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onConfirmed: async () => {
          setIsLoadingArchive(false)
          await revalidateProjectAfterArchive()
          reloadWindow()
        },
      },
    )
    if (!txSuccessful) {
      emitErrorNotification(t`Transaction unsuccessful`)
      setIsLoadingArchive(false)
    }
  }

  if (metadata?.archived) {
    return (
      <section>
        <h3>
          <Trans>Unarchive project</Trans>
        </h3>
        <p>
          <Trans>
            Your project will immediately appear active on the juicebox.money
            app. Please allow a few days for it to appear in the "active"
            projects list on the Projects page.
          </Trans>
        </p>
        <Button
          onClick={setArchived(false)}
          loading={isLoadingArchive}
          size="small"
          type="primary"
        >
          <span>
            <Trans>Unarchive project</Trans>
          </span>
        </Button>
      </section>
    )
  }

  return (
    <section>
      {showHeader && (
        <h3>
          <Trans>Archive project</Trans>
        </h3>
      )}
      <p>
        <Trans>
          Your project will appear archived, and won't be able to receive
          payments through the juicebox.money app. You can unarchive a project
          at any time. Allow a few days for your project to appear under the
          "archived" filter on the Projects page.
        </Trans>
      </p>

      <p style={{ marginTop: 10, color: colors.text.secondary }}>
        <ExclamationCircleOutlined />{' '}
        {canTakePaymentsWhenArchived ? (
          <Trans>
            Your project can still receive payments directly through the
            Juicebox protocol contracts.
          </Trans>
        ) : (
          <Trans>
            Unless payments are paused in your funding cycle settings, your
            project can still receive payments directly through the Juicebox
            protocol contracts.
          </Trans>
        )}
      </p>
      <Button
        onClick={setArchived(true)}
        loading={isLoadingArchive}
        size="small"
        type="primary"
      >
        <span>
          <Trans>Archive project</Trans>
        </span>
      </Button>
    </section>
  )
}
