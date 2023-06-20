import { PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export function PreviewAddNftButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <Button
      type="primary"
      onClick={onClick}
      className="flex items-center justify-center"
    >
      <PlusIcon className="mr-1 h-6 w-6" />
      <span>
        <Trans>Add NFT</Trans>
      </span>
    </Button>
  )
}
