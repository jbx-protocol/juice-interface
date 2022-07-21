## Internationalization

Juicebox uses [Crowdin](https://crowdin.com/project/juicebox-interface) for managing translations. A GitHub workflow uploads new strings for translation to the Crowdin project whenever code using the lingui translation macros is merged into main.

Every day, translations are synced back down from Crowdin to a pull request to `main`. We then merge these PR's into `main` manually.

### Marking strings for translation

Any strings that are added or modified in the source code should be marked for translation. Use the `t` macro or the `Trans` component from the `@lingui/macro` library. [Learn more](https://lingui.js.org/ref/macro.html).

```js
const myString = t`Example text`
```

```html
<Trans>Example text</Trans>
```

**You must extract strings in PRs**. If your PR adds or modifies translated strings, run the following command to generate new `.po` files:

```bash
yarn i18n:extract
```

### Contributing translations

For details of how to contribute as a translator, see our [How to become a Juicebox translator](https://www.notion.so/juicebox/How-to-become-a-Juicebox-translator-81fdd9344ef043909a48bd7373ef73d7) Notion page.

### Adding a language (for devs)

1. Add the locale code, english name, and short and long alias's to `constants/languages/language-options.ts`.

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

1. Extract and compile the strings marked for translation. This creates a directory for the locale within the `./locale/` directory:

   ```bash
   yarn i18n:extract && yarn i18n:compile
   ```
