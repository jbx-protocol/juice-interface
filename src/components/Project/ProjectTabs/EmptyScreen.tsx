import { t } from '@lingui/macro'
import { useJuiceTheme } from 'contexts/Theme/useJuiceTheme'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

export const EmptyScreen = ({
  className,
  title,
  subtitle,
}: {
  className?: string
  title?: string
  subtitle?: string
}) => {
  title = title || t`There's nothing here`
  const { themeOption } = useJuiceTheme()
  return (
    <div>
      <div
        className={twMerge(
          'relative mx-auto h-48 w-48 md:h-64 md:w-64',
          className,
        )}
      >
        <Image
          className="opacity-25 dark:opacity-50"
          src={`/assets/empty_orange_${themeOption}.png`}
          fill
          alt="Orange dumping out ethereum"
        />
      </div>
      <div className="mt-6 text-center text-grey-500">
        <div className="font-heading text-2xl font-medium dark:text-slate-200">
          {title}
        </div>
        {subtitle && (
          <div className="mt-3 text-base dark:text-slate-300">
            This project has no description.
          </div>
        )}
      </div>
    </div>
  )
}
