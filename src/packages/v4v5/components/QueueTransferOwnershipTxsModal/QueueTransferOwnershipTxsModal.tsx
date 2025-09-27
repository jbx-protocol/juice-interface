import { Button, Modal, Spin, Tooltip } from 'antd'
import { JBChainId, useSuckers } from 'juice-sdk-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import { ApiFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { NETWORKS } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { twMerge } from 'tailwind-merge'
import { Address } from 'viem'

export interface QueueTransferOwnershipTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  title: React.ReactNode
  description: React.ReactNode
  onExecuteChain: (chainId: JBChainId) => Promise<string>
  fromAddress: Address
  toAddress: Address
  buttonTextOverride?: {
    completed?: React.ReactNode
    connectWallet?: React.ReactNode
    switchChain?: (chainName: string) => React.ReactNode
    execute?: (chainName: string) => React.ReactNode
  }
  onTxComplete?: (chainId: JBChainId, txHash: string) => void
  onAllComplete?: VoidFunction
}

export default function QueueTransferOwnershipTxsModal({
  open,
  onCancel,
  title,
  description,
  onExecuteChain,
  fromAddress,
  toAddress,
  onTxComplete,
  onAllComplete,
  buttonTextOverride,
}: QueueTransferOwnershipTxsModalProps) {
  const [loadingChains, setLoadingChains] = useState<Set<JBChainId>>(new Set())
  const [completedChains, setCompletedChains] = useState<Set<JBChainId>>(new Set())
  const [txHashes, setTxHashes] = useState<Map<JBChainId, string>>(new Map())
  
  const { chain: walletChain, changeNetworks, connect, userAddress } = useWallet()
  const router = useRouter()

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
          `Network changed to ${NETWORKS[chainId]?.label || chainId}.`,
        )
      } catch (error: unknown) {
        console.error('Failed to change networks:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        emitErrorNotification(`Failed to switch to ${NETWORKS[chainId]?.label || chainId}: ${errorMessage}`)
      }
      return
    }

    setLoadingChains(prev => new Set([...prev, chainId]))
    
    try {
      const txHash = await onExecuteChain(chainId)
      // Mark this chain as completed and store the transaction hash
      setCompletedChains(prev => new Set([...prev, chainId]))
      setTxHashes(prev => new Map([...prev, [chainId, txHash]]))
      if (onTxComplete) onTxComplete(chainId, txHash)
      emitInfoNotification(`Ownership transferred successfully on ${NETWORKS[chainId]?.label || chainId}!`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to execute transaction on chain', chainId, error)
      emitErrorNotification(`Failed to execute transaction on chain ${chainId}: ${errorMessage}`)
    } finally {
      setLoadingChains(prev => {
        const newSet = new Set(prev)
        newSet.delete(chainId)
        return newSet
      })
    }
  }, [userAddress, walletChain, changeNetworks, connect, onExecuteChain, onTxComplete])

  const allChainsCompleted = chains.length > 0 && chains.every((chainId: JBChainId) => completedChains.has(chainId))

  // Call onAllComplete when all chains are completed
  useEffect(() => {
    if (allChainsCompleted && onAllComplete) {
      onAllComplete()
    }
  }, [allChainsCompleted, onAllComplete])

  const handleCancel = useCallback(() => {
    setCompletedChains(new Set())
    setTxHashes(new Map())
    setLoadingChains(new Set())
    onCancel()
  }, [onCancel])

  const getChainName = (chainId: JBChainId): string => {
    return NETWORKS[chainId]?.label || `Chain ${chainId}`
  }
  
  const hasAnyLoading = loadingChains.size > 0

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={title}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={hasAnyLoading}>
          <Trans>Cancel</Trans>
        </Button>,
        allChainsCompleted && (
          <Button key="done" type="primary" onClick={() => {
            router.push(v4ProjectRoute({ projectId: Number(suckers?.[0].projectId ?? 1), chainId: suckers?.[0].peerChainId ?? 1  }))
          }}>
            <Trans>Go to project</Trans>
          </Button>
        ),
      ].filter(Boolean)}
      width={600}
    >
      <div className="space-y-4">
        <div className="text-sm text-grey-500 dark:text-slate-200">
          {description}
        </div>

        {/* {loadingChains.size > 0 && (
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <Trans>
              {loadingChains.size} transaction{loadingChains.size === 1 ? '' : 's'} in progress...
            </Trans>
          </div>
        )} */}

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
            const txHash = txHashes.get(chainId)
            const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
            const isCurrentChain = walletChainId === chainId
            const walletConnectedToWrongChain = walletChain && chainId !== walletChainId
            const isLoadingThisChain = loadingChains.has(chainId)
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
                <Trans>Transfer on {chainName}</Trans>
            }
            
            return (
              <div key={chainId} className="flex items-center justify-between p-4 border rounded-lg border-smoke-500 dark:border-smoke-300">
                <div className="flex items-center space-x-3">
                  <div className={twMerge(
                    "w-3 h-3 rounded-full",
                    isCompleted ? "bg-success-500" : "bg-grey-300"
                  )} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {chainName}
                      {isCurrentChain && (
                        <Tooltip title={<Trans>Wallet connected to this chain</Trans>}>
                          <ApiFilled className="text-blue-500 mb-1" style={{ fontSize: '16px' }} />
                        </Tooltip>
                      )}
                    </div>
                    {isCompleted && txHash && (
                      <div className="text-xs mt-1">
                        <a
                          href={`${NETWORKS[chainId]?.blockExplorer}/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline"
                        >
                          <Trans>View transaction</Trans>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  type={isCompleted ? "default" : "primary"}
                  onClick={() => handleExecuteOnChain(chainId)}
                  loading={isLoadingThisChain}
                  disabled={isCompleted}
                >
                  {buttonText}
                </Button>
              </div>
            )
          })}
        </div>

        {allChainsCompleted ? (
          <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="text-green-800 font-medium">
              <Trans>Ownership transferred on all chains!</Trans>
            </div>
            <div className="text-green-600 text-sm mt-1">
              <Trans>
                Project ownership has been successfully transferred to {toAddress} on all chains.
              </Trans>
            </div>
          </div>
        ): null}
      </div>
    </Modal>
  )
}
