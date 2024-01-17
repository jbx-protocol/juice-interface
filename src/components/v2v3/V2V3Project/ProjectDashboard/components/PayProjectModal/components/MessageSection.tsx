import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import {
  PayProjectModalFormValues,
  usePayProjectModal,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectModal/usePayProjectModal'
import { useFormikContext } from 'formik'
import { MessageInput } from './MessageInput'

export const MessageSection = () => {
  const { projectName, projectPayDisclosure } = usePayProjectModal()
  const { values, setFieldValue, handleBlur } =
    useFormikContext<PayProjectModalFormValues>()
  return (
    <div>
      <span className="font-medium">
        <Trans>Message (optional)</Trans>
      </span>
      <div>
        <MessageInput
          name="message"
          className="mt-1.5"
          placeholder="Attach an on-chain message to this payment"
          value={values.message}
          onChange={v => setFieldValue('message', v)}
          onBlur={handleBlur}
        />
      </div>
      {projectName && projectPayDisclosure && (
        <Callout
          collapsible
          className="mt-6 border border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400"
          iconComponent={<EnvelopeIcon className="h-6 w-6" />}
        >
          <>
            <div className="font-medium text-bluebs-700 dark:text-bluebs-300">
              <Trans>Notice from {projectName}</Trans>
            </div>
            <p className="mt-2 mb-0">{projectPayDisclosure}</p>
          </>
        </Callout>
      )}
    </div>
  )
}
