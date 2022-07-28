# Ethereum Backend

## Development

**Requirments:**

- postgres
- [asdf](https://github.com/asdf-vm/asdf) (you can skip _asdf_, but you need to ensure you are running the node version defined in _.tool-versions_)
- [direnv](https://direnv.net/) (you can skip _direnv_, but you need to ensure the environment variables defined in _.envrc.sample_ are set)
- [git-crypt](https://direnv.net/)

Setup your environment:

```
bin/setup
```

Run the migrations:

```
bin/migrate
```

Run the app:

```
bin/server
```

## Test

**Requirements**

- You should have Google Chrome in your system;

Run the tests with:

```
source .envrc && yarn test
```
