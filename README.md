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

### Bullmq

Bullmq is used with redis for scheduled jobs. When changing job name in `.src/scheduler.ts` module the old job will keep being scheduled.
To clear the job from the schedule either flush Redis with the `FLUSHALL` command, drop the volume with the docker-compose `-V` flag or
recreate the container with `docker-compose down && docker-compose up -d` or rebuild entirely with `docker-compose up -d --build --force-recreate redis`.
