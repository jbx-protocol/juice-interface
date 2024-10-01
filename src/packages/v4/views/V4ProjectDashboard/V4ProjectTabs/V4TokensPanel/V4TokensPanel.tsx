import { Trans, t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
// import { TokenHoldersModal } from '../TokenHoldersModal/TokenHoldersModal'
// import { MigrateTokensButton } from './components/MigrateTokensButton'
// import { RedeemTokensButton } from './components/RedeemTokensButton'
// import { ReservedTokensSubPanel } from './components/ReservedTokensSubPanel'
// import { TokenRedemptionCallout } from './components/TokenRedemptionCallout'
// import { TransferUnclaimedTokensModalWrapper } from './components/TransferUnclaimedTokensModalWrapper'
import { SettingOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { AddTokenToMetamaskButton } from 'components/buttons/AddTokenToMetamaskButton'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'
import { useJBContractContext } from 'juice-sdk-react'
import { V4TokenHoldersModal } from 'packages/v4/components/modals/V4TokenHoldersModal/V4TokenHoldersModal'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { useCallback, useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'
import { useChainId } from 'wagmi'
import { useV4BalanceMenuItemsUserFlags } from './hooks/useV4BalanceMenuItemsUserFlags'
import { useV4TokensPanel } from './hooks/useV4TokensPanel'
import { useV4YourBalanceMenuItems } from './hooks/useV4YourBalanceMenuItems'
import { V4ClaimTokensModal } from './V4ClaimTokensModal'
import { V4MintModal } from './V4MintModal'
import { V4ReservedTokensSubPanel } from './V4ReservedTokensSubPanel'

export const V4TokensPanel = () => {
  const {
    userTokenBalance,
    userTokenBalanceLoading,
    // userLegacyTokenBalance,
    // projectHasLegacyTokens,
    // userV1ClaimedBalance,
    projectToken,
    totalSupply,
  } = useV4TokensPanel()

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
    // redeemModalVisible,
    // setRedeemModalVisible,
    claimTokensModalVisible,
    setClaimTokensModalVisible,
    mintModalVisible,
    setMintModalVisible,
    // transferUnclaimedTokensModalVisible,
    // setTransferUnclaimedTokensModalVisible,
  } = useV4YourBalanceMenuItems()

  return (
    <>
      <div className="flex w-full flex-col items-stretch gap-5">
        <div className="flex w-full flex-1 items-center justify-between">
          <h2 className="font-heading text-2xl font-medium">Tokens</h2>
        </div>

        {/* <TokenRedemptionCallout /> */}

        <div className="mb-12 flex-grow">
          {!userTokenBalanceLoading && userTokenBalance !== undefined && (
            <TitleDescriptionDisplayCard
              title={t`Your balance`}
              description={
                <span className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <Trans>{userTokenBalance.format(8)} tokens</Trans>
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center md:gap-4">
                    {/* {projectHasErc20Token && (
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
                    )} */}
                    {/* <RedeemTokensButton
                      containerClassName="w-full md:w-fit"
                      className="h-12 w-full md:h-10"
                    /> */}
                  </div>
                </span>
              }
              kebabMenu={
                userTokenBalance.value > 0n || canMintTokens
                  ? {
                      items,
                    }
                  : undefined
              }
            />
          )}

          {/* {projectHasLegacyTokens && userLegacyTokenBalance?.gt(0) ? (
            <TitleDescriptionDisplayCard
              className="mt-4 flex flex-col items-center gap-5 md:flex-row"
              title={t`Your legacy balance`}
              description={
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <TokenAmount amountWad={userLegacyTokenBalance} />
                  <MigrateTokensButton
                    totalLegacyTokenBalance={userLegacyTokenBalance}
                    v1ClaimedBalance={userV1ClaimedBalance}
                    className="h-12 w-full md:h-10 md:w-fit"
                  />
                </div>
              }
            />
          ) : null} */}

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <ProjectTokenCard />
              <TitleDescriptionDisplayCard
                className="w-full"
                title={t`Total supply`}
                description={
                  <span>
                    {totalSupply.format(8)} {projectToken}
                  </span>
                }
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
      {/* <V2V3BurnOrRedeemModal
        open={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        onConfirmed={reloadWindow}
      /> */}
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
  const chainId = useChainId()
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
              <a href={`${v4ProjectRoute({ chainId, projectId })}/settings/createerc20`}>
                <Button
                  size="small"
                  icon={<SettingOutlined />}
                  type='link'
                >
                  <span>
                    <Trans>Create ERC-20 Token</Trans>
                  </span>
                </Button>
              </a>
            </Tooltip>
          ): null}
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
