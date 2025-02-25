import { PV_V2 } from 'constants/pv'
import { JBChainId } from 'juice-sdk-core'
import { ProjectMetadata } from 'models/projectMetadata'
import { PV } from 'models/pv'
import { GetStaticPropsResult } from 'next'
import { getProjectMetadata } from '../metadata'

export interface ProjectPageProps {
  metadata?: ProjectMetadata
  projectId: number
  chainId?: JBChainId | null
}

export async function getProjectStaticProps(
  projectId: number,
  pv: PV = PV_V2,
  chainId?: JBChainId | undefined,
): Promise<GetStaticPropsResult<ProjectPageProps>> {
  try {
    const metadata = await getProjectMetadata(projectId, pv, chainId)
    if (!metadata) {
      return { notFound: true }
    }

    return {
      props: {
        metadata,
        projectId,
        chainId: chainId ?? null,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (
      e?.response?.status === 404 ||
      e?.response?.status === 400 ||
      e?.response?.status === 403
    ) {
      return { notFound: true }
    }

    throw e
  }
}
