import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Tabs } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Grid from 'components/Grid'
import { Etherscan } from 'components/icons/Etherscan'
import Loading from 'components/Loading'
import Paragraph from 'components/Paragraph'
import SocialLinks from 'components/Project/ProjectHeader/SocialLinks'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { SocialButton } from 'components/SocialButton'
import WalletContributionCard from 'components/WalletContributionCard'
import {
  OrderDirection,
  Participant_OrderBy,
  useWalletContributionsQuery,
} from 'generated/graphql'
import useMobile from 'hooks/useMobile'
import { useMyProjectsQuery } from 'hooks/useProjects'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useWallet } from 'hooks/Wallet'
import { client } from 'lib/apollo/client'
import { Profile } from 'models/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { isEqualAddress } from 'utils/address'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { etherscanLink } from 'utils/etherscan'

function ProjectsList({ projects }: { projects: ProjectCardProject[] }) {
  return (
    <Grid>
      {projects?.map(p => (
        <ProjectCard project={p} key={p.id} />
      ))}
    </Grid>
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

  const contributions = data?.participants

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
          <WalletContributionCard contribution={c} key={c.project.id} />
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
