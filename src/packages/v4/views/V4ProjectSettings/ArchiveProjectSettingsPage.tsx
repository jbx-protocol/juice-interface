import { Trans } from '@lingui/macro'
import { Button, Statistic } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useJBProjectMetadataContext } from 'juice-sdk-react'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useEditProjectDetailsTx } from 'packages/v4/hooks/useEditProjectDetailsTx'
import { useCallback, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

export function ArchiveProjectSettingsPage() {
  const [loading, setLoading] = useState(false)

  const editV4ProjectDetailsTx = useEditProjectDetailsTx()
  const { metadata } = useJBProjectMetadataContext()

  const projectMetadata = metadata.data

  const setArchived = useCallback(async (archived: boolean) => {
    if (!projectMetadata) return

    setLoading(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      archived,
    })

    if (!uploadedMetadata.Hash) {
      setLoading(false)
      return
    }

    editV4ProjectDetailsTx(
      uploadedMetadata.Hash as `0x${string}`, {
        onTransactionPending: () => null,
        onTransactionConfirmed: () => {
          setLoading(false)
          emitInfoNotification('Project archived', {
            description: 'Your project has been archived.',
          })

          // v4Todo: part of v2, not sure if necessary 
          // if (projectId) {
          //   await revalidateProject({
          //     pv: PV_V4,
          //     projectId: String(projectId),
          //   })
          // }
        },
        onTransactionError: (error: unknown) => {
          console.error(error)
          setLoading(false)
          emitErrorNotification(`Error launching ruleset: ${error}`)
        },
      }
    )
  }, [
    editV4ProjectDetailsTx,
    projectMetadata,
  ])

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
            onClick={() => setArchived(false)}
            loading={loading}
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
            <Trans>
              Unless payments to this project are paused in your cycle's
              rules, your project can still receive payments directly through
              the Juicebox protocol contracts.
            </Trans>
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
          onClick={() => setArchived(true)}
          loading={loading}
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
