# Contributing to Juicebox

If you're interested in contributing ideas or code to Juicebox, you're in the
right place!

## Development

Check out the [README](README.md#usage) for instructions on running the app in
development.

## Finding something to work on

Start with issues labelled
[`good first issue`](https://github.com/jbx-protocol/juice-juicehouse/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

## Getting your pull request reviewed, approved, and merged

Create a pull request (PR) that targets the `main` branch. A live Fleek preview
will be automatically deployed for each PR.

When your PR has met the [#approval guidelines](approval-guidelines) and is
ready for review, `@mention` a [codeowner](.github/CODEOWNERS) and ask for a
review.

### Git workflow

We opt for a **rebase policy** where the repository history is kept flat and
clean. When a feature branch's development is complete, rebase/squash all the
work down to the minimum number of meaningful commits.

While the work is still in progress and a feature branch needs to be brought up
to date with the upstream target branch, use rebase – as opposed to pull or
merge – to avoid polluting the commit history with spurious merges.
[Learn more](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase)
about the differences between merge and rebase Git workflows.

#### Rebase procedure

You can rebase your feature branch with the following procedure, where
`feature-branch` is the name of your branch. Further explanation of rebase and
its options can be found
[here](https://docs.gitlab.com/ee/topics/git/git_rebase.html).

1. `git checkout feature-branch`
2. `git fetch origin main`
3. `git rebase origin/main`
4. `git push --force-with-lease`

### Approval guidelines

Before your PR is merged, it must meet the following criteria:

1. The PR follows the [Git workflow](#git-workflow) and contains no merge
   commits.
1. All CI checks pass.
1. The PR is approved by at least one [codeowner](.github/CODEOWNERS).
1. Significant UI/UX changes are discussed by other design/dev contributors.

### Juicebox app release

All changes to the `main` branch will be automatically deployed via
[Fleek](https://fleek.co).

### Supported browsers

Juicebox supports the following web browsers:

- Google Chrome
- Mozilla Firefox
- Chromium-based browsers (e.g. Brave Browser)

## Translations

Juicebox uses [Crowdin](https://crowdin.com/project/juicebox-interface) for
managing translations. A GitHub workflow uploads new strings for translation to the
Crowdin project whenever code using the lingui translation macros is merged into
main.

Every day, translations are synced back down from Crowdin to a pull request to
`main`. We then merge these PR's into `main` manually.

### Marking strings for translation

Any strings that are added or modified in the source code should be marked for
translation. Use the `t` macro or the `Trans` component from the `@lingui/macro`
library. [Learn more](https://lingui.js.org/ref/macro.html).

```js
const myString = t`Example text`
```

```html
<Trans>Example text</Trans>
```

**You must extract strings in PRs**. If your PR adds or modifies translated
strings, run the following command to generate new `.po` files:

```bash
yarn i18n:extract
```

### Contributing translations

For details of how to contribute as a translator, see our
[How to become a Juicebox translator](https://www.notion.so/juicebox/How-to-become-a-Juicebox-translator-81fdd9344ef043909a48bd7373ef73d7)
Notion page.

### Adding a language (for devs)

1. Add the locale code, english name, and short and long alias's to
   `constants/languages/language-options.ts`.

   ```diff
   export const Languages: Language = {
      en: { code: 'en', name: 'english', short: 'EN', long: 'English' },
      zh: { code: 'zh', name: 'chinese', short: '中文', long: '中文' },
      ru: { code: 'ru', name: 'russian', short: 'RU', long: 'Pусский' },
   +  es: { code: 'es', name: 'spanish', short: 'ES', long: 'Español' },
   }
   ```

1. Add the locale code to `./linguirc.json`.

   ```diff
   - "locales": ["en", "zh"]
   + "locales": ["en", "zh", "af"]
   ```

1. Add the locale code to `SUPPORTED_LOCALES` in `./src/constants/locale.ts`

   ```diff
   - export const SUPPORTED_LOCALES = ['en', 'zh']
   + export const SUPPORTED_LOCALES = ['en', 'zh', 'af']
   ```

1. Import the locale plurals in `./src/providers/LanguageProvider.tsx`.

   ```diff
   - import { en, zh } from 'make-plural/plurals'
   + import { en, zh, af } from 'make-plural/plurals'
   ```

1. Load the locale plurals in `./src/providers/LanguageProvider.tsx`

   ```diff
   i18n.loadLocaleData({
     en: { plurals: en },
     zh: { plurals: zh },
   + af: { plurals: af },
   })
   ```

1. Extract and compile the strings marked for translation. This creates a
   directory for the locale within the `./locale/` directory:

   ```bash
   yarn i18n:extract && yarn i18n:compile
   ```
