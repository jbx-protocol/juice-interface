import { Tooltip } from 'antd'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { linkUrl } from 'utils/url'
import ExternalLink from '../ExternalLink'

export const SocialButton = ({
  className,
  children,
  link,
  tooltip,
  tooltipPlacement,
  ...props
}: PropsWithChildren<{
  className?: string
  onClick?: () => void
  link: string
  tooltip?: string
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
}>) => {
  return (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      <ExternalLink
        className={twMerge(
          'border-1 p-30 flex h-10 w-10 items-center justify-center rounded-full',
          'bg-smoke-100 text-smoke-600 hover:bg-smoke-200 dark:bg-slate-400 dark:text-slate-100 dark:hover:bg-slate-500 md:h-9 md:w-9',
          'transition-colors duration-100',
          className,
        )}
        href={linkUrl(link)}
        {...props}
      >
        {children}
      </ExternalLink>
    </Tooltip>
  )
}
