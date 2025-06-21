import { Button, Modal, Spin } from 'antd'
import { JBChainId, useSuckers } from 'juice-sdk-react'
import { useCallback, useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import { Trans } from '@lingui/macro'
import { NETWORKS } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { twMerge } from 'tailwind-merge'

export interface QueueSafeTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  title: React.ReactNode
  description: React.ReactNode
  onExecuteChain: (chainId: JBChainId) => Promise<void>
  buttonTextOverride?: {
    completed?: React.ReactNode
    connectWallet?: React.ReactNode
    switchChain?: (chainName: string) => React.ReactNode
    execute?: (chainName: string) => React.ReactNode
  }
}

export default function QueueSafeTxsModal({
  open,
  onCancel,
  title,
  description,
  onExecuteChain,
  buttonTextOverride,
}: QueueSafeTxsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingChainId, setLoadingChainId] = useState<JBChainId | null>(null)
  const [completedChains, setCompletedChains] = useState<Set<JBChainId>>(new Set())
  
  const { chain: walletChain, changeNetworks, connect, userAddress } = useWallet()
  
  const { data: suckers } = useSuckers()
  const chains = useMemo(() => {
    if (!suckers?.length) return []
    return suckers.map((sucker) => sucker.peerChainId).filter(Boolean) as JBChainId[]
  }, [suckers])

  const handleExecuteOnChain = useCallback(async (chainId: JBChainId) => {
    // Check if wallet is connected
    if (!userAddress) {
      await connect()
      return
    }

    // Check if user needs to switch chains first
    const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
    const walletConnectedToWrongChain = chainId !== walletChainId
    
    if (walletConnectedToWrongChain) {
      try {
        await changeNetworks(chainId)
        emitInfoNotification(
          `Network changed to ${NETWORKS[chainId]?.label || chainId}, please try again.`,
        )
      } catch (error: unknown) {
        console.error('Failed to change networks:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        emitErrorNotification(`Failed to switch to ${NETWORKS[chainId]?.label || chainId}: ${errorMessage}`)
      }
      return
    }

    setIsLoading(true)
    setLoadingChainId(chainId)
    
    try {
      await onExecuteChain(chainId)
      // Mark this chain as completed
      setCompletedChains(prev => new Set([...prev, chainId]))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to execute transaction on chain', chainId, error)
      emitErrorNotification(`Failed to execute transaction on chain ${chainId}: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      setLoadingChainId(null)
    }
  }, [userAddress, walletChain, changeNetworks, connect, onExecuteChain])

  const allChainsCompleted = chains.length > 0 && chains.every((chainId: JBChainId) => completedChains.has(chainId))

  const handleCancel = useCallback(() => {
    setCompletedChains(new Set())
    setLoadingChainId(null)
    onCancel()
  }, [onCancel])

  const getChainName = (chainId: JBChainId): string => {
    return NETWORKS[chainId]?.label || `Chain ${chainId}`
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={title}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isLoading}>
          <Trans>Cancel</Trans>
        </Button>,
        allChainsCompleted && (
          <Button key="done" type="primary" onClick={handleCancel}>
            <Trans>Done</Trans>
          </Button>
        ),
      ].filter(Boolean)}
      width={600}
    >
      <div className="space-y-4">
        <div className="text-sm text-grey-500 dark:text-slate-200">
          {description}
        </div>

        {chains.length === 0 && (
          <div className="text-center py-8">
            <Spin />
            <div className="mt-2 text-sm text-grey-500">
              <Trans>Loading project chains...</Trans>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {chains.map((chainId: JBChainId) => {
            const isCompleted = completedChains.has(chainId)
            const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
            const isCurrentChain = walletChainId === chainId
            const walletConnectedToWrongChain = walletChain && chainId !== walletChainId
            const isLoadingThisChain = loadingChainId === chainId
            const chainName = getChainName(chainId)
            
            // Determine button text based on wallet state
            let buttonText: React.ReactNode
            if (isCompleted) {
              buttonText = buttonTextOverride?.completed || <Trans>Completed</Trans>
            } else if (!walletChain) {
              buttonText = buttonTextOverride?.connectWallet || <Trans>Connect wallet</Trans>
            } else if (walletConnectedToWrongChain) {
              buttonText = buttonTextOverride?.switchChain ? 
                buttonTextOverride.switchChain(chainName) : 
                <Trans>Switch to {chainName}</Trans>
            } else {
              buttonText = buttonTextOverride?.execute ? 
                buttonTextOverride.execute(chainName) : 
                <Trans>Execute on {chainName}</Trans>
            }
            
            return (
              <div key={chainId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={twMerge(
                    "w-3 h-3 rounded-full",
                    isCompleted ? "bg-green-500" : "bg-grey-300"
                  )} />
                  <div>
                    <div className="font-medium">{chainName}</div>
                    {isCurrentChain && (
                      <div className="text-xs text-blue-500">
                        <Trans>Currently connected</Trans>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  type={isCompleted ? "default" : "primary"}
                  onClick={() => handleExecuteOnChain(chainId)}
                  loading={isLoadingThisChain}
                  disabled={isCompleted || (isLoading && loadingChainId !== chainId)}
                >
                  {buttonText}
                </Button>
              </div>
            )
          })}
        </div>

        {allChainsCompleted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-medium">
              <Trans>All transactions completed!</Trans>
            </div>
            <div className="text-green-600 text-sm mt-1">
              <Trans>
                Transactions have been completed on all chains. You can now close this modal.
              </Trans>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
