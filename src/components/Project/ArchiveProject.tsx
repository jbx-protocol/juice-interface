import { t, Trans } from '@lingui/macro'
import { Button, Space, Statistic } from 'antd'
import axios from 'axios'
import Callout from 'components/Callout'
import { CV_V1, CV_V1_1, CV_V2, CV_V3 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { CV2V3 } from 'models/cv'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { reloadWindow } from 'utils/windowUtils'

export function ArchiveProject({
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
      <Space direction="vertical" size="middle">
        <Statistic
          title={<Trans>Project state</Trans>}
          valueRender={() => <Trans>Archived</Trans>}
        />

        <div>
          <p>
            <Trans>Unarchiving your project will mean the following:</Trans>
          </p>

          <ul>
            <Space direction="vertical">
              <li>
                <Trans>Your project will appear as 'active'.</Trans>
              </li>
              <li>
                <Trans>
                  Your project can receive payments through the juicebox.money
                  app.
                </Trans>
              </li>
            </Space>
          </ul>
        </div>

        <p>
          <Trans>
            Allow a few days for your project to appear in the "active" projects
            list on the Projects page.
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
      </Space>
    )
  }

  return (
    <Space direction="vertical" size="middle">
      <Statistic
        title={<Trans>Project state</Trans>}
        valueRender={() => <Trans>Active</Trans>}
      />

      <div>
        <p>
          <Trans>Archiving your project will mean the following:</Trans>
        </p>

        <ul>
          <Space direction="vertical">
            <li>
              <Trans>Your project will appear as 'archived'.</Trans>
            </li>
            <li>
              <Trans>
                Your project can't receive payments through the juicebox.money
                app.
              </Trans>
            </li>
            <li>
              {canTakePaymentsWhenArchived ? (
                <Trans>
                  Your project can still receive payments directly through the
                  Juicebox protocol contracts.
                </Trans>
              ) : (
                <Trans>
                  Unless payments are paused in your funding cycle settings,
                  your project can still receive payments directly through the
                  Juicebox protocol contracts.
                </Trans>
              )}
            </li>
          </Space>
        </ul>
      </div>

      <div>
        <p>
          <Trans>
            Allow a few days for your project to appear in the "archived"
            projects list on the Projects page.
          </Trans>
        </p>

        <Callout>
          <Trans>You can unarchive your project at any time.</Trans>
        </Callout>
      </div>

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
  )
}
