import { Trans } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useEnsName } from 'hooks/ensName'
import { useHoldingsProjectsQuery, useMyProjectsQuery } from 'hooks/Projects'
import { truncateEthAddress } from 'utils/format/formatAddress'

export function AddressDashboard({ address }: { address: string }) {
  const { data: myProjects, isLoading: myProjectsLoading } =
    useMyProjectsQuery(address)
  const { data: holdingProjects, isLoading: holdingsLoading } =
    useHoldingsProjectsQuery(address)
  const ensName = useEnsName(address)

  const isLoading = myProjectsLoading || holdingsLoading

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="flex flex-wrap items-start justify-between">
        <div className="mb-10 ">
          <h1 className="text-4xl text-black dark:text-slate-100">
            {ensName ?? <FormattedAddress address={address} />}
          </h1>
          {ensName && <span>{truncateEthAddress({ address })}</span>}
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-base text-black dark:text-slate-100">
          <Trans>Projects created</Trans>
        </h2>
        {myProjects && myProjects.length > 0 ? (
          <Grid>
            {myProjects?.map(p => (
              <ProjectCard project={p} key={p.id} />
            ))}
          </Grid>
        ) : (
          <span>
            <Trans>None</Trans>
          </span>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base text-black dark:text-slate-100">
          <Trans>Contributions</Trans>
        </h2>
        {holdingProjects && holdingProjects.length > 0 ? (
          <Grid>
            {holdingProjects?.map(p => (
              <ProjectCard project={p} key={p.id} />
            ))}
          </Grid>
        ) : (
          <span>
            <Trans>None</Trans>
          </span>
        )}
      </section>
    </div>
  )
}
