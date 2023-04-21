import { Menu } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import QuickProjectSearch from 'components/QuickProjectSearch'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import { DropdownMenu } from './components/DropdownMenu'
import { MobileMenuButton } from './components/HamburgerMenuButton'
import { LogoHomeButton } from './components/LogoHomeButton'
import NavLanguageSelector from './components/NavLanguageSelector'
import ThemePicker from './components/ThemePicker'
import WalletButton from './components/Wallet/WalletButton'

export default function SiteNavigation() {
  const isMobile = useMobile()
  const { isConnected, disconnect } = useWallet()

  return (
    <div className="fixed z-10 w-full md:static md:px-20">
      <Menu
        className="bg-l0 p-4 md:flex md:items-center md:gap-10 md:px-0 md:py-6"
        as="nav"
      >
        {({ open }) => (
          <>
            <div className="flex items-center justify-between md:inline-flex">
              <LogoHomeButton />
              <MobileMenuButton className="md:hidden" open={open} />
            </div>
            <Menu.Items
              static={!isMobile}
              className="stroke-tertiary flex flex-col gap-5 border-b pt-8 pb-4 md:inline-flex md:w-full md:min-w-0 md:flex-row md:items-center md:justify-between md:border-b-0 md:p-0"
            >
              {/* Main site links */}
              <div className="flex flex-col gap-4 px-6 md:min-w-0 md:flex-shrink md:flex-row md:gap-8 md:px-0">
                {isMobile && (
                  <Menu.Item>
                    <PatchedNextLink
                      className="text-primary font-medium"
                      href="/"
                    >
                      <Trans>Home</Trans>
                    </PatchedNextLink>
                  </Menu.Item>
                )}
                <Menu.Item>
                  <PatchedNextLink
                    className="text-primary font-medium md:text-sm"
                    href="/projects"
                  >
                    <Trans>Explore</Trans>
                  </PatchedNextLink>
                </Menu.Item>
                <ResourcesMenu />
                <Menu.Item>
                  <PatchedNextLink
                    className="text-primary font-medium md:min-w-0 md:max-w-xs md:truncate md:text-sm"
                    href="/create"
                  >
                    <Trans>Create a project</Trans>
                  </PatchedNextLink>
                </Menu.Item>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:gap-6 md:px-0">
                  <NavLanguageSelector className="md:order-2" />
                  <ThemePicker className="md:order-3" />
                  <QuickProjectSearch className="md:order-1" />
                </div>

                <WalletButton />
                {isConnected && (
                  <Button className="md:hidden" onClick={disconnect} block>
                    <Trans>Disconnect</Trans>
                  </Button>
                )}
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

const resourcesMenuItems = [
  {
    id: 'join-discord',
    label: t`Join our Discord`,
    href: 'https://discord.gg/wFTh4QnDzk',
    isExternal: true,
  },
  {
    id: 'dao',
    label: t`JuiceboxDAO`,
    href: '/@juicebox',
  },
  {
    id: 'docs',
    label: t`Docs`,
    href: 'https://docs.juicebox.money/',
    isExternal: true,
  },
  {
    id: 'podcast',
    label: t`Podcast`,
    href: 'https://podcast.juicebox.money/',
    isExternal: true,
  },
  {
    id: 'contact',
    label: t`Contact`,
    href: '/contact',
  },
]

const ResourcesMenu = () => (
  <DropdownMenu items={resourcesMenuItems} heading={t`Resources`} />
)
