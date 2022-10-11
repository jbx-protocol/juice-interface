import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import axios from 'axios'
import Callout from 'components/Callout'
import { CV_V1, CV_V1_1, CV_V2, CV_V3 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { CV2V3 } from 'models/cv'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'
import { revalidateProject } from 'utils/revalidateProject'
import { reloadWindow } from 'utils/windowUtils'

export default function ArchiveProject({
  storeCidTx,
  owner,
  handle,
  canTakePaymentsWhenArchived = false,
}: {
  storeCidTx: TransactorInstance<{ cid: string }>
  owner: string | undefined
  handle?: string | undefined // Used on V1 projects
  canTakePaymentsWhenArchived?: boolean
}) {
  const { projectId, projectMetadata, cv } = useContext(ProjectMetadataContext)

  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false)

  const { userAddress } = useWallet()

  const revalidateProjectAfterArchive = async () => {
    switch (cv) {
      case CV_V1:
      case CV_V1_1:
        if (handle) {
          await revalidateProject({
            cv: cv as V1TerminalVersion,
            handle,
          })
        }
        break
      case CV_V2:
      case CV_V3:
        if (projectId) {
          await revalidateProject({
            cv: cv as CV2V3,
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
      ...projectMetadata,
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
      projectMetadata,
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

  if (projectMetadata?.archived) {
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
      <Space direction="vertical" size="middle">
        <p>
          <Trans>
            Your project will appear archived, and won't be able to receive
            payments through the juicebox.money app. You can unarchive a project
            at any time. Allow a few days for your project to appear under the
            "archived" filter on the Projects page.
          </Trans>
        </p>

        <Callout>
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
        </Callout>
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
      </Space>
    </section>
  )
}
