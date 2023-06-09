import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'

type ProjectAllocationRowProps = {
  projectId: number | undefined
  address: string
  amount?: string
  percent: string
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  address,
  projectId,
  amount,
  percent,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-3 font-medium dark:text-slate-50">
          {projectId ? (
            <>
              <V2V3ProjectHandleLink projectId={projectId} withProjectAvatar />
            </>
          ) : (
            <JuiceboxAccountLink
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
