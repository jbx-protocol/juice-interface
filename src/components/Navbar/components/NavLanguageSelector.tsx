import { LanguageIcon } from '@heroicons/react/24/solid'
import { useLingui } from '@lingui/react'
import { SUPPORTED_LANGUAGES } from 'constants/locale'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { DropdownMenu } from './DropdownMenu'

// Language select tool seen in top nav
export default function NavLanguageSelector({
  className,
}: {
  className?: string
}) {
  const router = useRouter()
  const {
    i18n: { locale },
  } = useLingui()

  return (
    <DropdownMenu
      className={className}
      dropdownClassName={twMerge('md:w-24')}
      disableHover
      hideArrow
      heading={
        <div className="flex items-center gap-4">
          <LanguageIcon className="h-6 w-6" />
          <span className="font-medium md:hidden">
            {SUPPORTED_LANGUAGES[locale].short}
          </span>
        </div>
      }
      items={Object.values(SUPPORTED_LANGUAGES).map(lang => ({
        id: lang.code,
        label: lang.long,
        // TODO: We want to use the bottom but due to a bug in t macros we cant
        // locale: lang.code,
        // href: pathname,
        onClick: async () => {
          await router.push(router.asPath, router.asPath, { locale: lang.code })
          router.reload()
        },
      }))}
    />
  )
}
