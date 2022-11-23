import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySymbol from 'components/CurrencySymbol'
import { BigNumber } from '@ethersproject/bignumber'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useContext, useMemo } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { CurrencyName } from 'constants/currency'
import StatLine from '../StatLine'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { classNames } from 'utils/classNames'

export const VolumeStatLine = ({
  totalVolume,
  convertToCurrency,
}: {
  totalVolume: BigNumber | undefined
  convertToCurrency?: CurrencyName
}) => {
  const { projectId } = useContext(ProjectMetadataContext)
  const converter = useCurrencyConverter()

  const convertedVolume = useMemo(() => {
    if (!convertToCurrency) return undefined
    return formatWad(
      converter.wadToCurrency(totalVolume, convertToCurrency, 'ETH'),
      { precision: 2, padEnd: true },
    )
  }, [convertToCurrency, converter, totalVolume])

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.CONSTITUTION_DAO

  return (
    <StatLine
      statLabel={<Trans>Volume</Trans>}
      statLabelTip={
        <Trans>
          The total funds this Juicebox project has received since it was
          created.
        </Trans>
      }
      statValue={
        <span className="text-lg font-medium">
          {convertedVolume && convertToCurrency ? (
            <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-600">
              <CurrencySymbol currency={convertToCurrency} />
              {convertedVolume}{' '}
            </span>
          ) : null}
          <span
            className={classNames(
              isConstitutionDAO
                ? 'text-juice-400 dark:text-juice-300'
                : 'text-black dark:text-slate-100',
            )}
          >
            <ETHAmount
              amount={totalVolume ?? BigNumber.from(0)}
              precision={2}
            />
          </span>
        </span>
      }
    />
  )
}
