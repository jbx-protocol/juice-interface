import { Collapse, FormInstance, Space } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Button } from 'antd/lib/radio'
import BudgetAdvancedForm, {
  BudgetAdvancedFormFields,
} from 'components/forms/BudgetAdvancedForm'
import BudgetForm, { BudgetFormFields } from 'components/forms/BudgetForm'
import React from 'react'

export default function EditProject({
  budgetForm,
  budgetAdvancedForm,
  onSave,
}: {
  budgetForm: FormInstance<BudgetFormFields>
  budgetAdvancedForm: FormInstance<BudgetAdvancedFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Edit project</h1>

      <BudgetForm form={budgetForm} />

      <Collapse style={{ marginBottom: 40 }}>
        <CollapsePanel key={1} header="More settings">
          <BudgetAdvancedForm form={budgetAdvancedForm} />
        </CollapsePanel>
      </Collapse>

      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    </Space>
  )
}
