import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, parsePerMille, parseWad } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'
import { decodeFCMetadata } from '../../utils/fundingCycle'

export default function Pay({
  fundingCycle,
  project,
  projectId,
}: {
  fundingCycle: FundingCycle | undefined
  project: ProjectIdentifier | undefined
  projectId: BigNumber | undefined
}) {
  const [payAs, setPayAs] = useState<CurrencyOption>('1')
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const { contracts, transactor, onNeedProvider } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const metadata = decodeFCMetadata(fundingCycle?.metadata)

  const weiPayAmt =
    payAs === '1' ? converter.usdToWei(payAmount) : parseWad(payAmount)

  function pay() {
    if (!transactor || !contracts) return onNeedProvider()
    if (!weiPayAmt) return

    setPayModalVisible(true)
  }

  const formatReceivedTickets = (amount: BigNumber) =>
    formatWad(
      fundingCycle
        ? weightedRate(
            fundingCycle,
            amount,
            parsePerMille('100').sub(metadata?.reserved || 0),
          )
        : undefined,
    )

  if (!fundingCycle || !projectId || !project) return null

  return (
    <div>
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
                  onClick={() => setPayAs(payAs === '0' ? '1' : '0')}
                />
              }
            />

            <div>
              Receive{' '}
              {payAmount && weiPayAmt?.gt(0) ? (
                formatReceivedTickets(
                  currencyName(fundingCycle.currency) === 'USD'
                    ? weiPayAmt
                    : parseWad(payAmount),
                ) + ' Tickets'
              ) : (
                <span>
                  {formatReceivedTickets(
                    (payAs === '0' ? parseWad('1') : converter.usdToWei('1')) ??
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
            {payAs === '1' ? (
              <div>
                Paid as <CurrencySymbol currency="0" />
                {formatWad(weiPayAmt) || '0'}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ConfirmPayOwnerModal
        fundingCycle={fundingCycle}
        project={project}
        projectId={projectId}
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        usdAmount={parseFloat(payAmount ?? '0')}
      />
    </div>
  )
}
