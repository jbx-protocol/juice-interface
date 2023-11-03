import { GithubFilled, TwitterCircleFilled } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Logo from 'components/Logo'
import Discord from 'components/icons/Discord'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { useWallet } from 'hooks/Wallet'
import { useFetchDeveloperWallets } from 'hooks/useFetchDeveloperWallets'
import { isEqualAddress } from 'utils/address'
import { LinkColProps, LinkColumn } from './LinkColumn'

const ImageButtons = [
  {
    name: 'github',
    image: <GithubFilled />,
    link: 'https://github.com/jbx-protocol',
  },
  {
    name: 'discord',
    image: <Discord size={18} />,
    link: 'https://discord.com/invite/wFTh4QnDzk',
  },
  {
    name: 'twitter',
    image: <TwitterCircleFilled />,
    link: 'https://twitter.com/juiceboxETH',
  },
]

export function Footer() {
  const { userAddress } = useWallet()
  const { data } = useFetchDeveloperWallets()

  const showDeveloperLinks =
    data?.some(wallet => isEqualAddress(wallet.wallet, userAddress)) ?? false

  const LinkCols: LinkColProps[] = [
    {
      title: t`Juicebox`,
      items: [
        {
          title: t`Create project`,
          link: '/create',
        },
        {
          title: t`Explore`,
          link: '/projects',
        },
        {
          title: t`Activity`,
          link: '/activity',
        },
        {
          title: t`About`,
          link: '/about',
        },
        {
          title: t`Request a feature`,
          externalLink: true,
          link: 'https://juicebox.canny.io/feature-requests',
        },
        ...(showDeveloperLinks
          ? [{ title: t`Experimental flags`, link: '/experimental/flags' }]
          : []),
      ],
    },
    {
      title: t`Resources`,
      items: [
        {
          title: t`Docs`,
          externalLink: true,
          link: 'https://docs.juicebox.money',
        },
        {
          title: t`Newsletter`,
          externalLink: true,
          link: 'https://juicenews.beehiiv.com',
        },
        {
          title: t`Podcast`,
          externalLink: true,
          link: 'https://podcasters.spotify.com/pod/show/thejuicecast',
        },
        {
          title: t`Contact`,
          link: '/contact',
        },
      ],
    },
    {
      title: t`Use cases`,
      items: [
        {
          title: t`For fundraising`,
          externalLink: true,
          link: 'https://docs.juicebox.money/blog/jb-for-fundraising/',
        },
        {
          title: t`For charities`,
          externalLink: true,
          link: 'https://docs.juicebox.money/blog/jb-for-charity/',
        },
      ],
      title2: t`Compare`,
      items2: [
        {
          title: t`JB vs. Kickstarter`,
          externalLink: true,
          link: 'https://docs.juicebox.money/blog/kickstarter-vs-juicebox/',
        },
        {
          title: t`JB vs. Gofundme`,
          externalLink: true,
          link: 'https://docs.juicebox.money/blog/gofundme-vs-juicebox/',
        },
        {
          title: t`JB vs. Indiegogo`,
          externalLink: true,
          link: 'https://docs.juicebox.money/blog/indiegogo-vs-juicebox/',
        },
      ],
    },
    {
      title: t`Legal`,
      items: [
        {
          title: t`Legal Resources`,
          link: '/legal',
        },
        {
          title: t`Privacy Policy`,
          link: '/privacy',
        },
        {
          title: t`Terms of Service`,
          externalLink: true,
          link: TERMS_OF_SERVICE_URL,
        },
      ],
    },
  ]

  const gitCommit = process.env.NEXT_PUBLIC_VERSION

  return (
    <footer className="border-t border-t-slate-500 bg-slate-900 px-5 pt-12 text-sm text-slate-100 md:px-12">
      <div className="m-auto max-w-6xl">
        <div className="flex flex-col gap-y-10 md:grid md:grid-cols-6 md:items-start md:gap-x-10">
          <div className="flex flex-col gap-y-5 text-slate-200 md:col-span-2 md:items-start">
            <Logo themeOverride="dark" />
            <Trans>
              Big ups to the Ethereum community for crafting the infrastructure
              and economy to make Juicebox possible.
            </Trans>
          </div>
          {LinkCols.map((props, i) => (
            <LinkColumn key={i} {...props} />
          ))}
        </div>

        <div className="mt-32 flex justify-between border-t border-slate-400 pb-16 pt-5">
          <span className="text-slate-200">© Juicebox 2023</span>

          <div className="flex gap-x-7">
            {gitCommit && <AppVersion gitCommit={gitCommit} />}
            <div className="flex gap-x-4 ">
              {ImageButtons.map(({ name, image, link }) => (
                <ExternalLink
                  key={name}
                  name={name}
                  title={name}
                  className="text-lg leading-none text-slate-200 hover:text-bluebs-500"
                  href={link}
                >
                  {image}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const AppVersion = ({ gitCommit }: { gitCommit: string }) => {
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`
  return (
    <div className="text-slate-200">
      Version:{' '}
      <ExternalLink
        href={gitCommitLink}
        className="text-slate-200 underline hover:text-bluebs-500"
      >
        #{gitCommit}
      </ExternalLink>
    </div>
  )
}
