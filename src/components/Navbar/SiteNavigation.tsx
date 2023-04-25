import { Popover, Transition } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import QuickProjectSearch from 'components/QuickProjectSearch'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import useMobile from 'hooks/Mobile'
import { Fragment } from 'react'
import { DropdownMenu } from './components/DropdownMenu'
import { MobileMenuButton } from './components/HamburgerMenuButton'
import { LogoHomeButton } from './components/LogoHomeButton'
import NavLanguageSelector from './components/NavLanguageSelector'
import ThemePicker from './components/ThemePicker'
import WalletButton from './components/Wallet/WalletButton'

export default function SiteNavigation() {
  const isMobile = useMobile()

  return (
    <div className="fixed z-10 w-full md:static md:px-20">
      <Popover
        className="bg-l0 md:flex md:items-center md:gap-12 md:px-0 md:py-6"
        as="nav"
      >
        {({ open }) => (
          <>
            <div className="flex items-center justify-between py-6 px-5 md:inline-flex md:py-0 md:px-0">
              <LogoHomeButton />
              <MobileMenuButton className="md:hidden" open={open} />
            </div>

            <Transition
              show={open || !isMobile}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel
                static={!isMobile}
                className="stroke-tertiar flex flex-col shadow-lg outline-none md:inline-flex md:max-h-full md:w-full md:min-w-0 md:flex-row md:items-center md:justify-between md:gap-6 md:overflow-y-visible md:border-b-0 md:shadow-none"
                style={{
                  maxHeight: isMobile ? 'calc(100vh - 5rem)' : 'initial',
                  overflowY: isMobile ? 'auto' : 'visible',
                }}
              >
                <div className="stroke-secondary flex flex-col gap-8 border-y py-9 md:w-full md:flex-shrink md:flex-row md:items-center md:justify-between md:border-y-0 md:py-0">
                  {/* Main site links */}
                  <div className="flex flex-col gap-8 px-4 md:min-w-0 md:flex-shrink md:flex-row md:items-center md:gap-8 md:px-0">
                    {isMobile && (
                      <PatchedNextLink
                        className="text-primary text-base font-medium md:text-sm"
                        href="/"
                      >
                        <Trans>Home</Trans>
                      </PatchedNextLink>
                    )}
                    <PatchedNextLink
                      className="text-primary text-base font-medium md:text-sm"
                      href="/projects"
                    >
                      <Trans>Explore</Trans>
                    </PatchedNextLink>
                    <ResourcesMenu />
                    <PatchedNextLink
                      className="text-primary text-base font-medium md:min-w-0 md:max-w-xs md:truncate md:text-sm"
                      href="/create"
                    >
                      <Trans>Create a project</Trans>
                    </PatchedNextLink>
                  </div>

                  <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-6">
                    <div className="flex flex-col gap-8 px-6 md:flex-row md:items-center md:gap-6 md:px-0">
                      <NavLanguageSelector className="md:order-2" />
                      <ThemePicker className="md:order-3" />
                      <QuickProjectSearch className="md:order-1" />
                    </div>
                  </div>
                </div>

                <div className="py-6 px-5 md:p-0">
                  <WalletButton />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

const resourcesMenuItems = [
  {
    id: 'about',
    label: t`About`,
    href: '/about',
  },
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
  <DropdownMenu
    className="text-base md:text-sm"
    items={resourcesMenuItems}
    heading={t`Resources`}
  />
)
