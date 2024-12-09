import { PV_V2 } from 'constants/pv'
import { ProjectMetadata } from 'models/projectMetadata'
import { PV } from 'models/pv'
import { GetStaticPropsResult } from 'next'
import { getProjectMetadata } from '../metadata'

export interface ProjectPageProps {
  metadata?: ProjectMetadata
  projectId: number
  chainName?: string | null
}

export async function getProjectStaticProps(
  projectId: number,
  pv: PV = PV_V2,
  chainName?: string | undefined,
): Promise<GetStaticPropsResult<ProjectPageProps>> {
  try {
    const metadata = await getProjectMetadata(projectId, pv, chainName)
    if (!metadata) {
      return { notFound: true }
    }

    return {
      props: {
        metadata,
        projectId,
        chainName: chainName ?? null,
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
