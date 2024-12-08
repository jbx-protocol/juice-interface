/* eslint-disable @typescript-eslint/no-explicit-any */
import { PV_V1, PV_V2, PV_V4 } from 'constants/pv'
import { PV } from 'models/pv'
import { findProjectMetadata } from './ipfs'

/**
 * Server-side function. Returns the metadata for a v2v3 or v4 project.
 */
export const getProjectMetadata = async (
  projectId: string | number,
  pv: PV = PV_V2,
  chain?: string | undefined,
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
      const { getV4ProjectMetadata } = await import('./v4Metadata')
      return getV4ProjectMetadata(projectId, chain)
  }
}
