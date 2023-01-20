import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { useJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/useJB721TieredDelegate'
import { TransactorInstance } from 'hooks/Transactor'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useContext } from 'react'
import { ipfsUrl } from 'utils/ipfs'
import { uploadNftCollectionMetadataToIPFS } from 'utils/nftRewards'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useReconfigureNftCollectionMetadata({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): TransactorInstance<NftCollectionMetadata & { dataSource: string }> {
  const { transactor } = useContext(TransactionContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const JB721TieredDelegate = useJB721TieredDelegate({
    address: dataSourceAddress,
  })

  const projectTitle = useV2ProjectTitle()

  return async ({ name, description }, txOpts) => {
    if (!transactor || !JB721TieredDelegate || !name) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const uri = await uploadNftCollectionMetadataToIPFS({
      collectionName: name,
      collectionDescription: description ?? '',
      collectionLogoUri: projectMetadata?.logoUri,
      collectionInfoUri: projectMetadata?.infoUri,
    })

    return transactor(JB721TieredDelegate, 'setContractUri', [ipfsUrl(uri)], {
      ...txOpts,
      title: t`Update ${projectTitle}'s NFT collection details.`,
    })
  }
}
