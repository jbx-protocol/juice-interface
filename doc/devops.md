# DevOps

We use Vercel as our hosting provider.

Pushing to the `main` branch trigger application deployments on Vercel.

## TheGraph

juice-interface relies on a [subgraph on TheGraph](https://github.com/jbx-protocol/juice-subgraph).

## Supabase

juice-interface uses a [Supabase deployment](https://supabase.com/) for storing and retrieving metadata on the site.

### New Subgraph version checklist

The subgraph has a URL that we use to query it. This URL is associated with a particular version (a.k.a deployment) of the subgraph. TheGraph produces a new URL when a new version of the subgraph is deployed.

The source of truth for subgraph URLs and versions is TheGraph website. Authenticate as the Peel multisig to access them. [Learn more](https://juicebox.notion.site/Subgraph-Guide-9a19eecda4e3457ab6f6c6ebcad0eaa6).

The Juicebox Docs page should also be maintained with the latest URLs (although this is a manual process): https://info.juicebox.money/dev/subgraph

We need to update the following configurations for new subgraph versions:

#### Vercel

- [ ] Update **juice-interface-goerli** project
  - [ ] `SUBGRAPH_URL`
  - [ ] `NEXT_PUBLIC_SUBGRAPH_URL`
- [ ] Update **juice-interface**
  - [ ] `SUBGRAPH_URL`
  - [ ] `NEXT_PUBLIC_SUBGRAPH_URL`

#### GitHub

- [ ] `SUBGRAPH_URL`
  1.  Select **Secrets** > **Actions**.
  2.  Locate the **Repository secrets** section.
  3.  Edit the secret variable

#### info.juicebox.money website

- [ ] Update the [Subgraph URL table](https://info.juicebox.money/dev/subgraph/).
  - https://github.com/jbx-protocol/juice-docs/blob/main/docs/dev/subgraph/README.md

#### Announcement

- [ ] Ping `@dev` role on Discord to notify Peel devs of the status quo.
