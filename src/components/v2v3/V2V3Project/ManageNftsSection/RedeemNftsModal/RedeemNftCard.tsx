import axios from 'axios'
import { IPFSNftRewardTier } from 'models/nftRewardTier'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { MouseEventHandler } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'
import { cidFromIpfsUri, openIpfsUrl } from 'utils/ipfs'
import { LoadingOutlined } from '@ant-design/icons'

function useJB721DelegateTokenMetadata(
  tokenUri: string | undefined,
): UseQueryResult<IPFSNftRewardTier> {
  return useQuery(
    ['nft-rewards', tokenUri],
    async (): Promise<IPFSNftRewardTier | undefined> => {
      if (!tokenUri) return

      const url = openIpfsUrl(cidFromIpfsUri(tokenUri))
      const response = await axios.get(url)
      const tierMetadata: IPFSNftRewardTier = response.data

      return tierMetadata
    },
  )
}

export function RedeemNftCard({
  nft,
  onClick,
  isSelected,
  loading,
}: {
  nft: JB721DelegateToken
  onClick?: MouseEventHandler<HTMLDivElement>
  isSelected?: boolean
  loading?: boolean
}) {
  const { data: tierData } = useJB721DelegateTokenMetadata(nft.tokenUri)
  if (!tierData) return null

  const { name, image } = tierData

  return (
    <div
      className={twMerge(
        classNames(
          'flex h-full w-1/4 cursor-pointer flex-col rounded-sm outline outline-0 outline-haze-400 transition-shadow duration-100 hover:outline-2',
          isSelected
            ? 'shadow-[2px_0px_10px_0px_var(--boxShadow-primary)] outline outline-2 outline-haze-400'
            : '',
        ),
      )}
      onClick={onClick}
      role="button"
    >
      <div
        className={classNames(
          'relative flex w-full items-center justify-center',
          !loading ? 'pt-[100%]' : 'pt-[unset]',
          isSelected
            ? 'bg-smoke-25 dark:bg-slate-800'
            : 'bg-smoke-100 dark:bg-slate-600',
        )}
      >
        {loading ? (
          <div className="flex h-[151px] w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600">
            <LoadingOutlined />
          </div>
        ) : (
          <img
            className={classNames('absolute top-0 h-full w-full object-cover')}
            alt={name}
            src={image}
            style={{
              filter: isSelected ? 'unset' : 'brightness(50%)',
            }}
            crossOrigin="anonymous"
          />
        )}
      </div>
      {/* Details section below image */}
      <div
        className={classNames(
          'flex h-full w-full flex-col justify-center px-3 pb-1.5',
          isSelected
            ? 'bg-smoke-25 dark:bg-slate-800'
            : 'bg-smoke-100 dark:bg-slate-600',
          !loading ? 'pt-2' : 'pt-1',
        )}
      ></div>
    </div>
  )
}
