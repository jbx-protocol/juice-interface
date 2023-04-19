import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { readNetwork } from 'constants/networks'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2v3/transactor/SetENSTextRecordForHandleTx'
import { pokeSnapshot, uploadSnapshotSettingsToIPFS } from 'lib/snapshot'
import { NetworkName } from 'models/networkName'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ipfsUri } from 'utils/ipfs'
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

  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx(handle)

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
          value: ipfsUri(snapshotSettingsCID),
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
  const canLaunchSnapshot = handle && readNetwork.name === NetworkName.mainnet
  const launchButtonElement = canLaunchSnapshot ? (
    <Button onClick={launchSnapshot} type="primary" loading={launchLoading}>
      <span>{launchButtonText}</span>
    </Button>
  ) : (
    <Tooltip
      overlay={
        readNetwork.name !== NetworkName.mainnet ? (
          <Trans>Only available on Mainnet</Trans>
        ) : (
          <Trans>
            Project handle required.{' '}
            <Link href={`/v2/p/${projectId}/settings?page=projecthandle`}>
              Set project handle.
            </Link>
          </Trans>
        )
      }
    >
      <Button disabled>{launchButtonText}</Button>
    </Tooltip>
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
          <ExternalLink href={helpPagePath('/user/resources/snapshot/')}>
            Learn more
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
