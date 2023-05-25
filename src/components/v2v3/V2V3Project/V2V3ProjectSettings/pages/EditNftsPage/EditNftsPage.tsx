import { t, Trans } from '@lingui/macro'
import { Button, Empty, Tabs } from 'antd'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection'
import { EditNftsSection } from './EditNftsSection'
import blueberry from '/public/assets/images/blueberry-ol.png'

export function EditNftsPage() {
  const { value: hasExistingNfts, loading: hasNftsLoading } = useHasNftRewards()
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  const items = [
    { label: t`NFTs`, key: 'nfts', children: <EditNftsSection /> },
    {
      label: t`Collection details`,
      key: 'collection',
      children: <EditCollectionDetailsSection />,
    },
  ]

  if (hasNftsLoading) {
    return <Loading />
  }

  if (!hasExistingNfts) {
    return (
      <div className="m-auto max-w-lg">
        <Empty
          image={
            <div className="m-auto h-24 w-24 grayscale">
              <Image
                className="grayscale"
                src={blueberry}
                alt="Sexy Juicebox blueberry with bright pink lipstick spraying a can of spraypaint"
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
          }
          description={
            <>
              <p>
                <Trans>
                  You haven't launched an NFT collection yet! Edit your cycle to
                  add NFTs.
                </Trans>
              </p>
              <Link
                href={settingsPagePath('reconfigurefc', { projectId, handle })}
                legacyBehavior
              >
                <Button type="primary">
                  <Trans>Add NFTs to cycle</Trans>
                </Button>
              </Link>
            </>
          }
        />
      </div>
    )
  }

  return <Tabs items={items} />
}
