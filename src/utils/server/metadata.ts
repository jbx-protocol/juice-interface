/* eslint-disable @typescript-eslint/no-explicit-any */
import { PV_V1, PV_V2, PV_V4, PV_V5 } from 'constants/pv'
import { JBChainId } from 'juice-sdk-core'
import { PV } from 'models/pv'
import { findProjectMetadata } from './ipfs'

/**
 * Server-side function. Returns the metadata for a v2v3, v4, or v5 project.
 */
export const getProjectMetadata = async (
  projectId: string | number,
  pv: PV = PV_V2,
  chainId?: JBChainId | undefined,
) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }
  if (isNaN(projectId)) return undefined

  switch (pv) {
    case PV_V1:
      throw new Error('V1 projects are not supported')
    case PV_V2:
      const { V2V3GetMetadataCidFromContract } = await import('./v2v3Metadata')
      const metadataCid = await V2V3GetMetadataCidFromContract(projectId)
      return findProjectMetadata({ metadataCid })
    case PV_V4:
      const { getV4V5ProjectMetadata: getV4ProjectMetadata } = await import(
        './v4v5Metadata'
      )
      return getV4ProjectMetadata(projectId, chainId, '4')
    case PV_V5:
      const { getV4V5ProjectMetadata: getV5ProjectMetadata } = await import(
        './v4v5Metadata'
      )
      return getV5ProjectMetadata(projectId, chainId, '5')
  }
}
