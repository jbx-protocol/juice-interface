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
  const metadata = await getProjectMetadata(projectId, pv, chainId)
  // `undefined` is a project that doesn't exist. `null` is one whose metadata
  // can't be served right now: the dashboard reads its own data in the browser
  // and this only fills the SEO tags, so serve the page and let them degrade.
  // The caller's short `revalidate` picks the metadata back up on its own.
  if (metadata === undefined) {
    return { notFound: true }
  }

  return {
    props: {
      ...(metadata ? { metadata } : {}),
      projectId,
      chainId: chainId ?? null,
    },
  }
}
