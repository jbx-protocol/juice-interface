import { XCircleIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEditRewardBeneficiary } from '../hooks/useEditRewardBeneficiary/useEditRewardBeneficiary'

export const EditRewardBeneficiary = ({
  className,
  value,
  onChange,
}: {
  className?: string
  value?: string
  onChange?: (value: string) => void
}) => {
  const {
    address,
    isEditing,
    isLoading,
    error,
    editClicked,
    handleInputChanged,
    handleInputBlur,
  } = useEditRewardBeneficiary(value, onChange)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLoading || !isEditing) return
    inputRef.current?.focus()
  }, [isEditing, isLoading])

  return (
    <div
      className={twMerge(
        'inline-flex select-none items-center gap-2 rounded-lg border border-grey-200 py-1.5 pl-3 pr-2 dark:border-slate-500',
        isEditing && !isLoading
          ? 'border-bluebs-400 bg-white ring ring-bluebs-100 ring-opacity-50 dark:border-slate-500 dark:bg-slate-800 dark:ring-bluebs-900'
          : 'bg-grey-25 dark:bg-slate-950',
        isLoading && 'cursor-wait bg-grey-100',
        error && 'border-error-500 bg-error-50 dark:bg-error-950',
        className,
      )}
    >
      {isEditing ? (
        <span className="flex w-32 items-center gap-3">
          <input
            disabled={isLoading}
            ref={inputRef}
            className="inline w-full bg-transparent text-sm outline-none"
            onBlur={handleInputBlur}
            onChange={handleInputChanged}
          />
          {isLoading ? (
            <Loading className="inline-flex" size="small" />
          ) : (
            error && (
              <Tooltip title={error}>
                <XCircleIcon className="h-6 w-6 text-error-500" />
              </Tooltip>
            )
          )}
        </span>
      ) : (
        <>
          <Tooltip title={address}>
            <span className="text-sm font-medium leading-5 text-grey-700 dark:text-slate-200">
              {address ? (
                <EthereumAddress
                  address={address}
                  truncateTo={4}
                  showEnsLoading
                />
              ) : (
                <Trans>Owner wallet</Trans>
              )}
            </span>
          </Tooltip>
          <button
            className="h-fit p-0"
            type="button"
            onClick={editClicked}
            aria-label="Edit"
          >
            <PencilSquareIcon className="h-4 w-4 text-grey-400 dark:text-slate-400" />
          </button>
        </>
      )}
    </div>
  )
}
