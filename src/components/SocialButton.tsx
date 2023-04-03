import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { linkUrl } from 'utils/url'
import ExternalLink from './ExternalLink'

export const SocialButton = ({
  className,
  children,
  link,
  ...props
}: PropsWithChildren<{
  className?: string
  onClick?: () => void
  link: string
  name?: string
  title?: string
}>) => {
  return (
    <ExternalLink
      className={twMerge(
        'border-1 p-30 flex h-10 w-10 items-center justify-center rounded-full',
        'bg-smoke-100 hover:bg-smoke-200 dark:bg-slate-400 dark:hover:bg-slate-500 md:h-9 md:w-9',
        'transition-colors duration-300',
        className,
      )}
      href={linkUrl(link)}
      {...props}
    >
      {children}
    </ExternalLink>
  )
}
