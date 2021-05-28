import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, parseWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'

export default function Pay({
  fundingCycle,
  projectId,
  metadata,
}: {
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  metadata: ProjectMetadata
}) {
  const [payAs, setPayAs] = useState<CurrencyOption>(1)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const { contracts, transactor } = useContext(UserContext)
  const { onNeedProvider } = useContext(NetworkContext)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payAs === 1 ? converter.usdToWei(payAmount) : parseWad(payAmount)

  function pay() {
    if (!transactor || !contracts) return onNeedProvider()
    if (!weiPayAmt) return

    setPayModalVisible(true)
  }

  const formatReceivedTickets = (wei: BigNumber) =>
    formatWad(
      weightedRate(
        fundingCycle,
        fundingCycle?.currency === 0 ? wei : converter.weiToUsd(wei),
        'payer',
      ),
    )

  if (!fundingCycle || !projectId) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <FormattedNumberInput
            placeholder="0"
            disabled={fundingCycle?.configured === 0}
            onChange={val => setPayAmount(val)}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyName(payAs)}
                onClick={() => setPayAs(payAs === 0 ? 1 : 0)}
              />
            }
          />

          <div style={{ fontSize: '.7rem' }}>
            Receive{' '}
            {payAmount && weiPayAmt?.gt(0) ? (
              formatReceivedTickets(weiPayAmt) + ' Tickets'
            ) : (
              <span>
                {formatReceivedTickets(
                  (payAs === 0 ? parseWad('1') : converter.usdToWei('1')) ??
                    BigNumber.from(0),
                )}{' '}
                tickets/
                <CurrencySymbol currency={payAs} />
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          <Button
            style={{ width: '100%' }}
            type="primary"
            disabled={fundingCycle?.configured === 0}
            onClick={weiPayAmt ? pay : undefined}
          >
            Pay project
          </Button>
          {payAs === 1 && (
            <div style={{ fontSize: '.7rem' }}>
              Paid as <CurrencySymbol currency={0} />
              {formatWad(weiPayAmt) || '0'}
            </div>
          )}
        </div>
      </div>

      <ConfirmPayOwnerModal
        fundingCycle={fundingCycle}
        metadata={metadata}
        projectId={projectId}
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}
