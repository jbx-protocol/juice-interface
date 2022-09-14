import { AppWrapper, SEO } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import { FeedbackFormButton } from 'components/FeedbackFormButton'
import Loading from 'components/Loading'
import NewDeployNotAvailable from 'components/NewDeployNotAvailable'
import Project404 from 'components/Project404'
import ScrollToTopButton from 'components/ScrollToTopButton'
import V1Project from 'components/v1/V1Project'
import { layouts } from 'constants/styles/layouts'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { projectTypes } from 'constants/v1/projectTypes'
import {
  V1ProjectContext,
  V1ProjectContextType,
} from 'contexts/v1/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useBalanceOfProject from 'hooks/v1/contractReader/BalanceOfProject'
import useCurrentFundingCycleOfProject from 'hooks/v1/contractReader/CurrentFundingCycleOfProject'
import useCurrentPayoutModsOfProject from 'hooks/v1/contractReader/CurrentPayoutModsOfProject'
import useCurrentTicketModsOfProject from 'hooks/v1/contractReader/CurrentTicketModsOfProject'
import useOverflowOfProject from 'hooks/v1/contractReader/OverflowOfProject'
import useOwnerOfProject from 'hooks/v1/contractReader/OwnerOfProject'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import useQueuedFundingCycleOfProject from 'hooks/v1/contractReader/QueuedFundingCycleOfProject'
import useQueuedPayoutModsOfProject from 'hooks/v1/contractReader/QueuedPayoutModsOfProject'
import useQueuedTicketModsOfProject from 'hooks/v1/contractReader/QueuedTicketModsOfProject'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { V1UserProvider } from 'providers/v1/UserProvider'
import { V1CurrencyProvider } from 'providers/v1/V1CurrencyProvider'
import { useMemo } from 'react'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'
import { findProjectMetadata } from 'utils/server'
import { V1CurrencyName } from 'utils/v1/currency'
import { getTerminalName, getTerminalVersion } from 'utils/v1/terminals'

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V1_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { cv_in: ['1', '1.1'] },
      },
    })
    const paths = projects
      .map(({ handle }) =>
        handle
          ? {
              params: { handle },
            }
          : undefined,
      )
      .filter((i): i is { params: { handle: string } } => !!i)
    return { paths, fallback: true }
  }

  return { paths: [{ params: { handle: 'juicebox' } }], fallback: true }
}

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV4
  handle: string
}> = async context => {
  if (!context.params) throw new Error('params not supplied')
  const handle = context.params.handle as string
  const projects = await paginateDepleteProjectsQueryCall({
    variables: {
      where: { cv_in: ['1', '1.1'], handle },
      first: 1,
    },
  })
  if (!projects[0]?.metadataUri) {
    throw new Error(`Failed to load metadata uri for ${context.params}`)
  }

  try {
    const metadata = await findProjectMetadata({
      metadataCid: projects[0].metadataUri,
    })
    return { props: { metadata, handle } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }
    throw e
  }
}

export default function V1HandlePage({
  metadata,
  handle,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Checks URL to see if user was just directed from project deploy
  return (
    <>
      {metadata ? (
        <SEO
          title={metadata.name}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}p/${handle}`}
          description={metadata.description}
          twitter={{
            card: 'summary',
            creator: metadata.twitter,
            handle: metadata.twitter,
            image: metadata.logoUri,
            site: metadata.twitter,
          }}
        >
          <DesmosScript />
        </SEO>
      ) : null}
      <AppWrapper>
        {metadata ? (
          <V1UserProvider>
            <V1Dashboard metadata={metadata} />
          </V1UserProvider>
        ) : (
          <Loading />
        )}
      </AppWrapper>
    </>
  )
}

function V1Dashboard({ metadata }: { metadata: ProjectMetadataV4 }) {
  const router = useRouter()

  // Checks URL to see if user was just directed from project deploy
  const handle = router.query.handle as string
  const isNewDeploy = Boolean(router.query.newDeploy)

  const projectId = useProjectIdForHandle(handle)
  const owner = useOwnerOfProject(projectId)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const terminalVersion = getTerminalVersion(terminalAddress)
  const currentFC = useCurrentFundingCycleOfProject(
    projectId?.toNumber(),
    terminalName,
  )
  const queuedFC = useQueuedFundingCycleOfProject(projectId)
  const currentPayoutMods = useCurrentPayoutModsOfProject(
    projectId,
    currentFC?.configured,
  )
  const queuedPayoutMods = useQueuedPayoutModsOfProject(
    projectId,
    queuedFC?.configured,
  )
  const currentTicketMods = useCurrentTicketModsOfProject(
    projectId,
    currentFC?.configured,
  )
  const queuedTicketMods = useQueuedTicketModsOfProject(
    projectId,
    queuedFC?.configured,
  )
  const tokenAddress = useTokenAddressOfProject(projectId)
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const balance = useBalanceOfProject(projectId?.toNumber(), terminalName)
  const converter = useCurrencyConverter()
  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
        'ETH',
      ),
    [balance, converter, currentFC],
  )
  const overflow = useOverflowOfProject(projectId, terminalName)

  const { data: projects } = useProjectsQuery({
    projectId: projectId?.toNumber(),
    keys: ['createdAt', 'totalPaid'],
  })

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  const project = useMemo<V1ProjectContextType>(() => {
    const projectType = projectId
      ? projectTypes[projectId.toNumber()]
      : 'standard'
    const isPreviewMode = false
    const isArchived = projectId
      ? V1ArchivedProjectIds.includes(projectId.toNumber()) ||
        metadata?.archived
      : false

    return {
      createdAt,
      projectId: projectId?.toNumber(),
      projectType,
      owner,
      earned,
      handle,
      metadata,
      currentFC,
      queuedFC,
      currentPayoutMods,
      currentTicketMods,
      queuedPayoutMods,
      queuedTicketMods,
      tokenAddress,
      tokenSymbol,
      balance,
      balanceInCurrency,
      overflow,
      isPreviewMode,
      isArchived,
      cv: terminalVersion,
      terminal: {
        address: terminalAddress,
        name: terminalName,
        version: terminalVersion,
      },
    }
  }, [
    balance,
    balanceInCurrency,
    overflow,
    createdAt,
    currentFC,
    currentPayoutMods,
    currentTicketMods,
    earned,
    handle,
    metadata,
    owner,
    projectId,
    queuedFC,
    queuedPayoutMods,
    queuedTicketMods,
    tokenAddress,
    tokenSymbol,
    terminalVersion,
    terminalName,
    terminalAddress,
  ])

  if (!projectId) return <Loading />

  if (projectId?.eq(0)) {
    if (isNewDeploy) {
      return <NewDeployNotAvailable handleOrId={handle} />
    }
    return <Project404 projectId={handle} />
  }

  if (!projectId || !handle || !metadata) return null

  return (
    <V1ProjectContext.Provider value={project}>
      <V1CurrencyProvider>
        <div style={layouts.maxWidth}>
          <V1Project />
          <div style={{ textAlign: 'center', padding: 20 }}>
            <ScrollToTopButton />
          </div>
          <FeedbackFormButton projectHandle={handle} />
        </div>
      </V1CurrencyProvider>
    </V1ProjectContext.Provider>
  )
}
