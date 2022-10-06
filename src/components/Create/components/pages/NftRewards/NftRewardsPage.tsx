import { Form } from 'antd'
import { useContext } from 'react'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useNftRewardsForm } from './hooks'

export const NftRewardsPage = () => {
  const { form, initialValues } = useNftRewardsForm()
  const { goToNextPage } = useContext(PageContext)
  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingCycles"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      {/* TODO */}
      <h1 style={{ color: 'magenta' }}>NFT Rewards go here</h1>
      <Wizard.Page.ButtonControl />
    </Form>
  )
}
