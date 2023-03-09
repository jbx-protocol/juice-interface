import { t } from '@lingui/macro'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { NftCollectionMetadata } from 'models/nftRewards'
import { useContext } from 'react'
import { ipfsUri } from 'utils/ipfs'
import { pinNftCollectionMetadata } from 'utils/nftRewards'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useReconfigureNftCollectionMetadata(): TransactorInstance<NftCollectionMetadata> {
  const { transactor } = useContext(TransactionContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const {
    contracts: { JB721TieredDelegate },
  } = useContext(JB721DelegateContractsContext)

  const projectTitle = useV2ProjectTitle()

  return async ({ name, description }, txOpts) => {
    if (!transactor || !JB721TieredDelegate || !name) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const uri = await pinNftCollectionMetadata({
      collectionName: name,
      collectionDescription: description ?? '',
      collectionLogoUri: projectMetadata?.logoUri,
      collectionInfoUri: projectMetadata?.infoUri,
    })

    return transactor(JB721TieredDelegate, 'setContractUri', [ipfsUri(uri)], {
      ...txOpts,
      title: t`Update ${projectTitle}'s NFT collection details.`,
    })
  }
}
