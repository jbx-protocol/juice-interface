import { t } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/routes'

export function LegalNoticeModal(props: ModalProps) {
  return (
    <Modal okText={t`I Agree`} destroyOnClose centered={true} {...props}>
      <h2 className="font-display text-2xl">Notice</h2>
      <p className="mb-4 text-center">
        By selecting "I Agree", you accept and agree to the{' '}
        <ExternalLink href={helpPagePath('/tos')}>
          Terms of Service
        </ExternalLink>
        , and acknowledge the following:
      </p>
      <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
        <ol className="list-decimal space-y-4 px-8">
          <li>
            The Juicebox protocol and juicebox.money operate on blockchain
            technology as decentralized projects. Your interaction with these
            platforms carries inherent risks.
          </li>
          <li>
            The Juicebox protocol and juicebox.money are provided "as is", with
            no definitive guarantees concerning security. The Juicebox protocol
            consists of unchangeable code and can be interacted with via
            multiple user interfaces.
          </li>
          <li>
            There is no single entity controlling the Juicebox protocol. Its
            operation and decision-making are administered by JuiceboxDAO, a
            widespread group of participants who jointly govern and sustain it.
          </li>
          <li>
            You can take part in JuiceboxDAO governance by participating in
            discussions on the{' '}
            <ExternalLink href="https://discord.gg/juicebox">
              JuiceboxDAO Discord server
            </ExternalLink>{' '}
            or following the procedures outlined in the{' '}
            <ExternalLink href={helpPagePath('/dao/process')}>
              JuiceboxDAO Governance Process
            </ExternalLink>
            .
          </li>
          <li>
            Rules and guidelines associated with the Juicebox protocol and
            JuiceboxDAO governance may be subject to alterations.
          </li>
          <li>
            Your use of juicebox.money is conditional on your agreement to
            comply with the{' '}
            <ExternalLink href={helpPagePath('/tos')}>
              Juicebox Terms of Service
            </ExternalLink>
            .
          </li>
          <li>
            Legal implications related to your use of Juicebox may vary based on
            your jurisdiction. We highly recommend seeking advice from a legal
            professional in your jurisdiction if you have any questions about
            your use of Juicebox.
          </li>
          <li>
            This agreement doesn't constitute a partnership agreement. You
            recognize that Juicebox is a decentralized protocol offered "as is".
          </li>
          <li>
            You hereby release any current and future claims against JuiceboxDAO
            and its affiliates connected to your use of the protocol, JBX,
            JuiceboxDAO, or any other aspect of the protocol and community.
          </li>
          <li>
            You agree to indemnify and hold harmless JuiceboxDAO and its
            affiliates for any costs arising from or related to your use of
            juicebox.money or the Juicebox protocol.
          </li>
          <li>
            You affirm that you are not accessing the protocol from any other
            jurisdiction listed as a Specially Designated National by the United
            States Office of Foreign Asset Control ("OFAC").
          </li>
        </ol>
      </div>
    </Modal>
  )
}
