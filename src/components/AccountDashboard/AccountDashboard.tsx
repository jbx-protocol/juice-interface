import { t, Trans } from '@lingui/macro'
import { Button, Tabs } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { useEnsName } from 'hooks/ensName'
import { useHoldingsProjectsQuery, useMyProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { truncateEthAddress } from 'utils/format/formatAddress'

function ProjectsList({ projects }: { projects: ProjectCardProject[] }) {
  return (
    <Grid>
      {projects?.map(p => (
        <ProjectCard project={p} key={p.id} />
      ))}
    </Grid>
  )
}

function HoldingsList({ address }: { address: string }) {
  const { data: holdings, isLoading: myProjectsLoading } =
    useHoldingsProjectsQuery(address)

  const { userAddress } = useWallet()

  if (myProjectsLoading) return <Loading />

  if (!holdings || holdings.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't contributed to any projects yet!</Trans>
            </p>
            <Link href="/projects">
              <a>
                <Button type="primary">
                  <Trans>Explore projects</Trans>
                </Button>
              </a>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't contributed to any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={holdings} />
}

function MyProjectsList({ address }: { address: string }) {
  const { data: myProjects, isLoading: myProjectsLoading } =
    useMyProjectsQuery(address)

  const { userAddress } = useWallet()

  if (myProjectsLoading) return <Loading />

  if (!myProjects || myProjects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't created any projects yet!</Trans>
            </p>

            <Link href="/create">
              <a>
                <Button type="primary">
                  <Trans>Create project</Trans>
                </Button>
              </a>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't created any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={myProjects} />
}

export function AccountDashboard({ address }: { address: string }) {
  const ensName = useEnsName(address)

  const items = [
    {
      label: t`Contributions`,
      key: 'holding',
      children: <HoldingsList address={address} />,
    },
    {
      label: t`Projects created`,
      key: 'created',
      children: <MyProjectsList address={address} />,
    },
  ]

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="flex flex-wrap items-start justify-between">
        <div className="mb-10 flex">
          <ProjectLogo
            uri={undefined}
            name={ensName ?? undefined}
            className="mr-5 h-32 w-32"
          />
          <div>
            <h1 className="mb-2 text-4xl text-black dark:text-slate-100">
              {ensName ?? <FormattedAddress address={address} />}
            </h1>
            {ensName && (
              <span>
                <EtherscanLink
                  type="address"
                  value={truncateEthAddress({ address })}
                  className="text-grey-500 dark:text-slate-100"
                />
              </span>
            )}
          </div>
        </div>
      </header>

      <Tabs items={items} />
    </div>
  )
}
