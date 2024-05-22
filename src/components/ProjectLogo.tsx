import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { PV } from 'models/pv'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ProjectLogoBaseProps = {
  className?: string
  name?: string
  projectId?: number
  lazyLoad?: boolean
  fallback?: string | JSX.Element | null
  uri?: string | undefined
  pv?: PV | undefined
}

export default function ProjectLogo({
  className,
  name,
  projectId,
  lazyLoad,
  fallback = '🧃',
  uri,
  pv,
}: ProjectLogoBaseProps) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const imageSrc = useProjectLogoSrc({ projectId, uri, pv })
  const validImg = imageSrc && !srcLoadError

  return (
    <div
      className={twMerge(
        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg text-4xl',
        'bg-smoke-100 dark:bg-slate-700',
        className,
      )}
    >
      {validImg ? (
        <img
          className="h-full w-full object-cover object-center"
          src={imageSrc}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          loading={lazyLoad ? 'lazy' : undefined}
          crossOrigin="anonymous"
          title={name}
        />
      ) : null}

      {!validImg ? <span title={name}>{fallback}</span> : null}
    </div>
  )
}
