import { t, Trans } from '@lingui/macro'
import { Button, Statistic } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { PV_V1, PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { useContext, useState } from 'react'
import { isEqualAddress } from 'utils/address'
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
  const { projectId, projectMetadata, pv } = useContext(ProjectMetadataContext)

  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false)

  const { userAddress } = useWallet()

  const revalidateProjectAfterArchive = async () => {
    switch (pv) {
      case PV_V1:
        if (handle) {
          await revalidateProject({
            pv,
            handle,
          })
        }
        break
      case PV_V2:
        if (projectId) {
          await revalidateProject({
            pv,
            projectId: String(projectId),
          })
        }
        break
    }
  }

  const setArchived = (archived: boolean) => async () => {
    if (!isEqualAddress(userAddress, owner)) {
      return emitErrorNotification(t`Connected wallet not authorized`)
    }
    setIsLoadingArchive(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      archived,
    })
    if (!uploadedMetadata.Hash) {
      return emitErrorNotification(t`Failed to update project metadata`)
    }

    const txSuccessful = await storeCidTx(
      { cid: uploadedMetadata.Hash },
      {
        onConfirmed: async () => {
          setIsLoadingArchive(false)
          await revalidateProjectAfterArchive()
          reloadWindow()
        },
      },
    )
    if (!txSuccessful) {
      emitErrorNotification(t`Failed to update project metadata`)
      setIsLoadingArchive(false)
      return
    }
  }

  if (projectMetadata?.archived) {
    return (
      <div className="flex flex-col gap-4">
        <Statistic
          title={<Trans>Project state</Trans>}
          valueRender={() => <Trans>Archived</Trans>}
        />

        <div>
          <p>
            <Trans>Unarchiving your project has the following effects:</Trans>
          </p>

          <ul className="list-disc pl-10">
            <li>
              <Trans>Your project will appear as 'active'.</Trans>
            </li>
            <li>
              <Trans>
                Your project can receive payments through the juicebox.money
                app.
              </Trans>
            </li>
          </ul>
        </div>

        <p>
          <Trans>
            Allow a few days for your project to appear in the "active" projects
            list on the Projects page.
          </Trans>
        </p>
        <div>
          <Button
            onClick={setArchived(false)}
            loading={isLoadingArchive}
            type="primary"
          >
            <span>
              <Trans>Unarchive project</Trans>
            </span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Statistic
        title={<Trans>Project state</Trans>}
        valueRender={() => <Trans>Active</Trans>}
      />

      <div>
        <p>
          <Trans>Archiving your project has the following effects:</Trans>
        </p>

        <ul className="list-disc pl-10">
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
                Unless payments to this project are paused in your cycle's
                rules, your project can still receive payments directly through
                the Juicebox protocol contracts.
              </Trans>
            )}
          </li>
        </ul>
      </div>

      <div>
        <p>
          <Trans>
            Allow a few days for your project to appear in the "archived"
            projects list on the Projects page.
          </Trans>
        </p>

        <Callout.Info>
          <Trans>You can unarchive your project at any time.</Trans>
        </Callout.Info>
      </div>

      <div>
        <Button
          onClick={setArchived(true)}
          loading={isLoadingArchive}
          type="primary"
        >
          <span>
            <Trans>Archive project</Trans>
          </span>
        </Button>
      </div>
    </div>
  )
}
