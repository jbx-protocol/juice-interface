import { BigNumberish } from '@ethersproject/bignumber'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export default function V1ProjectHandle({
  className,
  projectId,
  handle,
}: {
  className?: string
  projectId: BigNumberish
  handle?: string | null
}) {
  const _handle = useHandleForProjectId(!handle ? projectId : undefined)
  const handleToRender = handle ?? _handle

  return (
    <Link href={`/p/${handleToRender}`}>
      <a
        className={twMerge(
          'select-all leading-[22px] text-grey-700 hover:text-haze-400 hover:underline dark:text-slate-100',
          className,
        )}
      >
        @{handleToRender}
      </a>
    </Link>
  )
}
