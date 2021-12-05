import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useEffect } from 'react'
import { utils } from 'ethers'

import Dashboard from 'components/Dashboard'
import { readContract } from 'hooks/ContractReader'
import { getProjectMetadata } from 'hooks/ProjectMetadata'
import { ContractName } from 'models/contract-name'
import { normalizeHandle } from 'utils/formatHandle'
import { ProjectMetadataV3 } from 'models/project-metadata'

import { useState } from 'react'

interface ProjectPageProps {
  handle: string
  projectMetadata: ProjectMetadataV3
}

function ProjectPage({ projectMetadata }: ProjectPageProps) {
  const router = useRouter()
  const { handle } = router.query
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Head>
        <meta property="og:site_name" content="juicebox" />
        <meta
          property="og:url"
          content={`https://juicebox.money/#/p/${handle}`}
        />
        <meta property="og:title" content={projectMetadata.name} />
        <meta property="og:description" content={projectMetadata.description} />
        <meta property="og:type" content="object" />
        <meta property="og:image" content={projectMetadata.logoUri} />
      </Head>
      <Dashboard />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { handle } = context.query

  // Get project id
  const projectId = await readContract({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: [utils.formatBytes32String(normalizeHandle(handle as string))],
  })

  // Get metadata ipfsHash
  const ipfsHash = await readContract<string>({
    contract: ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const projectMetadata = await getProjectMetadata(ipfsHash)

  return { props: { projectMetadata } }
}

export default ProjectPage
