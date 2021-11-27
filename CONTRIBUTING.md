# Contributing to Juicebox

If you're interested in contributing ideas or code to Juicebox, you're in the
right place!

## Development

Check out the [README](README.md#usage) for instructions on running the app in
development.

## Contribution process

### Find something to work on

Start with issues labelled
[`good first issue`](https://github.com/jbx-protocol/juice-juicehouse/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

### Create a pull request

To contribute, create a pull request (PR) that targets the `main` branch. A live
Fleek preview will be automatically deployed for each PR. Before your PR is
merged, it must meet the following criteria:

- Passes all CI checks.
- Approved by at least one code owner.
- Discussed by other design/dev contributors (for contributions that make
  significant UI/UX changes).

### Juicebox app release

All changes to the `main` branch will be automatically deployed via
[Fleek](https://fleek.co).

## Suggest a feature

Have an idea or suggestion? Create a
[feature request](https://github.com/jbx-protocol/juice-interface/issues/new?assignees=&labels=idea&template=feature_request.md&title=%5BIDEA%5D+)
or mention it in the [Discord](https://discord.gg/6jXrJSyDFf).

## Report a bug

Notice something broken? Create a
[bug report](https://github.com/jbx-protocol/juice-interface/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+).

## Translations

Juicebox uses [`lingui.js`](https://lingui.js.org) for internationlization
(i18n). Languages we support are defined in `.linguirc.json`. `en` is our source
language.

Developers should mark strings for translation using one of the `lingui.js`
[macros](https://lingui.js.org/ref/macro.html). Strings marked for translation
will be extracted at build-time and added to `messages.po` files within the
`./locale` directory.

### Contributing translations

The following steps describe how to contribute translations for a given
language. You will contribute translations directly to this repository. This
means you need a GitHub account.

1. Create a
   [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this
   repository.
1. Clone your fork to your local machine.

1. Open the `messages.po` file for the locale you want to add translations for.
   For example, to add Chinese translations, open the `./locale/zh/messages.po`
   file.

1. Locate the string you want translate in the `msgid` field.

   > For strings where a `msgid` has been manually set, find the `msgstr` for
   > the given `msgid` in the `./locales/en/messages.po` file (the source
   > locale).

1. Add the translation in the `msgstr` field.

   ```diff
   msgid "Community funding for people and projects"
   - msgstr ""
   + msgstr "为个人和项目提供社区资助"
   ```

1. Commit the changes and create a pull request on GitHub.

If you need help at any stage, reach out in the
[Discord](https://discord.gg/6jXrJSyDFf).

### Adding a language

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

1. Import the locale plurals in `./src/i18n.tsx`.

   ```diff
   - import { en, zh } from 'make-plural/plurals'
   + import { en, zh, af } from 'make-plural/plurals'
   ```

1. Load the locale plurals in `./src/i18n.tsx`

   ```diff
   i18n.loadLocaleData({
     en: { plurals: en },
     zh: { plurals: zh },
   + af: { plurals: af },
   })
   ```

1. Extract the strings marked for translation. This creates a directory for the
   locale within the `./locale/` directory:

   ```bash
   yarn i18n:extract
   ```
