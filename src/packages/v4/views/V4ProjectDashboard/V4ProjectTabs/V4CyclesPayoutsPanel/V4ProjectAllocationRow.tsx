import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import { useRouter } from 'next/router'
import V4ProjectHandleLink from 'packages/v4/components/V4ProjectHandleLink'
import { ReactNode } from 'react'

type V4ProjectAllocationRowProps = {
  projectId: number | undefined
  address: string
  amount?: ReactNode | string
  percent: string
}

export const V4ProjectAllocationRow: React.FC<V4ProjectAllocationRowProps> = ({
  address,
  projectId,
  amount,
  percent,
}) => {
  const router = useRouter()
  const { chainName } = router.query
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-3 truncate font-medium dark:text-slate-50">
          {projectId ? (
            <>
              <V4ProjectHandleLink
                className="truncate"
                containerClassName="truncate"
                chainName={chainName as string}
                projectId={projectId}
                withProjectAvatar
              />
            </>
          ) : (
            <JuiceboxAccountLink
              className="truncate"
              avatarClassName="h-8 w-8 mr-3"
              address={address}
              withEnsAvatar
            />
          )}
        </span>
      </div>
      <div className="flex items-center gap-3 dark:text-slate-200">
        {amount ? (
          <>
            <span>{amount}</span>
            <span>({percent})</span>
          </>
        ) : (
          <span>{percent}</span>
        )}
      </div>
    </div>
  )
}
