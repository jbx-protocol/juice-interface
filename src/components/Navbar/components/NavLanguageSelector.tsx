import { LanguageIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { SUPPORTED_LANGUAGES } from 'constants/locale'
import { useCallback, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { reloadWindow } from 'utils/windowUtils'
import { DropdownMenu } from './DropdownMenu'

// Language select tool seen in top nav
export default function NavLanguageSelector({
  className,
}: {
  className?: string
}) {
  // Sets the new language with localStorage and reloads the page
  const setLanguage = useCallback((newLanguage: string) => {
    localStorage.setItem('lang', newLanguage)
    reloadWindow()
  }, [])

  const currentLanguage = useMemo(
    () => localStorage.getItem('lang') ?? 'en',
    [],
  )

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
            <Trans>{SUPPORTED_LANGUAGES[currentLanguage].short}</Trans>
          </span>
        </div>
      }
      items={Object.values(SUPPORTED_LANGUAGES).map(lang => ({
        id: lang.code,
        label: lang.long,
        onClick: () => {
          setLanguage(lang.code)
        },
      }))}
    />
  )
}
