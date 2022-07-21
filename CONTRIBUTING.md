# Contributing to Juicebox

If you're interested in contributing ideas or code to Juicebox, you're in the right place!

## Development

Read the [development guidelines](doc/development.md) for instructions on running the app in development.

## Finding something to work on

Start with issues labelled [`good first issue`](https://github.com/jbx-protocol/juice-juicehouse/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

## Getting your pull request reviewed, approved, and merged

Create a pull request (PR) that targets the `main` branch. A live Fleek preview will be automatically deployed for each PR.

When your PR has met the [approval guidelines](#approval-guidelines) and is ready for review, `@mention` a [codeowner](.github/CODEOWNERS) and ask for a review.

### Git workflow

`main` is our main branch.

Developers should create branches from the `main` branch. Once the code is ready, create a pull request that targets the `main` branch.

We use the **Squash and Merge** merge policy.

### Approval guidelines

Before your PR is merged, it must meet the following criteria:

1. The PR follows the [Git workflow](#git-workflow) and contains no merge commits.
1. All CI checks pass.
1. The PR is approved by at least one [codeowner](.github/CODEOWNERS).
1. Significant UI/UX changes are discussed by other design/dev contributors.

### Supported browsers

Juicebox supports the following web browsers:

- Google Chrome
- Mozilla Firefox
- Chromium-based browsers (e.g. Brave Browser)
