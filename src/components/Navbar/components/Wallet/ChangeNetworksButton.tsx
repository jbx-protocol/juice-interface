import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'
import { useWallet } from 'hooks/Wallet'

export function ChangeNetworksButton(props: ButtonProps) {
  const { changeNetworks } = useWallet()

  return (
    <Button
      className="border border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100"
      onClick={changeNetworks}
      {...props}
    >
      <span>
        <ExclamationTriangleIcon className="mr-2 inline-flex h-5 w-5 text-warning-500" />
      </span>

      <Trans>Change networks</Trans>
    </Button>
  )
}
