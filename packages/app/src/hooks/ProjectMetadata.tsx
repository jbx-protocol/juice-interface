import { BigNumber } from '@ethersproject/bignumber'
import Axios from 'axios'
import { ContractName } from 'models/contract-name'
import { ProjectMetadata } from 'models/project-metadata'
import { useEffect, useState } from 'react'
import { ipfsCidUrl } from 'utils/ipfs'

import useContractReader from './ContractReader'

export function useProjectMetadata(projectId: BigNumber | undefined) {
  const [metadata, setMetadata] = useState<ProjectMetadata>()

  const uri = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'uri',
    args: projectId ? [projectId.toHexString()] : null,
    formatter: uri => (uri ? ipfsCidUrl(uri) : undefined),
  })

  const getMetadata = async (url: string) => {
    try {
      await Axios.get(url).then(res => setMetadata(res.data))
    } catch (e) {
      console.error('Error getting metadata for uri', uri, e)
    }
  }

  useEffect(() => {
    uri && getMetadata(uri)
  }, [uri])

  return metadata
}
