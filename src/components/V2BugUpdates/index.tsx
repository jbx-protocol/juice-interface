export default function V2BugUpdates() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Juicebox V2 Contracts Bug</h1>
      <p>
        A minor bug has been identified in the Juicebox protocol V2 contracts.
        No funds are in danger, and projects are unlikely to be affected. Link
        to bug description and fix:{' '}
        <a
          href="https://github.com/jbx-protocol/juice-contracts-v2/pull/265"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/jbx-protocol/juice-contracts-v2/pull/265
        </a>
      </p>
      <p>The bug has no impact on Juicebox V1 projects. </p>
      <br />
      <br />
      <section>
        <h2>Roadmap</h2>
        <h4>(Done) Disable project creation + V2 payments</h4>
        <p>
          To make project migration easier, creating projects on juicebox.money
          will be temporarily disabled along with payments to existing V2
          projects with a 0 treasury balance.
        </p>
        <h4>(Done) Redeploy Juicebox V2 protocol contracts</h4>
        <p>
          Redeployed contracts will include a fix, but will otherwise be
          functionally identical to the current protocol contracts.
        </p>
        <h4>(In progress) Update juicebox.money app to use new contracts</h4>
        <p>
          Once the contracts have been redeployed, the app will be updated to
          use these contracts, and to provide an interface for existing V2
          projects to reconfigure their funding cycles with the new contracts.
        </p>
        <h4>Project migration</h4>
        <p>
          Existing V2 projects will have support from JuiceboxDAO and Peel to
          reconfigure on the new V2 contracts as needed, and ensure all token
          balances are migrated.
        </p>
      </section>
    </div>
  )
}
