import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { JBChainId, JB_TOKEN_DECIMALS, formatUnits } from 'juice-sdk-core'
import {
  useJBChainId,
  useJBContractContext,
  useSuckersUserTokenBalance
} from 'juice-sdk-react'
import { useCallback, useMemo, useState } from 'react'

import { SettingOutlined } from '@ant-design/icons'
import { AddTokenToMetamaskButton } from 'components/buttons/AddTokenToMetamaskButton'
import EthereumAddress from 'components/EthereumAddress'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'
import { NETWORKS } from 'constants/networks'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { V4TokenHoldersModal } from 'packages/v4/components/modals/V4TokenHoldersModal/V4TokenHoldersModal'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { reloadWindow } from 'utils/windowUtils'
import { useV4BalanceMenuItemsUserFlags } from './hooks/useV4BalanceMenuItemsUserFlags'
import { useV4TokensPanel } from './hooks/useV4TokensPanel'
import { useV4YourBalanceMenuItems } from './hooks/useV4YourBalanceMenuItems'
import { V4ClaimTokensModal } from './V4ClaimTokensModal'
import { V4MintModal } from './V4MintModal'
import { V4ReservedTokensSubPanel } from './V4ReservedTokensSubPanel'
import { V4TokenRedemptionCallout } from './V4TokenRedemptionCallout'

export const V4TokensPanel = () => {
  const { userTokenBalanceLoading, projectToken, totalTokenSupplyElement } =
    useV4TokensPanel()
  const projectHasErc20Token = useProjectHasErc20Token()
  const { data: suckersBalance } = useSuckersUserTokenBalance()

  const { canMintTokens } = useV4BalanceMenuItemsUserFlags()

  const [tokenHolderModalOpen, setTokenHolderModalOpen] = useState(false)
  const openTokenHolderModal = useCallback(
    () => setTokenHolderModalOpen(true),
    [],
  )
  const closeTokenHolderModal = useCallback(
    () => setTokenHolderModalOpen(false),
    [],
  )

  const {
    items,
    claimTokensModalVisible,
    setClaimTokensModalVisible,
    mintModalVisible,
    setMintModalVisible,
    // transferUnclaimedTokensModalVisible,
    // setTransferUnclaimedTokensModalVisible,
  } = useV4YourBalanceMenuItems()

  const totalBalance =
    suckersBalance?.reduce((acc, curr) => {
      return acc + curr.balance.value
    }, 0n) ?? 0n

  const tokenBalance = useMemo(() => {
    // NOTE: Don't think we need this since other chains payouts limits may be different?
    // if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT)
    //   return t`No surplus`
    return (
      <Tooltip
        title={
          suckersBalance?.length && suckersBalance.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suckersBalance?.map((balance, index) => (
                <div
                  className="flex items-center justify-between gap-4"
                  key={suckersBalance[index].chainId}
                >
                  <div
                    key={suckersBalance[index].chainId}
                    className="flex items-center gap-2"
                  >
                    <ChainLogo
                      chainId={suckersBalance[index].chainId as JBChainId}
                    />
                    <span>{NETWORKS[balance.chainId].label}</span>
                  </div>
                  {/* (NOTE: Following comment copied from Revnet: 
                  "TODO maybe show USD-converted value here instead?" */}
                  <span className="whitespace-nowrap font-medium">
                    {balance.balance.format()} {projectToken}
                  </span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <span>
          {formatUnits(totalBalance, JB_TOKEN_DECIMALS)} {projectToken}
        </span>
      </Tooltip>
    )
  }, [totalBalance, suckersBalance, projectToken])

  return (
    <>
      <div className="flex w-full flex-col items-stretch gap-5">
        <div className="flex w-full flex-1 items-center justify-between">
          <h2 className="font-heading text-2xl font-medium">Tokens</h2>
        </div>

        <V4TokenRedemptionCallout />

        <div className="mb-12 flex-grow">
          {!userTokenBalanceLoading && (
            <TitleDescriptionDisplayCard
              title={t`Your balance`}
              description={
                <span className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  {tokenBalance}

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center md:gap-4">
                    {projectHasErc20Token && (
                      <Button
                        className="p-0 text-start md:text-end"
                        type="link"
                        size="small"
                        onClick={() => {
                          setClaimTokensModalVisible(true)
                        }}
                      >
                        <Trans>Claim ERC-20 token</Trans>
                      </Button>
                    )}
                  </div>
                </span>
              }
              kebabMenu={
                totalBalance > 0n || canMintTokens
                  ? {
                      items,
                    }
                  : undefined
              }
            />
          )}

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <ProjectTokenCard />
              <TitleDescriptionDisplayCard
                className="w-full"
                title={t`Total supply`}
                description={totalTokenSupplyElement}
              />
            </div>
            <a
              role="button"
              className="font-medium md:self-end"
              onClick={openTokenHolderModal}
            >
              <Trans>View token holders</Trans>
            </a>
          </div>

          <V4ReservedTokensSubPanel className="mt-12" />
        </div>
      </div>
      <V4TokenHoldersModal
        open={tokenHolderModalOpen}
        onClose={closeTokenHolderModal}
      />
      <V4ClaimTokensModal
        open={claimTokensModalVisible}
        onCancel={() => setClaimTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <V4MintModal
        open={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      {/*<TransferUnclaimedTokensModalWrapper
        open={transferUnclaimedTokensModalVisible}
        onCancel={() => setTransferUnclaimedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      /> */}
    </>
  )
}

const ProjectTokenCard = () => {
  const chainId = useJBChainId()
  const { projectId: projectIdBig } = useJBContractContext()
  const projectId = Number(projectIdBig)

  const {
    projectToken,
    projectTokenAddress,
    projectHasErc20Token,
    canCreateErc20Token,
  } = useV4TokensPanel()
  return (
    <TitleDescriptionDisplayCard
      className="w-full"
      title={t`Project token`}
      description={
        <>
          <div className="flex items-center gap-2">
            <span>{projectHasErc20Token ? projectToken : t`Token`}</span>
            <ProjectTokenBadge />
            {projectHasErc20Token && (
              <span className="text-xs font-normal text-grey-500 dark:text-slate-200">
                <EthereumAddress address={projectTokenAddress} truncateTo={4} />
              </span>
            )}
          </div>
          {projectTokenAddress && projectHasErc20Token && (
            <AddTokenToMetamaskButton
              className="mt-2"
              tokenAddress={projectTokenAddress}
            />
          )}
          {canCreateErc20Token ? (
            <Tooltip title={ISSUE_ERC20_EXPLANATION}>
              <a
                href={
                  chainId
                    ? `${v4ProjectRoute({
                        chainId,
                        projectId,
                      })}/settings/createerc20`
                    : ''
                }
              >
                <Button size="small" icon={<SettingOutlined />} type="link">
                  <span>
                    <Trans>Create ERC-20 Token</Trans>
                  </span>
                </Button>
              </a>
            </Tooltip>
          ) : null}
        </>
      }
    />
  )
}

const ProjectTokenBadge = () => {
  const { projectHasErc20Token } = useV4TokensPanel()
  return (
    <span className="whitespace-nowrap rounded-2xl bg-smoke-100 py-1 px-2 text-xs font-normal text-smoke-700 dark:bg-slate-500 dark:text-slate-100">
      {projectHasErc20Token ? 'ERC-20' : t`Juicebox native`}
    </span>
  )
}
