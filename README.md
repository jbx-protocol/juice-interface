# juice-interface

Juicebox frontend application.

- Mainnet: https://juicebox.money
- Rinkeby: https://rinkeby.juicebox.money

## Usage

1.  Clone the respository:

  ```bash
  git clone https://github.com/jbx-protocol/juice-juicehouse.git
  cd juice-juicehouse
  ```

1.  Create an `.env` file in the root directory which mirrors the `.example.env` file.

1.  Install dependencies and start the app:

  ```
  yarn install
  yarn start
  ```

## Web3 Providers:

The frontend has two different providers that provide different levels of access to different chains:

- `readProvider`: used to read from contracts on network of injected provider (`.env` file points you at testnet or mainnet)
- `signingProvider`: your personal wallet, connected to via [Blocknative](https://docs.blocknative.com/onboard).


## Deployment

Frontend application(s) are deployment automatically on pushes to `main` using [Fleek](https://app.fleek.co/#/sites/juicebox-kovan).

## Theme

The app uses the `SemanticTheme` pattern defined in src/models/semantic-theme, which allows mapping style properties to any number of enumerated `ThemeOption`s. These properties are defined in src/constants/theme. Theme styles can be accessed via `ThemeContext` defined in src/contexts/themeContext and instantiated in src/hooks/JuiceTheme, or via CSS root variables.

The app also relies on [antd](https://ant-design.gitee.io/) components. To make Antd compatible with `SemanticTheme`, overrides are defined in src/styles/antd-overrides.
