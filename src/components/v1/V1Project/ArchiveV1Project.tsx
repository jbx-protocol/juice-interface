import { Trans } from '@lingui/macro'
import { Button, notification } from 'antd'
import axios from 'axios'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

import { readNetwork } from 'constants/networks'

export default function ArchiveV1Project({
  setUriTx,
}: {
  setUriTx: TransactorInstance<{
    cid: string
  }>
}) {
  const { metadata, projectId, handle, terminal, owner } =
    useContext(V1ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const [loadingArchive, setLoadingArchive] = useState<boolean>()

  const canTakePaymentsWhenArchived = !(terminal?.version === '1.1')

  async function setArchived(archived: boolean) {
    // Manual check to help avoid creating axios request when onchain tx would fail
    if (!userAddress || userAddress.toLowerCase() !== owner?.toLowerCase()) {
      notification.error({
        key: new Date().valueOf().toString(),
        message: 'Connected wallet not authorized',
        duration: 0,
      })
      return
    }

    setLoadingArchive(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...metadata,
      archived,
    })

    if (!uploadedMetadata.IpfsHash) {
      notification.error({
        key: new Date().valueOf().toString(),
        message: 'Failed to update project metadata',
        duration: 0,
      })
      setLoadingArchive(false)
      return
    }

    // Create github issue when archive is requested
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    // Do this first, in case the user closes the page before the on-chain tx completes
    axios.post(
      'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
      {
        title: `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
          metadata?.name
        }"`,
        body: `<b>Chain:</b> ${
          readNetwork.name
        } \n <b>Handle:</b> ${handle} \n <b>Id:</b> ${projectId?.toString()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
        },
      },
    )

    setUriTx(
      { cid: uploadedMetadata.IpfsHash },
      { onDone: () => setLoadingArchive(false) },
    )
  }

  return (
    <>
      {metadata?.archived ? (
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
            onClick={() => setArchived(false)}
            loading={loadingArchive}
            size="small"
            type="primary"
          >
            <span>
              <Trans>Unarchive project</Trans>
            </span>
          </Button>
        </section>
      ) : (
        <section>
          <h3>
            <Trans>Archive project</Trans>
          </h3>
          <p>
            <Trans>
              Your project will appear archived, and will not be able to receive
              payments through the juicebox.money app. You can unarchive a
              project at any time. Please allow a few days for your project to
              appear under the "archived" filter on the Projects page.
            </Trans>
          </p>
          <p>
            <strong>
              <Trans>Note:</Trans>
            </strong>{' '}
            {canTakePaymentsWhenArchived ? (
              <Trans>
                Your project will still be able to receive payments directly
                through the Juicebox protocol contracts.
              </Trans>
            ) : (
              <Trans>
                Unless payments are paused in your funding cycle settings, your
                project will still be able to receive payments directly through
                the Juicebox protocol contracts.
              </Trans>
            )}
          </p>
          <Button
            onClick={() => setArchived(true)}
            loading={loadingArchive}
            size="small"
            type="primary"
          >
            <span>
              <Trans>Archive project</Trans>
            </span>
          </Button>
        </section>
      )}
    </>
  )
}
