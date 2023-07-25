import { ThemeOption } from 'constants/theme/themeOption'
import { useJuiceTheme } from 'contexts/Theme/useJuiceTheme'
import { BigNumber } from 'ethers'
import tailwind from 'lib/tailwind'
import qs from 'qs'
import { useMemo } from 'react'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'

/**
 * Render a URL for a checkout widget that allows a user to purchase ETH with fiat, and transfer to a project payer address. The payer is assumed to not have a wallet, and is therefore unable to receive any tokens minted from paying the project. Projects using fiat checkout may configure their project payer contract to not mint tokens when ETH is received.
 */
export function useFiatCheckoutURL({
  name,
  logoUri,
  projectId,
  amount,
  memo,
  metadata,
  receiverId,
  redirectUrl,
}: {
  name: string | undefined
  logoUri: string | undefined
  projectId: number | undefined
  amount: BigNumber | undefined
  memo: string | undefined
  metadata: string | undefined
  receiverId: string | undefined
  redirectUrl: string | undefined
}) {
  const theme = useJuiceTheme()

  return useMemo(() => {
    if (!amount || !projectId || !receiverId) return

    const apiKey = process.env.NEXT_PUBLIC_POKO_API_KEY

    if (!apiKey) {
      throw new Error('Missing Poko API key')
    }

    const {
      theme: { colors },
    } = tailwind

    const colorConfig = {
      primaryColorHex: colors.bluebs[500],
      ...(theme.themeOption === ThemeOption.light
        ? {
            textColorHex: colors.grey[900],
            backgroundColorHex: colors.smoke[25],
          }
        : {
            backgroundColorHex: colors.slate[900],
            textColorHex: colors.slate[100],
          }),
    }

    const data = {
      itemName: `Pay ${name || `Juicebox Project #${projectId}`}`,
      itemImageURL: logoUri
        ? ipfsUriToGatewayUrl(logoUri)
        : 'https://pbs.twimg.com/profile_images/1676289663395328000/W2xdxypN_400x400.jpg',
      apiKey,
      // apiKey: '85b7b9b5-b0d5-476c-999a-ba7007b85cd2',
      receiverId,

      ...colorConfig,

      // do not change values below
      network: 'ethereumGoerli',
      listingId: 1,
      type: 'defi',
      marketplaceCode: 'juicebox',
      redirectUrl,
    }

    const extra = {
      projectId: projectId?.toString(),
      amount: amount.toString(),
      token: '0x000000000000000000000000000000000000EEEe', // ETH
      minReturnedTokens: amount.mul(99).div(100).toString(), // 1% slippage
      preferClaimedTokens: false, // TODO not necessary if using project payer address?
      memo,
      metadata,
    }

    const subDomain = process.env.NODE_ENV === 'production' ? '' : 'stg.'

    return `https://${subDomain}checkout.pokoapp.xyz/checkout?${qs.stringify(
      data,
    )}&extra=${encodeURIComponent(JSON.stringify(extra))}`
  }, [
    name,
    logoUri,
    amount,
    projectId,
    memo,
    metadata,
    redirectUrl,
    receiverId,
    theme.themeOption,
  ])
}
