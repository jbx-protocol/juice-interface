import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2v3/transactor/SetENSTextRecordForHandleTx'
import { pokeSnapshot, uploadSnapshotSettingsToIPFS } from 'lib/snapshot'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ipfsUrl } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'
import { helpPagePath } from 'utils/routes'

export function SnapshotSettingsSection() {
  const { tokenSymbol, tokenAddress, handle, projectOwnerAddress } =
    useContext(V2V3ProjectContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  const JBTokenStoreAddress = contracts?.JBTokenStore.address

  const [launchLoading, setLaunchLoading] = useState<boolean>(false)
  const [snapshotLaunched, setSnapshotLaunched] = useState<boolean>(false)

  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  const launchSnapshot = async () => {
    if (
      !(
        projectId &&
        handle &&
        tokenAddress &&
        projectMetadata &&
        projectOwnerAddress &&
        JBTokenStoreAddress
      )
    ) {
      emitErrorNotification('Failed to launch Snapshot. Try again.')
      return
    }

    setLaunchLoading(true)

    try {
      // 1. Upload settings to IPFS
      const snapshotSettingsCID = await uploadSnapshotSettingsToIPFS({
        handle,
        tokenSymbol: tokenSymbol ?? `<JB ${projectId}>`,
        projectId,
        projectMetadata,
        projectOwnerAddress,
        JBTokenStoreAddress,
      })

      // 2. Set ENS text record for handle
      setENSTextRecordForHandleTx(
        {
          ensName: handle,
          key: 'snapshot',
          value: ipfsUrl(snapshotSettingsCID),
        },
        {
          onConfirmed: async () => {
            // 3. Poke Snapshot. This makes the snapshot URL live.
            await pokeSnapshot(handle)

            setSnapshotLaunched(true)
            setLaunchLoading(false)
          },
          onCancelled: () => setLaunchLoading(false),
          onError(e) {
            console.error(e)
            emitErrorNotification('Failed to launch Snapshot. Try again.')
          },
        },
      )
    } catch (e) {
      console.error(e)

      emitErrorNotification('Failed to launch Snapshot. Try again.')
    } finally {
      setLaunchLoading(false)
    }
  }

  const launchButtonText = <Trans>Deploy Snapshot space</Trans>
  const launchButtonElement = !handle ? (
    <Tooltip
      overlay={
        <Trans>
          Project handle required.{' '}
          <Link href={`/v2/p/${projectId}/settings?page=projecthandle`}>
            Set project handle.
          </Link>
        </Trans>
      }
    >
      <Button disabled>{launchButtonText}</Button>
    </Tooltip>
  ) : (
    <Button onClick={launchSnapshot} type="primary" loading={launchLoading}>
      <span>{launchButtonText}</span>
    </Button>
  )

  const snapshotUrl = `https://snapshot.org/#/${handle}.eth`
  return (
    <section>
      <h3>
        <Trans>Snapshot voting</Trans>
      </h3>
      <p>
        <Trans>
          <ExternalLink href="https://snapshot.org">Snapshot</ExternalLink> is
          an off-chain voting system. You can use your Juicebox project tokens
          in a Snapshot voting strategy.{' '}
          <ExternalLink href={helpPagePath('/user/governance/snapshot')}>
            Learn more about Snapshot
          </ExternalLink>
          .
        </Trans>
      </p>
      {snapshotLaunched ? (
        <span>
          <Trans>
            Go to <ExternalLink href={snapshotUrl}>{snapshotUrl}</ExternalLink>
          </Trans>
        </span>
      ) : (
        launchButtonElement
      )}
    </section>
  )
}
