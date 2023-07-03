import { Trans, t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { useTokensPanel } from 'components/ProjectDashboard/hooks/useTokensPanel'
import { useYourBalanceMenuItems } from 'components/ProjectDashboard/hooks/useYourBalanceMenuItems'
import { TokenAmount } from 'components/TokenAmount'
import { V2V3BurnOrRedeemModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3BurnOrRedeemModal'
import { V2V3ClaimTokensModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3ClaimTokensModal'
import { V2V3MintModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3MintModal'
import { useCallback, useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'
import { TokenHoldersModal } from '../TokenHoldersModal'
import { TitleDescriptionDisplayCard } from '../ui/TitleDescriptionDisplayCard'
import { MigrateTokensButton } from './components/MigrateTokensButton'
import { RedeemTokensButton } from './components/RedeemTokensButton'
import { ReservedTokensSubPanel } from './components/ReservedTokensSubPanel'
import { TokenRedemptionCallout } from './components/TokenRedemptionCallout'
import { TransferUnclaimedTokensModalWrapper } from './components/TransferUnclaimedTokensModalWrapper'

export const TokensPanel = () => {
  const {
    userTokenBalance,
    userTokenBalanceLoading,
    userLegacyTokenBalance,
    userV1ClaimedBalance,
    projectToken,
    totalSupply,
  } = useTokensPanel()

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
    redeemModalVisible,
    setRedeemModalVisible,
    claimTokensModalVisible,
    setClaimTokensModalVisible,
    mintModalVisible,
    setMintModalVisible,
    transferUnclaimedTokensModalVisible,
    setTransferUnclaimedTokensModalVisible,
  } = useYourBalanceMenuItems()

  return (
    <>
      <div className="flex w-full max-w-[596px] flex-col items-stretch gap-5">
        <div className="flex w-full flex-1 items-center justify-between">
          <h2 className="font-heading text-2xl font-medium">Tokens</h2>
        </div>

        <TokenRedemptionCallout />

        <div className="flex-grow">
          {!userTokenBalanceLoading && userTokenBalance && (
            <TitleDescriptionDisplayCard
              title={t`Your balance`}
              description={
                <span className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <Trans>{userTokenBalance} tokens</Trans>
                  <RedeemTokensButton
                    containerClassName="w-full md:w-fit"
                    className="h-12 w-full md:h-10"
                  />
                </span>
              }
              kebabMenu={{
                items,
              }}
            />
          )}

          {userLegacyTokenBalance?.gt(0) ? (
            <TitleDescriptionDisplayCard
              className="mt-4 flex flex-col items-center gap-5 md:flex-row"
              title={t`Your legacy balance`}
              description={<TokenAmount amountWad={userLegacyTokenBalance} />}
            >
              <MigrateTokensButton
                totalLegacyTokenBalance={userLegacyTokenBalance}
                v1ClaimedBalance={userV1ClaimedBalance}
                className="h-12 w-full md:h-10 md:w-fit"
              />
            </TitleDescriptionDisplayCard>
          ) : null}

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <ProjectTokenCard />
              <TitleDescriptionDisplayCard
                className="w-full"
                title={t`Total supply`}
                description={
                  <span>
                    {totalSupply} {projectToken}
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

          <ReservedTokensSubPanel className="mt-12" />
        </div>
      </div>
      <TokenHoldersModal
        open={tokenHolderModalOpen}
        onClose={closeTokenHolderModal}
      />
      <V2V3BurnOrRedeemModal
        open={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <V2V3ClaimTokensModal
        open={claimTokensModalVisible}
        onCancel={() => setClaimTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <V2V3MintModal
        open={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <TransferUnclaimedTokensModalWrapper
        open={transferUnclaimedTokensModalVisible}
        onCancel={() => setTransferUnclaimedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </>
  )
}

const ProjectTokenCard = () => {
  const { projectToken, projectTokenAddress, projectHasErc20Token } =
    useTokensPanel()
  return (
    <TitleDescriptionDisplayCard
      className="w-full"
      title={t`Project token`}
      description={
        <div className="flex items-center gap-2">
          <span>{projectHasErc20Token ? projectToken : t`Token`}</span>
          <ProjectTokenBadge />
          {projectHasErc20Token && (
            <span className="text-xs font-normal text-grey-500 dark:text-slate-200">
              <EthereumAddress address={projectTokenAddress} truncateTo={4} />
            </span>
          )}
        </div>
      }
    />
  )
}

const ProjectTokenBadge = () => {
  const { projectHasErc20Token } = useTokensPanel()
  return (
    <span className="whitespace-nowrap rounded-2xl bg-smoke-100 py-1 px-2 text-xs font-normal text-smoke-700 dark:bg-slate-500 dark:text-slate-100">
      {projectHasErc20Token ? 'ERC-20' : t`Juicebox native`}
    </span>
  )
}
