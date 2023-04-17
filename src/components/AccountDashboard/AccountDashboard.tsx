import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Skeleton, Tabs } from 'antd'
import { Badge } from 'components/Badge'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import { Etherscan } from 'components/icons/Etherscan'
import Loading from 'components/Loading'
import Paragraph from 'components/Paragraph'
import SocialLinks from 'components/Project/ProjectHeader/SocialLinks'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { SocialButton } from 'components/SocialButton'
import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import useMobile from 'hooks/Mobile'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import {
  useMyProjectsQuery,
  useParticipantContributions,
  useProjectsQuery,
} from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/WalletSignIn'
import { Profile } from 'models/database'
import { ProjectMetadata } from 'models/projectMetadata'
import { PV } from 'models/pv'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { etherscanLink } from 'utils/etherscan'
import { formatDate } from 'utils/format/formatDate'

function ProjectsList({ projects }: { projects: ProjectCardProject[] }) {
  return (
    <Grid>
      {projects?.map(p => (
        <ProjectCard project={p} key={p.id} />
      ))}
    </Grid>
  )
}

function ArchivedBadge() {
  return (
    <div className="absolute top-0 right-0 bg-smoke-100 py-0.5 px-1 text-xs font-medium text-grey-400 dark:bg-slate-600 dark:text-slate-200">
      <Trans>ARCHIVED</Trans>
    </div>
  )
}

export type Contribution = {
  totalPaid: BigNumber
  projectId: number
  pv: PV
  lastPaidTimestamp: number
}

function ParticipantContribution({
  projectId,
  totalPaid,
  lastPaidTimestamp,
  metadata,
  pv,
}: {
  projectId: number
  totalPaid: BigNumber
  lastPaidTimestamp: number
  metadata: ProjectMetadata | undefined
  pv: PV
}) {
  const isArchived =
    (pv === PV_V1 && V1ArchivedProjectIds.includes(projectId)) ||
    (pv === PV_V2 && V2ArchivedProjectIds.includes(projectId)) ||
    metadata?.archived

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    totalPaid?.gt(0) && totalPaid.lt(constants.WeiPerEther) ? 2 : 0

  return (
    <div className="relative flex cursor-pointer items-center overflow-hidden whitespace-pre rounded-lg bg-white py-4 dark:bg-slate-600 md:border md:border-smoke-300 md:py-6 md:px-5 md:transition-colors md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100">
      <div className="mr-5">
        <ProjectLogo
          className="h-20 w-20 md:h-24 md:w-24"
          uri={metadata?.logoUri}
          name={metadata?.name}
          projectId={projectId}
        />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden overflow-ellipsis font-normal">
        {metadata ? (
          <span className="m-0 font-heading text-xl leading-8 text-black dark:text-slate-100">
            {metadata.name}
          </span>
        ) : (
          <Skeleton paragraph={false} title={{ width: 120 }} active />
        )}

        <div className="font-medium text-black dark:text-slate-100">
          <ETHAmount amount={totalPaid} precision={precision} />
        </div>

        <div className="text-black dark:text-slate-100">
          Last paid {formatDate(lastPaidTimestamp * 1000)}
        </div>
      </div>
      {isArchived && <ArchivedBadge />}
      {!metadata && <Loading />}
    </div>
  )
}

function V1ParticipantContribution({
  contribution,
}: {
  contribution: Contribution
}) {
  const { data } = useProjectsQuery({
    projectId: contribution?.projectId,
    pv: [PV_V1],
  })

  const { data: metadata } = useProjectMetadata(data?.[0].metadataUri)

  return (
    <ParticipantContribution
      metadata={metadata}
      totalPaid={contribution.totalPaid}
      lastPaidTimestamp={contribution.lastPaidTimestamp}
      projectId={contribution.projectId}
      pv={contribution.pv}
    />
  )
}

function V2V3ParticipantContribution({
  contribution,
}: {
  contribution: Contribution
}) {
  const { data: projects } = useProjectsQuery({
    projectId: contribution?.projectId,
    pv: [PV_V2],
  })

  const { data: metadata } = useProjectMetadata(projects?.[0].metadataUri)

  return (
    <ParticipantContribution
      metadata={metadata}
      totalPaid={contribution.totalPaid}
      lastPaidTimestamp={contribution.lastPaidTimestamp}
      projectId={contribution.projectId}
      pv={contribution.pv}
    />
  )
}

function ContributedList({ address }: { address: string }) {
  const { data: contributions, isLoading: myProjectsLoading } =
    useParticipantContributions(address)

  const { userAddress } = useWallet()

  if (myProjectsLoading) return <Loading />

  if (!contributions || contributions.length === 0)
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

  return (
    <Grid>
      {contributions?.map(c =>
        c.pv === PV_V2 ? (
          <V2V3ParticipantContribution contribution={c} />
        ) : (
          <V1ParticipantContribution contribution={c} />
        ),
      )}
    </Grid>
  )
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

export function AccountDashboard({
  address,
  ensName,
  profile,
}: {
  address: string
  ensName: string | null
  profile: Profile | null
}) {
  const wallet = useWallet()
  const signIn = useWalletSignIn()
  const router = useRouter()

  const [editProfileButtonLoading, setEditProfileButtonLoading] =
    useState(false)

  const onEditProfileClicked = useCallback(async () => {
    setEditProfileButtonLoading(true)
    try {
      await signIn()
      await router.push(`/account/${wallet.userAddress}/edit`)
    } catch (e) {
      console.error('Error occurred while signing in', e)
    } finally {
      setEditProfileButtonLoading(false)
    }
  }, [router, signIn, wallet.userAddress])

  const items = [
    {
      label: t`Contributions`,
      key: 'holding',
      children: <ContributedList address={address} />,
    },
    {
      label: t`Projects created`,
      key: 'created',
      children: <MyProjectsList address={address} />,
    },
  ]

  const isOwner = wallet.userAddress?.toLowerCase() === address.toLowerCase()

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="mb-10">
        <div className="flex flex-wrap items-start justify-between">
          <div className="mb-5 flex">
            <ProjectLogo
              uri={ensAvatarUrlForAddress(address, { size: 128 })}
              name={ensName ?? undefined}
              className="mr-5 h-32 w-32 rounded-full"
            />
            <div className="flex flex-col gap-2">
              <h1 className="mb-0 text-4xl text-black dark:text-slate-100">
                {ensName ?? <FormattedAddress address={address} />}
              </h1>
              {ensName && (
                <EtherscanLink
                  truncated
                  type="address"
                  value={address}
                  className="text-grey-500 dark:text-slate-100"
                />
              )}
              <div className="flex gap-3">
                <EtherscanSocialButton address={address} />
                <SocialLinks
                  infoUri={profile?.website ?? undefined}
                  twitter={profile?.twitter ?? undefined}
                  tooltipPlacement="bottom"
                />
              </div>
            </div>
          </div>
          {isOwner && (
            <Button
              loading={editProfileButtonLoading}
              icon={<SettingOutlined />}
              onClick={onEditProfileClicked}
            >
              <span className="inline-flex gap-3">
                <Trans>Settings</Trans> <Badge variant="info">Beta</Badge>
              </span>
            </Button>
          )}
        </div>
        {profile?.bio && (
          <Paragraph description={profile.bio} characterLimit={250} />
        )}
      </header>

      <Tabs items={items} />
    </div>
  )
}

const EtherscanSocialButton = ({ address }: { address: string }) => {
  const isMobile = useMobile()

  return (
    <SocialButton
      link={etherscanLink('address', address)}
      tooltip="Etherscan"
      tooltipPlacement={'bottom'}
    >
      <Etherscan size={isMobile ? 16 : 14} />
    </SocialButton>
  )
}
