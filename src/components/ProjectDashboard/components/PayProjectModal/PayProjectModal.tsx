import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { usePayProjectModal } from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { JuiceModal } from 'components/modals/JuiceModal'
import { Formik } from 'formik'
import { twMerge } from 'tailwind-merge'
import { MessageSection } from './components/MessageSection'
import { ReceiveSection } from './components/ReceiveSection'

export const PayProjectModal: React.FC = () => {
  const { open, primaryAmount, secondaryAmount, validationSchema, setOpen } =
    usePayProjectModal()
  return (
    <Formik
      initialValues={{
        message: '',
        userAcceptsTerms: false,
      }}
      validationSchema={validationSchema}
      onSubmit={values => console.info('submit foo', JSON.stringify(values))}
    >
      {props => (
        <form name="PayProjectModalForm" onSubmit={props.handleSubmit}>
          <JuiceModal
            className="w-full max-w-xl"
            buttonPosition="stretch"
            title={t`Pay PyroDAO`}
            position="top"
            okButtonForm="PayProjectModalForm"
            okText={t`Pay 2.4 ETH`}
            open={open}
            setOpen={setOpen}
            onSubmit={props.handleSubmit}
          >
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
                      props.errors.userAcceptsTerms &&
                        props.submitCount > 0 &&
                        'font-medium text-error-500 transition-colors',
                    )}
                  >
                    <Trans>
                      I accept the{' '}
                      <ExternalLink href="https://docs.juicebox.money/dev/learn/risks">
                        risks
                      </ExternalLink>{' '}
                      associated with the Juicebox protocol.
                    </Trans>
                  </label>
                </div>
              </div>
            </div>
          </JuiceModal>
        </form>
      )}
    </Formik>
  )
}
