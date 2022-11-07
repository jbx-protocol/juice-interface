import { t } from '@lingui/macro'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useContext } from 'react'
import { restrictedIpfsUrl } from 'utils/ipfs'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
  uploadNftCollectionMetadataToIPFS,
} from 'utils/nftRewards'
import { loadJBTiered721DelegateContract } from 'utils/v2v3/contractLoaders/JBTiered721Delegate'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useReconfigureNftCollectionMetadata(): TransactorInstance<
  NftCollectionMetadata & { dataSource: string }
> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()
  const { signer } = useWallet()

  return async ({ name, description, dataSource }, txOpts) => {
    if (!transactor || !contracts) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const uri = await uploadNftCollectionMetadataToIPFS({
      collectionName: name?.length
        ? name
        : defaultNftCollectionName(projectTitle),
      collectionDescription: description?.length
        ? description
        : defaultNftCollectionDescription(projectTitle),
      collectionLogoUri: projectMetadata?.logoUri,
      collectionInfoUri: projectMetadata?.infoUri,
    })
    const delegateContract = await loadJBTiered721DelegateContract(
      dataSource,
      signer ?? readProvider,
    )

    console.info('delegateContract: ', delegateContract)
    console.info('restrictedIpfsUrl(uri): ', restrictedIpfsUrl(uri))

    return transactor(
      delegateContract,
      'setContractUri',
      [restrictedIpfsUrl(uri)],
      {
        ...txOpts,
        title: t`Reconfigure ${projectTitle} with new NFTs`,
      },
    )
  }
}
