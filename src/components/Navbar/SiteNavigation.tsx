import { Popover, Transition } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { QuickProjectSearchButton } from 'components/QuickProjectSearch/QuickProjectSearchButton'
import { TruncatedText } from 'components/TruncatedText'
import PatchedNextLink from 'components/fixes/PatchedNextLink'
import useMobile from 'hooks/useMobile'
import { Fragment, useEffect, useState } from 'react'
import { DropdownMenu } from './components/DropdownMenu'
import { MobileMenuButton } from './components/HamburgerMenuButton'
import { LogoHomeButton } from './components/LogoHomeButton'
import NavLanguageSelector from './components/NavLanguageSelector'
import ThemePicker from './components/ThemePicker'
import { TransactionsList } from './components/TransactionList/TransactionsList'
import { WalletButton } from './components/Wallet/WalletButton'

export function SiteNavigation() {
  const [hasMounted, setHasMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return isMobile ? <MobileSiteNavigation /> : <DesktopSiteNavigation />
}

const DesktopSiteNavigation = () => {
  return (
    <div className="z-20 w-full min-w-0 px-6 xl:px-20">
      <nav className="flex items-center gap-12 bg-white px-0 py-4 dark:bg-slate-900">
        <>
          <div className="flex items-center justify-between py-6 px-5 md:inline-flex md:py-0 md:px-0">
            <div className="flex gap-2">
              <LogoHomeButton />
            </div>
          </div>

          <div
            className="stroke-tertiar flex flex-col shadow-lg outline-none md:inline-flex md:max-h-full md:w-full md:min-w-0 md:flex-row md:items-center md:justify-between md:gap-6 md:overflow-y-visible md:border-b-0 md:shadow-none"
            style={{
              maxHeight: 'initial',
              overflowY: 'visible',
            }}
          >
            <div className="stroke-secondary flex min-w-0 flex-col gap-8 border-y py-9 md:w-full md:flex-shrink md:flex-row md:items-center md:justify-between md:border-y-0 md:py-0">
              {/* Main site links */}
              <div className="flex flex-col gap-8 px-4 md:min-w-0 md:flex-shrink md:flex-row md:items-center md:gap-8 md:px-0">
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
                  <TruncatedText text={<Trans>Create a project</Trans>} />
                </PatchedNextLink>
              </div>

              <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-6">
                <div className="flex flex-col gap-8 px-6 md:flex-row md:items-center md:gap-6 md:px-0">
                  <NavLanguageSelector className="md:order-2" />
                  <ThemePicker className="md:order-3" />
                  <QuickProjectSearchButton className="md:order-1" />
                  <TransactionsList listClassName="absolute top-full mt-4 right-0 md:-right-6 md:w-[320px] w-full" />
                </div>
              </div>
            </div>

            <div className="py-6 px-5 md:p-0">
              <WalletButton />
            </div>
          </div>
        </>
      </nav>
    </div>
  )
}

const MobileSiteNavigation = () => {
  return (
    <div className="fixed z-20 w-full min-w-0 md:static md:px-6 xl:px-20">
      <Popover
        className="bg-white dark:bg-slate-900 md:flex md:items-center md:gap-12 md:px-0 md:py-4"
        as="nav"
      >
        {({ open }) => {
          return (
            <>
              <div className="flex items-center justify-between py-6 px-5 md:inline-flex md:py-0 md:px-0">
                <div className="flex gap-2">
                  <LogoHomeButton />
                </div>
                <MobileMenuButton className="md:hidden" open={open} />
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Popover.Panel
                  className="stroke-tertiar flex flex-col shadow-lg outline-none md:inline-flex md:max-h-full md:w-full md:min-w-0 md:flex-row md:items-center md:justify-between md:gap-6 md:overflow-y-visible md:border-b-0 md:shadow-none"
                  style={{
                    maxHeight: 'calc(100vh - 5rem)',
                    overflowY: 'auto',
                  }}
                >
                  <div className="stroke-secondary flex flex-col gap-8 border-y py-9 md:w-full md:flex-shrink md:flex-row md:items-center md:justify-between md:border-y-0 md:py-0">
                    {/* Main site links */}
                    <div className="flex flex-col gap-8 px-4 md:min-w-0 md:flex-shrink md:flex-row md:items-center md:gap-8 md:px-0">
                      <PatchedNextLink
                        className="text-primary text-base font-medium md:text-sm"
                        href="/"
                      >
                        <Trans>Home</Trans>
                      </PatchedNextLink>

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
                        <QuickProjectSearchButton className="md:order-1" />
                        <TransactionsList listClassName="absolute top-full mt-4 right-0 md:-right-6 md:w-[320px] w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="py-6 px-5 md:p-0">
                    <WalletButton />
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )
        }}
      </Popover>
    </div>
  )
}

const ResourcesMenu = () => {
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
      id: 'telegram',
      label: t`Join the Telegram`,
      href: 'https://t.me/jbx_eth',
      isExternal: true,
    },
    {
      id: 'contact',
      label: t`Contact`,
      href: '/contact',
    },
  ]

  return (
    <DropdownMenu
      className="text-base md:text-sm"
      items={resourcesMenuItems}
      heading={<Trans>Resources</Trans>}
    />
  )
}
