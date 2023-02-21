import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Modal } from 'antd'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useState } from 'react'
import { getUnsafeV2V3FundingCycleProperties } from 'utils/v2v3/fundingCycle'

export function ProjectRisksCheckbox() {
  const { fundingCycle, fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const [riskModalVisible, setRiskModalVisible] = useState<boolean>()

  return (
    <Form.Item
      className="mb-0 border border-solid border-grey-300 p-4 dark:border-slate-200"
      name="riskCheckbox"
      valuePropName="checked"
      rules={[
        {
          validator: (_, value) =>
            value
              ? Promise.resolve()
              : Promise.reject(
                  new Error(t`You must review and accept the risks.`),
                ),
        },
      ]}
    >
      <Checkbox>
        <span className="uppercase">
          <Trans>
            I accept this project's{' '}
            <a
              onClick={e => {
                setRiskModalVisible(true)
                e.preventDefault()
              }}
            >
              unique risks
            </a>
            .
          </Trans>
        </span>
      </Checkbox>
      <Modal
        title={<Trans>Potential risks</Trans>}
        open={riskModalVisible}
        okButtonProps={{ hidden: true }}
        onCancel={() => setRiskModalVisible(false)}
        cancelText={<Trans>Close</Trans>}
      >
        {fundingCycle && fundingCycleMetadata && (
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV2V3FundingCycleProperties(
              fundingCycle,
              fundingCycleMetadata,
            )}
          />
        )}
      </Modal>
    </Form.Item>
  )
}
