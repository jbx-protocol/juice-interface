import { Button, Modal, Spin } from 'antd'
import { FormInstance, useWatch } from 'antd/lib/form/Form'
import { JBChainId, useSuckers } from 'juice-sdk-react'
import { useCallback, useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import { Trans } from '@lingui/macro'
import { ProjectDetailsFormFields } from 'components/Project/ProjectSettings/ProjectDetailsForm'
import { NETWORKS } from 'constants/networks'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { useWallet } from 'hooks/Wallet'
import { JBProjectMetadata } from 'juice-sdk-core'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useEditProjectDetailsTx } from 'packages/v4/hooks/useEditProjectDetailsTx'
import { twMerge } from 'tailwind-merge'
import { useChainId } from 'wagmi'

export interface QueueSafeProjectDetailsTxsModalProps {
  open: boolean
  onCancel: VoidFunction
  form?: FormInstance<ProjectDetailsFormFields>
  projectMetadata?: JBProjectMetadata
}
export default function QueueSafeProjectDetailsTxsModal({
  open,
  onCancel,
  form,
  projectMetadata,
}: QueueSafeProjectDetailsTxsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingChainId, setLoadingChainId] = useState<JBChainId | null>(null)
  const [completedChains, setCompletedChains] = useState<Set<JBChainId>>(new Set())
  
  const { chain: walletChain, changeNetworks, connect, userAddress } = useWallet()
  const currentChainId = useChainId()
  const editProjectDetailsTx = useEditProjectDetailsTx()
  
  const { data: suckers } = useSuckers()
  const chains = useMemo(() => {
    if (!suckers?.length) return []
    return suckers.map((sucker) => sucker.peerChainId).filter(Boolean) as JBChainId[]
  }, [suckers])

  const formData = useWatch([], form) as ProjectDetailsFormFields | undefined

  const handleSaveOnChain = useCallback(async (chainId: JBChainId) => {
    if (!formData) return

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
          `Network changed to ${NETWORKS[chainId]?.label || chainId}, please try queueing again.`,
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
      // Upload metadata first
      const uploadedMetadata = await uploadProjectMetadata({
        name: formData.name || projectMetadata?.name || '',
        description: formData.description || projectMetadata?.description || '',
        projectTagline: formData.projectTagline || '',
        projectRequiredOFACCheck: formData.projectRequiredOFACCheck || false,
        logoUri: formData.logoUri || projectMetadata?.logoUri || '',
        coverImageUri: formData.coverImageUri || '',
        infoUri: formData.infoUri || projectMetadata?.infoUri || '',
        twitter: formData.twitter || '',
        discord: formData.discord || '',
        telegram: formData.telegram || '',
        payButton: (formData.payButton || '').substring(0, PROJECT_PAY_CHARACTER_LIMIT),
        payDisclosure: formData.payDisclosure || '',
        tags: formData.tags || [],
      })

      if (!uploadedMetadata.Hash) {
        throw new Error('Failed to upload metadata')
      }

      const hash = uploadedMetadata.Hash as `0x${string}`

      // Use the single-chain edit logic
      await editProjectDetailsTx(hash, {
        onTransactionPending: (txHash) => {
          // Transaction pending
        },
        onTransactionConfirmed: () => {
          // Mark this chain as completed
          setCompletedChains(prev => new Set([...prev, chainId]))
        },
        onTransactionError: (error) => {
          console.error('Transaction error:', error)
          emitErrorNotification(`Failed to save project details on chain ${chainId}: ${error.message}`)
        }
      })
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to save project details on chain', chainId, error)
      emitErrorNotification(`Failed to save project details on chain ${chainId}: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      setLoadingChainId(null)
    }
  }, [userAddress, formData, walletChain, changeNetworks, connect, editProjectDetailsTx, projectMetadata])

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
      title={<Trans>Queue Safe Project Details Transactions</Trans>}
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
          <Trans>
            Since your project owner is a Gnosis Safe and this is an omnichain project,
            you need to submit separate transactions on each chain. Click the button for each
            chain to submit the project details update transaction.
          </Trans>
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
              buttonText = <Trans>Completed</Trans>
            } else if (!walletChain) {
              buttonText = <Trans>Connect wallet</Trans>
            } else if (walletConnectedToWrongChain) {
              buttonText = <Trans>Switch to {chainName}</Trans>
            } else {
              buttonText = <Trans>Queue on {chainName}</Trans>
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
                  onClick={() => handleSaveOnChain(chainId)}
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
                Project details have been updated on all chains. You can now close this modal.
              </Trans>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
