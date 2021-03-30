import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Input, Row, Space } from 'antd'
import ApproveSpendModal from 'components/modals/ApproveSpendModal'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import EditProjectModal from 'components/modals/EditProjectModal'
import { CardSection } from 'components/shared/CardSection'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { CSSProperties, useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad } from 'utils/formatCurrency'

import BudgetDetail from './BudgetDetail'
import Rewards from './Rewards'

export default function Project({
  project,
  projectId,
  budget,
  showCurrentDetail,
  style,
  isOwner,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  isOwner: boolean
  budget: Budget | null | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)
  const [payAmount, setPayAmount] = useState<string>()
  const [approveModalVisible, setApproveModalVisible] = useState<boolean>(false)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const {
    userAddress,
    weth,
    contracts,
    transactor,
    onNeedProvider,
  } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const allowance = useContractReader<BigNumber>({
    contract: weth?.contract,
    functionName: 'allowance',
    args:
      userAddress && contracts?.Juicer
        ? [userAddress, contracts?.Juicer?.address]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const weiPayAmt = converter.usdToWei(payAmount)

  const payAmountInWeth = (): string => {
    try {
      const amt = fromWad(weiPayAmt)?.split('.')
      if (amt && amt[1]) {
        // Always 4 decimal places
        amt[1] = amt[1].substr(0, 4)
        return amt.join('.')
      }
    } catch (e) {
      console.log(e)
    }

    return '--'
  }

  function pay() {
    if (!transactor || !contracts) return onNeedProvider()
    if (!allowance || !weiPayAmt) return

    if (allowance.lt(weiPayAmt)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
  }

  if (!projectId || !project) return null

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          marginBottom: 30,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: project?.name ? colors.juiceOrange : '#ffffff44',
            }}
          >
            {project?.name ? project.name : 'Untitled project'}
          </h1>
          <h3>
            <Space size="middle">
              {project?.handle ? (
                <span style={{ color: colors.grape }}>@{project.handle}</span>
              ) : null}
              {project?.link ? (
                <a
                  style={{ fontWeight: 400 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.link}
                </a>
              ) : null}
            </Space>
          </h3>
        </div>
        <div>
          {isOwner ? (
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            ></Button>
          ) : null}
        </div>
      </div>

      <Row>
        <Col xs={24} lg={11} style={{ marginBottom: 30 }}>
          <Rewards projectId={projectId} />
        </Col>
        <Col xs={24} lg={13}>
          <div
            style={{
              alignItems: 'flex-start',
              display: 'inline-flex',
              marginBottom: 30,
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'right', flex: 1, marginRight: 10 }}>
              <Input
                style={{ width: '100%' }}
                name="sustain"
                placeholder="0"
                suffix="USD"
                type="number"
                disabled={budget?.configured.eq(0)}
                onChange={e => setPayAmount(e.target.value)}
              />

              <div>
                Paid as {payAmountInWeth()} {weth?.symbol}
              </div>
            </div>

            <Button type="primary" onClick={weiPayAmt ? pay : undefined}>
              Pay project
            </Button>
          </div>
          <CardSection header="Current budget">
            {budget ? (
              <BudgetDetail
                showDetail={showCurrentDetail}
                isOwner={isOwner}
                budget={budget}
              />
            ) : null}
          </CardSection>
        </Col>
      </Row>

      <ApproveSpendModal
        visible={approveModalVisible}
        initialWeiAmt={weiPayAmt}
        allowance={allowance}
        onSuccess={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        budget={budget}
        project={project}
        projectId={projectId}
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        currency={budget?.currency.toString() as BudgetCurrency}
        usdAmount={parseFloat(payAmount ?? '0')}
      />
      <EditProjectModal
        visible={editProjectModalVisible}
        projectId={projectId}
        project={project}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
