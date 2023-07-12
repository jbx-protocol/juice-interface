import { PlusIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { EmptyScreen } from '../EmptyScreen'

export const UpdatesPanel = () => {
  const { projectOwnerAddress } = useProjectContext()
  const isProjectOwner = useIsUserAddress(projectOwnerAddress)

  const emptyScreenMessage = isProjectOwner
    ? t`Your project has no updates`
    : t`This project has no updates`

  return (
    <div className="flex flex-col items-center gap-6">
      <EmptyScreen title={emptyScreenMessage} />
      {isProjectOwner && (
        <Button
          className="flex w-fit items-center gap-2"
          type="primary"
          icon={<PlusIcon className="h-5 w-5" />}
        >
          <Trans>Add project update</Trans>
        </Button>
      )}
    </div>
  )
}
