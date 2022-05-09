import { t, Trans } from '@lingui/macro'
import { Button, notification } from 'antd'
import axios from 'axios'

import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

import { readNetwork } from 'constants/networks'

const emitErrorNotification = (message: string) => {
  notification.error({
    key: new Date().valueOf().toString(),
    message,
    duration: 0,
  })
}

export default function ArchiveV2Project({
  editV2ProjectDetailsTx,
}: {
  editV2ProjectDetailsTx: TransactorInstance<{
    cid: string
  }>
}) {
  const { projectMetadata, projectId, projectOwnerAddress } =
    useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false)

  const setArchived = async (archived: boolean) => {
    if (
      !userAddress ||
      userAddress.toLowerCase() !== projectOwnerAddress?.toLowerCase()
    ) {
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
    axios.post(
      'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
      {
        title: `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
          projectMetadata?.name
        }"`,
        body: `<b>Chain:</b> ${readNetwork.name} \n <b>Project ID:</b> ${projectId} \n`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
        },
      },
    )

    const tx = await editV2ProjectDetailsTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onConfirmed: () => {
          setIsLoadingArchive(false)
          window.location.reload()
        },
      },
    )
    if (!tx) {
      setIsLoadingArchive(false)
    }
  }

  return (
    <>
      {projectMetadata?.archived ? (
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
            loading={isLoadingArchive}
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
            <Trans>
              Your project will still be able to receive payments directly
              through the Juicebox protocol contracts.
            </Trans>
          </p>
          <Button
            onClick={() => setArchived(true)}
            loading={isLoadingArchive}
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
