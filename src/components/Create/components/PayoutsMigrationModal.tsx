import { DeleteOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Form, Modal } from 'antd'
import { Callout } from 'components/Callout/Callout'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import { AllocationSplit } from 'components/v2v3/shared/Allocation/Allocation'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { BigNumber } from 'ethers'
import { FormItemInput } from 'models/formItemInput'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useEditingPayoutSplits } from 'redux/hooks/useEditingPayoutSplits'
import { inputMustExistRule } from 'utils/antdRules'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'

interface V1MigrationCardForm {
  projectIds: { projectId: string; newProjectId: string }[]
}

const HackLabel = (props: FormItemInput<string>) => (
  <V1UserProvider>
    <V1ProjectHandle projectId={BigNumber.from(props.value)} />
  </V1UserProvider>
)

const V1MigrationCard = ({
  beneficiary,
  projectIds,
  onSaveClick,
}: {
  beneficiary: string
  projectIds: string[]
  onSaveClick?: (props: {
    beneficiary: string
    projectIds: { prev: string; new: string }[]
  }) => void
}) => {
  const [form] = Form.useForm<V1MigrationCardForm>()
  const initialValues = useMemo(
    () => ({
      projectIds: projectIds.map(projectId => ({
        projectId,
        newProjectId: '',
      })),
    }),
    [projectIds],
  )

  const handleOnFinish = useCallback(
    (values: V1MigrationCardForm) => {
      onSaveClick?.({
        beneficiary,
        projectIds: values.projectIds.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({ projectId, newProjectId }: any) => ({
            prev: projectId,
            new: newProjectId,
          }),
        ),
      })
    },
    [beneficiary, onSaveClick],
  )

  return (
    <Form
      className="border-smoke-200 bg-smoke-75 py-3 pl-7 pr-4 dark:border-slate-300 dark:bg-slate-400"
      form={form}
      initialValues={initialValues}
      onFinish={handleOnFinish}
    >
      <div className="mb-4 flex items-center gap-2 text-lg font-medium">
        <span>Beneficiary:</span>
        <EthereumAddress address={beneficiary} />
      </div>
      <Form.List name="projectIds">
        {(fields, { remove }) => (
          <>
            {fields.length ? (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} className="relative mb-4 flex flex-col gap-4">
                    <DeleteOutlined
                      className="absolute top-0 right-0 cursor-pointer text-xl"
                      onClick={() => remove(name)}
                    />
                    <div className="flex gap-2">
                      <span>
                        <Trans>Previous V1 Project ID:</Trans>
                      </span>
                      <Form.Item noStyle name={[name, 'projectId']}>
                        <HackLabel />
                      </Form.Item>
                    </div>
                    <Form.Item
                      name={[name, 'newProjectId']}
                      label={<Trans>New V3 Project ID</Trans>}
                      rules={[inputMustExistRule()]}
                    >
                      <FormattedNumberInput />
                    </Form.Item>
                  </div>
                ))}
              </>
            ) : (
              <div className="mb-6">
                <Trans>
                  All payouts have been deleted for this recipient. Save to
                  continue...
                </Trans>
              </div>
            )}
          </>
        )}
      </Form.List>
      <Button htmlType="submit" className="w-full" type="primary">
        Save
      </Button>
    </Form>
  )
}

export const PayoutsMigrationModal = ({
  className,
}: {
  className?: string
}) => {
  const isMigration = useRouter().query.migration === 'true'
  const [updatedBeneficiaries, setUpdatedBeneficiaries] = useState<string[]>([])
  const [splits, setSplits] = useEditingPayoutSplits()
  const allocations = useMemo(() => splits.map(splitToAllocation), [splits])

  const affectedBeneficiaries = useMemo(() => {
    const allocationsWithProjectId = allocations.filter(
      s => !!s.projectId && !BigNumber.from(s.projectId).eq(0),
    )

    return Object.entries(
      allocationsWithProjectId.reduce((acc, curr) => {
        if (!curr.beneficiary || !curr.projectId) return acc
        const projectIds: string[] = acc[curr.beneficiary] ?? []
        projectIds.push(curr.projectId)
        return {
          ...acc,
          [curr.beneficiary]: projectIds,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any),
    ).map(([beneficiary, projectIds]) => ({
      beneficiary,
      projectIds: projectIds as string[],
    }))
  }, [allocations])

  const allBeneficiariesResolved = useMemo(
    () =>
      affectedBeneficiaries.every(b =>
        updatedBeneficiaries.includes(b.beneficiary),
      ),
    [affectedBeneficiaries, updatedBeneficiaries],
  )

  const handleSaveClicked = useCallback(
    ({
      beneficiary,
      projectIds,
    }: {
      beneficiary: string
      projectIds: { prev: string; new: string }[]
    }) => {
      setUpdatedBeneficiaries(prev => [...prev, beneficiary])
      const newSplits = allocations
        .map(s => {
          if (s.beneficiary === beneficiary) {
            const newProjectId = projectIds.find(p => p.prev === s.projectId)
            if (!newProjectId) return
            return {
              ...s,
              projectId: newProjectId?.new ?? s.projectId,
            }
          }
          return s
        })
        .filter((s): s is AllocationSplit => !!s)
        .map(allocationToSplit)
      setSplits(newSplits)
    },
    [allocations, setSplits],
  )

  return (
    <>
      <Modal
        className={className}
        title={
          <h2 className="text-xl font-medium text-black dark:text-grey-200">
            <Trans>Re-launch on V3</Trans>
          </h2>
        }
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
        closable={false}
        open={isMigration && !allBeneficiariesResolved}
      >
        <div className="flex flex-col gap-8">
          <Callout.Warning>
            <Trans>
              Your V3 project cannot have payouts to V1 projects. Remove any
              payouts to V1 projects, or re-assign them to V3 projects.
            </Trans>
          </Callout.Warning>

          {affectedBeneficiaries
            .filter(s => !updatedBeneficiaries.includes(s.beneficiary))
            .map(({ beneficiary, projectIds }) => (
              <V1MigrationCard
                key={beneficiary}
                beneficiary={beneficiary}
                projectIds={projectIds}
                onSaveClick={handleSaveClicked}
              />
            ))}
        </div>
      </Modal>
    </>
  )
}
