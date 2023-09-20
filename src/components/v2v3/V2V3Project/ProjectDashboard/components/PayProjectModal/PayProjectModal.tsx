import { Trans, t } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import ExternalLink from 'components/ExternalLink'
import { JuiceModal } from 'components/modals/JuiceModal'
import {
  PayProjectModalFormValues,
  usePayProjectModal,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectModal/usePayProjectModal'
import { Formik } from 'formik'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { helpPagePath } from 'utils/routes'
import { MessageSection } from './components/MessageSection'
import { ReceiveSection } from './components/ReceiveSection'

export const PayProjectModal: React.FC = () => {
  const {
    open,
    primaryAmount,
    secondaryAmount,
    validationSchema,
    isTransactionPending,
    isTransactionConfirmed,
    projectPayDisclosure,
    pendingTransactionHash,
    projectName,
    setOpen,
    onPaySubmit,
  } = usePayProjectModal()

  return (
    <Formik<PayProjectModalFormValues>
      initialValues={{
        message: {
          messageString: '',
          attachedUrl: undefined,
        },
        userAcceptsTerms: false,
        beneficiaryAddress: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={onPaySubmit}
    >
      {props => (
        <form name="PayProjectModalForm" onSubmit={props.handleSubmit}>
          <JuiceModal
            className="w-full max-w-xl"
            buttonPosition="stretch"
            title={t`Pay ${projectName}`}
            position="top"
            okLoading={props.isSubmitting || isTransactionPending}
            okButtonForm="PayProjectModalForm"
            okText={t`Pay ${primaryAmount}`}
            cancelText={
              isTransactionPending || isTransactionConfirmed
                ? t`Close`
                : t`Cancel`
            }
            open={open}
            setOpen={setOpen}
            onSubmit={props.handleSubmit}
            onCancel={setOpen => {
              setOpen(false)
              // Small timeout to allow the modal to close before resetting the form
              setTimeout(() => props.resetForm(), 300)
            }}
          >
            {isTransactionPending ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Image
                  src="/assets/images/orange-loading.webp"
                  alt={t`Juicebox loading animation`}
                  width={260}
                  height={260}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                <h2 className="mt-4 font-heading text-2xl font-medium text-black dark:text-slate-100">
                  <Trans>Transaction pending...</Trans>
                </h2>
                <p>
                  <Trans>
                    Your transaction has been submitted and is awaiting
                    confirmation.
                  </Trans>
                </p>
                {pendingTransactionHash ? (
                  <p>
                    <EtherscanLink value={pendingTransactionHash} type="tx">
                      <Trans>View on Etherscan</Trans>
                    </EtherscanLink>
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <div className="flex flex-col divide-y divide-grey-200 dark:divide-slate-500">
                  <div className="flex justify-between gap-3 py-3">
                    <span className="font-medium">
                      <Trans>Total amount</Trans>
                    </span>
                    <div>
                      <span>{primaryAmount}</span>{' '}
                      {secondaryAmount && (
                        <span className="text-grey-500 dark:text-slate-200">
                          ({secondaryAmount})
                        </span>
                      )}
                    </div>
                  </div>

                  <ReceiveSection className="py-6" />

                  <div className="py-6">
                    <MessageSection />

                    <div className="mt-6 flex gap-2">
                      <input
                        id="userAcceptsTerms"
                        name="userAcceptsTerms"
                        type="checkbox"
                        checked={props.values.userAcceptsTerms}
                        onChange={() =>
                          props.setFieldValue(
                            'userAcceptsTerms',
                            !props.values.userAcceptsTerms,
                          )
                        }
                      />
                      <label
                        htmlFor="userAcceptsTerms"
                        className={twMerge(
                          'font-normal',
                          props.errors.userAcceptsTerms &&
                            props.submitCount > 0 &&
                            'text-error-500 transition-colors',
                        )}
                      >
                        {projectPayDisclosure ? (
                          <Trans>
                            I understand and accept this project's notice and
                            the{' '}
                            <ExternalLink
                              href={helpPagePath('dev/learn/risks')}
                            >
                              risks
                            </ExternalLink>{' '}
                            associated with the Juicebox protocol.
                          </Trans>
                        ) : (
                          <Trans>
                            I understand and accept the{' '}
                            <ExternalLink
                              href={helpPagePath('dev/learn/risks')}
                            >
                              risks
                            </ExternalLink>{' '}
                            associated with the Juicebox protocol.
                          </Trans>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </JuiceModal>
        </form>
      )}
    </Formik>
  )
}
