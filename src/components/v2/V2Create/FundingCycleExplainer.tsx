import TabDescription from './TabDescription'

export default function FundingCycleExplainer() {
  return (
    <TabDescription>
      <p>The configs below can be edited on a per-cycle basis.</p>
      <p>
        Funding Cycle #1 will start immediately after you deploy your project.
        Once deployed, <strong>Funding Cycle #1 can't be reconfigured</strong>.
      </p>
      <p>
        You can reconfigure your project's funding cycles later on, and changes
        will take effect in the next funding cycle (Funding Cycle #2).
      </p>
    </TabDescription>
  )
}
