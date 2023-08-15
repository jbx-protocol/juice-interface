import { Divider } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'

export function Legal() {
  return (
    <div className="my-0 mx-auto max-w-5xl p-10">
      <h1 className="m-0 my-4 font-display text-4xl">Legal Resources</h1>
      <p>
        <Link href="/@juicebox">JuiceboxDAO</Link> and juicebox.money do not
        provide legal services or advice to project creators – when using
        Juicebox, compliance is your responsibility.
      </p>
      <p>
        If you need help assessing your project's needs, finding a legal expert,
        or legally incorporating your project, consider the following resources:
      </p>

      <h2 className="mt-6 mb-4 font-display text-2xl">Recommended Reading</h2>
      <p>
        Use these resources to familiarize yourself with some of the legal
        concerns facing web3 projects and some common solutions.
      </p>
      <ul className="list-disc">
        <li>
          Projects based in the United States can begin reasoning through their
          project's legal needs with the{' '}
          <ExternalLink href="https://docs.google.com/document/d/1AfPJAj7qfCY88Ke7wHmsT_AFF0LyU8am9fM3j_fCur8/">
            Crypto Legal Risk Checklist
          </ExternalLink>
          . When you reach out to a legal expert, you can send them the
          completed document to help them understand your project.
        </li>
        <li>
          To learn about the tradeoffs between different legal entities for web3
          projects, review Paradigm's{' '}
          <ExternalLink href="https://daos.paradigm.xyz/">
            DAO Legal Entity Matrix
          </ExternalLink>
          .
        </li>
        <li>
          Alternatively, a16z's{' '}
          <ExternalLink href="https://a16z.com/tag/legal-frameworks-for-daos-series/">
            Legal Frameworks for DAOs series
          </ExternalLink>{' '}
          provides a pragmatic overview of legal entity selection for DAOs
          within the United States.
        </li>
        <li>
          The SEC's{' '}
          <ExternalLink href="https://www.sec.gov/files/dlt-framework.pdf">
            Framework for "Investment Contract" Analysis of Digital Assets
          </ExternalLink>{' '}
          provides an overview of securities and commodities regulations as they
          pertain to cryptocurrency within the United States.
        </li>
      </ul>

      <h2 className="mt-6 mb-4 text-2xl">Legal Experts</h2>
      <p>
        Once you have a general understanding of your project's legal needs, you
        are <strong>strongly encouraged</strong> to reach out to a legal expert
        for help addressing them and identifying any further legal requirements.
      </p>
      <ul className="list-disc">
        <li>
          <ExternalLink href="https://openesq.tech/">Open Esquire</ExternalLink>{' '}
          is a group of legal engineers helping projects incorporate and
          maintain compliance within the United States. Get in touch on{' '}
          <ExternalLink href="https://openesq.tech/">
            their website
          </ExternalLink>
          .
        </li>
        <li>
          If you're looking to find another lawyer, join{' '}
          <ExternalLink href="https://www.lexdao.coop/">LexDAO</ExternalLink>
          's{' '}
          <ExternalLink href="https://discord.gg/gQDMhvDVWS">
            Discord server
          </ExternalLink>{' '}
          and inquire in the <code>find-a-lawyer</code> channel. LexDAO also
          provides helpful legal templates on{' '}
          <ExternalLink href="https://github.com/lexDAO">GitHub</ExternalLink>.
        </li>
      </ul>

      <h2 className="mt-6 mb-4 font-display text-2xl">Service Providers</h2>
      <p>
        You can use these services to form legal entities for yourself or your
        project.
      </p>
      <ul className="list-disc">
        <li>
          To quickly form a legal entity within the United States, you can use{' '}
          <ExternalLink href="https://www.doola.com/">Doola</ExternalLink>. To
          form an entity in another jurisdiction, you can use{' '}
          <ExternalLink href="https://otonomos.com/">Otonomos</ExternalLink>.
          Alternatively, you can register for incorporation directly with the
          relevant government.
        </li>
        <li>
          <ExternalLink href="https://www.midao.org/">MIDAO</ExternalLink> can
          help your project incorporate as a for-profit or non-profit Marshall
          Islands DAO LLC.
        </li>
        <li>
          <ExternalLink href="https://opolis.co/">Opolis</ExternalLink> helps
          individuals within the United States set up single-member companies to
          manage payroll, benefits, and taxes. This can be a great option for
          independent DAO contributors.
        </li>
      </ul>

      <h2 className="mt-6 mb-4 font-display text-2xl">Templates</h2>
      <p>
        Templates can be a helpful starting point when working with a legal
        expert – be sure to review any documents with a lawyer before using
        them.
      </p>
      <ul className="list-disc">
        <li>
          <ExternalLink href="https://www.openlaw.io/">OpenLaw</ExternalLink> is
          a framework for legal contracts which can interact with smart
          contracts. Visit their{' '}
          <ExternalLink href="https://lib.openlaw.io/">library</ExternalLink>{' '}
          for a large collection of open-source legal documents made for web3
          projects.
        </li>
        <li>
          The{' '}
          <ExternalLink href="https://www.lexpunk.army/">
            LexPunk Army
          </ExternalLink>{' '}
          community provides free templates and resources for on{' '}
          <ExternalLink href="https://github.com/LeXpunK-Army">
            GitHub
          </ExternalLink>{' '}
          and on their{' '}
          <ExternalLink href="https://forum.lexpunk.army/">forum</ExternalLink>.
        </li>
        <li>
          For common legal documents, you may have success using AI chatbots to
          create preliminary drafts which you can then improve with a lawyer's
          help.{' '}
          <ExternalLink href="https://www.nani.ooo/">nani.ooo</ExternalLink> is
          an Ethereum-specific AI wallet assistant worth experimenting with.
          Popular chatbots like{' '}
          <ExternalLink href="https://chat.openai.com/">ChatGPT</ExternalLink>{' '}
          and <ExternalLink href="https://bard.google.com/">Bard</ExternalLink>{' '}
          can also be effective. As always, don't use any documents until you
          have reviewed them with a legal expert.
        </li>
      </ul>

      <p>
        If you're looking for further resources or have questions, send us a
        message in the{' '}
        <ExternalLink href="https://discord.gg/juicebox">
          JuiceboxDAO Discord server
        </ExternalLink>{' '}
        or on the <Link href="/contact">Contact page</Link>.
      </p>

      <Divider />
      <p className="text-secondary">
        None of the information, services, or materials offered on
        juicebox.money (the "Site") constitute, or are intended to constitute,
        legal, financial, tax, investment, or other advice, and you should not
        act or refrain from acting based on any information, services, or
        materials provided on the Site. All content on our Site is information
        of a general nature and does not address the unique circumstances of any
        particular user. You are strongly urged to consult with your own legal,
        financial, tax, investment, and other advisors regarding all legal,
        financial, tax, and investment-related questions or concerns you have.
      </p>
      <p className="text-secondary">
        For further information, see our{' '}
        <ExternalLink href="https://docs.juicebox.money/tos">
          Terms of Service
        </ExternalLink>
        .
      </p>
    </div>
  )
}
