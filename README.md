# juice-interface

<div align="center">
   <img width="75px" src="https://jbx.mypinata.cloud/ipfs/QmWXCt1zYAJBkNb7cLXTNRNisuWu9mRAmXTaW9CLFYkWVS"/>
   <h2>
      The <a href="https://juicebox.money">Juicebox</a> frontend application.
   </h2>
</div>

`juice-interface` is a web application for the [Juicebox](https://info.juicebox.money/) protocol.

## Links

| Name     | Link                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Mainnet  | https://juicebox.money                                                                                                              |
| Goerli   | https://goerli.juicebox.money                                                                                                       |
| Subgraph | [https://thegraph.com/explorer/subgraph...](https://thegraph.com/explorer/subgraph?id=FVmuv3TndQDNd2BWARV8Y27yuKKukryKXPzvAS5E7htC) |

## Report a bug

Mention `@Peel` in [Discord](https://discord.gg/6jXrJSyDFf) and someone from our team will triage your request!

## Development

Read the [development guidelines](doc/development.md) for instructions on running the app in development.

## Testing

### Unit tests

Run the jest test suite using the following command:

```bash
yarn test
```

### End-to-end tests

#### Configuration

Setup your .env file with the `E2E_` prefixed variables.

- `E2E_SECRET_WORDS`: 12 word Mnemonic. Generate this here: https://iancoleman.io/bip39/. **Important**: wrap mnemonic in quotes (`"`).
- `E2E_PASSWORD`: Any random password with at least 8 characters. Cypress will use this to create the fake MetaMask account.
- `E2E_NETWORK`: Set this to `rinkeby` (unless you have a reason not to).

#### Running Cypress

1. Start the app in a seperate terminal:

   ```bash
   yarn start
   ```

1. Open Cypress.

   ```bash
   yarn cy:open
   ```

1. Run tests.

## Contributing

Anyone can contribute! [Start here](CONTRIBUTING.md).

[Learn more](https://www.notion.so/juicebox/Frontend-26b80fcb50b34f3b9356fc7fc5286e05) about the Peel team.

### Support

Join the [JuiceboxDAO Discord](https://discord.gg/6jXrJSyDFf) and reach out to the development team for development support.

## Team

[JuiceboxDAO](https://juicebox.money/@juicebox) funds [Peel](https://juicebox.money/@peel) to build and maintain the application. [Learn more](https://www.notion.so/juicebox/Frontend-26b80fcb50b34f3b9356fc7fc5286e05) about Peel.

<a href="https://juicebox.money/@juicebox">
   <img width="150px" src="https://tools.juicebox.money/public/juicebox-button-yellow.png" />
</a>
