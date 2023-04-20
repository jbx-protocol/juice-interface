import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Skeleton, Tabs } from 'antd'
import { ArchivedBadge } from 'components/ArchivedBadge'
import ETHAmount from 'components/currency/ETHAmount'
import EthereumAddress from 'components/EthereumAddress'
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
import {
  OrderDirection,
  Participant_OrderBy,
  useWalletContributionsQuery,
  WalletContributionsQuery,
} from 'generated/graphql'
import useMobile from 'hooks/useMobile'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { useMyProjectsQuery } from 'hooks/useProjects'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useWallet } from 'hooks/Wallet'
import client from 'lib/apollo/client'
import { Profile } from 'models/database'
import { PV } from 'models/pv'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { isEqualAddress } from 'utils/address'
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

export type WalletContribution = WalletContributionsQuery['participants'][0] & {
  volume: BigNumber
  pv: PV
}

function ParticipantContribution({
  contribution,
}: {
  contribution: WalletContribution
}) {
  const { pv, projectId, project, volume, lastPaidTimestamp } = contribution

  const { data: metadata } = useProjectMetadata(project.metadataUri)

  const isArchived =
    (pv === PV_V1 && V1ArchivedProjectIds.includes(projectId)) ||
    (pv === PV_V2 && V2ArchivedProjectIds.includes(projectId)) ||
    metadata?.archived

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision = volume?.gt(0) && volume.lt(constants.WeiPerEther) ? 2 : 0

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
          <ETHAmount amount={volume} precision={precision} />
        </div>

        <div className="text-black dark:text-slate-100">
          Last paid {formatDate(lastPaidTimestamp * 1000, 'YYYY-MM-DD')}
        </div>
      </div>
      {isArchived && <ArchivedBadge />}
      {!metadata && <Loading />}
    </div>
  )
}

function ContributedList({ address }: { address: string }) {
  const [orderBy, setOrderBy] = useState<Participant_OrderBy>(
    Participant_OrderBy.volume,
  )

  const { data, loading: contributionsLoading } = useWalletContributionsQuery({
    client,
    variables: {
      wallet: address.toLowerCase(),
      orderBy,
      orderDirection: OrderDirection.desc,
    },
  })

  const contributions = data?.participants.map(p => ({
    ...p,
    volume: BigNumber.from(p.volume),
    pv: p.pv as PV,
  }))

  const { userAddress } = useWallet()

  if (contributionsLoading) return <Loading />

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
    <div>
      <Select className="mb-6 w-44" value={orderBy} onChange={setOrderBy}>
        <Select.Option value={Participant_OrderBy.volume}>
          <Trans>Highest paid</Trans>
        </Select.Option>
        <Select.Option value={Participant_OrderBy.lastPaidTimestamp}>
          <Trans>Recent</Trans>
        </Select.Option>
      </Select>

      <Grid>
        {contributions?.map(c => (
          <ParticipantContribution contribution={c} key={c.project.id} />
        ))}
      </Grid>
    </div>
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
  ensName: string | null | undefined
  profile: Profile | null | undefined
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

  const isOwner = isEqualAddress(wallet.userAddress, address.toLowerCase())

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
              <h1 className="mb-0 font-heading text-4xl font-medium text-black dark:text-slate-100">
                {ensName ?? <EthereumAddress address={address} />}
              </h1>
              {ensName && (
                <EthereumAddress
                  ensDisabled
                  address={address}
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
                <Trans>Settings</Trans>
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
