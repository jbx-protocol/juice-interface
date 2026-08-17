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

    // The dashboard loads its own data in the browser; this metadata only fills
    // in the SEO tags. Throwing here turns an IPFS hiccup into a 500 for a
    // project that exists, so serve the page and let the tags degrade. The
    // caller's short `revalidate` picks the metadata back up on its own.
    console.error('Project metadata unavailable, rendering without it', {
      projectId,
      pv,
      chainId,
      error: e?.message,
    })
    return {
      props: {
        projectId,
        chainId: chainId ?? null,
      },
    }
  }
}
