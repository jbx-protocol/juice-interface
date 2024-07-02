import { BigNumberish } from 'ethers'
import Link from 'next/link'
import useHandleForProjectId from 'packages/v1/hooks/contractReader/useHandleForProjectId'
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
    <Link
      href={`/p/${handleToRender}`}
      className={twMerge(
        'select-all leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
        className,
      )}
    >
      @{handleToRender}
    </Link>
  )
}
