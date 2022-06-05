import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'

import { NetworkContext } from 'contexts/networkContext'
import { TransactorInstance } from 'hooks/Transactor'
import { CV } from 'models/cv'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

import { emitErrorNotification } from 'utils/notifications'

import { postGitHubIssueForArchive } from './postGitHubIssueForArchive'

export default function ArchiveProject({
  storeCidTx,
  metadata,
  projectId,
  owner,
  handle,
  canTakePaymentsWhenArchived = false,
  cv,
}: {
  storeCidTx: TransactorInstance<{ cid: string }>
  metadata: ProjectMetadataV4 | undefined
  projectId: number | undefined
  owner: string | undefined
  handle?: string | undefined // Used on V1 projects
  canTakePaymentsWhenArchived?: boolean
  cv: CV
}) {
  const { userAddress } = useContext(NetworkContext)

  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false)

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
    postGitHubIssueForArchive({ archived, projectId, metadata, handle, cv })

    const txSuccessful = await storeCidTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onConfirmed: () => {
          setIsLoadingArchive(false)
          window.location.reload()
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
      <h3>
        <Trans>Archive project</Trans>
      </h3>
      <p>
        <Trans>
          Your project will appear archived, and will not be able to receive
          payments through the juicebox.money app. You can unarchive a project
          at any time. Please allow a few days for your project to appear under
          the "archived" filter on the Projects page.
        </Trans>
      </p>
      <p>
        <strong>
          <Trans>Note:</Trans>
        </strong>{' '}
        {canTakePaymentsWhenArchived ? (
          <Trans>
            Your project will still be able to receive payments directly through
            the Juicebox protocol contracts.
          </Trans>
        ) : (
          <Trans>
            Unless payments are paused in your funding cycle settings, your
            project will still be able to receive payments directly through the
            Juicebox protocol contracts.
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
