import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import { EnableNftsModal } from './EnableNftsModal'
import noNftsImage from '/public/assets/images/settings/no-nfts.webp'

export function EnableNftsCard() {
  const [enableNftsModalOpen, setEnableNftsModalOpen] = useState<boolean>(false)
  return (
    <>
      <div className="mt-10 flex flex-col items-center gap-5">
        <Image
          src={noNftsImage}
          alt={`No NFT collection`}
          width={200}
          height={200}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
        <span className="text-secondary">
          <Trans>You haven't launched an NFT collection yet.</Trans>
        </span>
        <Button type="primary" onClick={() => setEnableNftsModalOpen(true)}>
          <span>
            <Trans>Enable NFTs</Trans>
          </span>
        </Button>
      </div>

      <EnableNftsModal
        open={enableNftsModalOpen}
        onClose={() => setEnableNftsModalOpen(false)}
      />
    </>
  )
}
