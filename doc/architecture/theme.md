## Theme

The app uses the `SemanticTheme` pattern defined in the [`src/models/semantic-theme/`](src/models/semantic-theme) directory. This allows mapping style properties to any number of enumerated `ThemeOption`s. Style properties are defined in the [`src/constants/theme/`](src/constants/theme) directory. Theme styles can be accessed via `ThemeContext` defined in [`src/contexts/themeContext.ts`](src/contexts/themeContext.ts) (and instantiated in [`src/hooks/JuiceTheme.tsx`](src/hooks/JuiceTheme.tsx)), or via CSS root variables.

The app also relies on [antd](https://ant-design.gitee.io/) React components. We override some Antd styles to make Antd compatible with `SemanticTheme`. These overrides are defined in the [`src/styles/antd-overrides/`](src/styles/antd-overrides) directory.