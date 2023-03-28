import { ProjectMetadata } from 'models/projectMetadata'
import { GetStaticPropsResult } from 'next'
import { getProjectMetadata } from '../metadata'

export interface ProjectPageProps {
  metadata?: ProjectMetadata
  projectId: number
}

export async function getProjectStaticProps(
  projectId: number,
): Promise<GetStaticPropsResult<ProjectPageProps>> {
  try {
    const metadata = await getProjectMetadata(projectId)
    if (!metadata) {
      return { notFound: true }
    }

    return {
      props: {
        metadata,
        projectId,
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
