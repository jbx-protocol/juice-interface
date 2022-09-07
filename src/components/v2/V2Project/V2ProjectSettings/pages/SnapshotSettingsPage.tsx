import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2/transactor/SetENSTextRecordForHandleTx'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { uploadSnapshotSettingsToIPFS } from 'utils/ipfs'
import { pokeSnapshot } from 'utils/snapshot'

export function SnapshotSettingsPage() {
  const {
    tokenSymbol,
    tokenAddress,
    handle,
    projectId,
    projectMetadata,
    projectOwnerAddress,
  } = useContext(V2ProjectContext)

  const [launchLoading, setLaunchLoading] = useState<boolean>(false)

  const [snapshotLaunched, setSnapshotLaunched] = useState<boolean>(false)

  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  const launchSnapshot = async () => {
    if (
      !(
        projectId &&
        handle &&
        tokenSymbol &&
        tokenAddress &&
        projectMetadata &&
        projectOwnerAddress
      )
    )
      return

    setLaunchLoading(true)
    const snapshotSettingsCID = await uploadSnapshotSettingsToIPFS({
      handle,
      tokenSymbol,
      projectId,
      projectMetadata,
      projectOwnerAddress,
    })
    setENSTextRecordForHandleTx(
      {
        ensName: handle,
        key: 'snapshot',
        value: `ipfs://${snapshotSettingsCID}`,
      },
      {
        onConfirmed: async () => {
          await pokeSnapshot(handle)
          setSnapshotLaunched(true)
          setLaunchLoading(false)
        },
        onCancelled: () => setLaunchLoading(false),
      },
    )
  }

  const launchButtonText = <Trans>Deploy Snapshot space</Trans>

  let launchButtonElement: JSX.Element
  if (!handle) {
    launchButtonElement = (
      <Tooltip
        overlay={
          <Trans>
            <Link href={`/v2/p/${projectId}/settings?page=projecthandle`}>
              Project handle
            </Link>{' '}
            required.
          </Trans>
        }
      >
        <Button disabled>{launchButtonText}</Button>
      </Tooltip>
    )
  } else {
    launchButtonElement = (
      <Button onClick={launchSnapshot} type="primary" loading={launchLoading}>
        <span>{launchButtonText}</span>
      </Button>
    )
  }
  const snapshotUrl = `https://snapshot.org/#/${handle}.eth`
  return (
    <>
      <h3>
        <Trans>Snapshot voting</Trans>
      </h3>
      <p>
        <Trans>
          <ExternalLink href="https://snapshot.org">Snapshot</ExternalLink> is
          an off-chain voting system. You can use your Juicebox project tokens
          in a Snapshot voting strategy.{' '}
          <ExternalLink href="https://info.juicebox.money/user/governance/snapshot">
            Learn more about Snapshot
          </ExternalLink>
          .
        </Trans>
      </p>
      {snapshotLaunched ? (
        <span>
          Go to <ExternalLink href={snapshotUrl}>{snapshotUrl}</ExternalLink>
        </span>
      ) : (
        launchButtonElement
      )}
    </>
  )
}
