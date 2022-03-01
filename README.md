# Ethereum Backend

## Development

**Requirments:**

* postgres
* [asdf](https://github.com/asdf-vm/asdf) (you can skip *asdf*, but you need to ensure you are running the node version defined in *.tool-versions*)
* [direnv](https://direnv.net/) (you can skip *direnv*, but you need to ensure the environment variables defined in *.envrc.sample* are set)

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