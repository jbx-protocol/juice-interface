import { useMemo } from 'react'
import { Button, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'

import { useCartSummary } from '../hooks/useCartSummary'
import { useProjectIsOFACListed } from '../../../hooks/useProjectIsOFACListed'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject, walletConnected } = useCartSummary()
  const { isAddressListedInOFAC, isLoading: isOFACChecking } =
    useProjectIsOFACListed()

  const isLoading = useMemo(() => {
    return Boolean(walletConnected && isOFACChecking)
  }, [walletConnected, isOFACChecking])

  const isDisabled = useMemo(() => {
    return Boolean(walletConnected && isAddressListedInOFAC)
  }, [isAddressListedInOFAC, walletConnected])

  return (
    <Tooltip
      title={t`You can't pay this project because your wallet address failed compliance check.`}
      placement="top"
      open={isDisabled ? undefined : false}
    >
      <Button
        className={className}
        type="primary"
        onClick={payProject}
        loading={isLoading}
        disabled={isDisabled}
      >
        <span>
          {walletConnected ? (
            <Trans>Pay project</Trans>
          ) : (
            <Trans>Connect wallet</Trans>
          )}
        </span>
      </Button>
    </Tooltip>
  )
}
