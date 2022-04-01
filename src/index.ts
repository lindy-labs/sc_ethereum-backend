import typeorm from 'fastify-typeorm-plugin';
import { Connection } from 'typeorm';

<<<<<<< HEAD
import { server } from './server';
import getConnection from './db/getConnection';
import { initSchedule } from './scheduler';
import { initRepos } from './db';
import { depositOperations } from './strategy';
=======
import * as API from './api';
import getDBConnection from './db/getConnection';
import * as Scheduler from './scheduler';
>>>>>>> 2e8fe51354ff476ead302a0c87bd4b5df19d7c82

let connection: Connection;

getDBConnection().then(async (newConnection) => {
  connection = newConnection;

  API.server.register(typeorm, { connection: newConnection! });

<<<<<<< HEAD
  server.listen(process.env.PORT || 8080, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.debug(`Server listening at ${address}`);

    initRepos();

    initSchedule();

    depositOperations();
  });
=======
  await Scheduler.start();
  await API.start();
>>>>>>> 2e8fe51354ff476ead302a0c87bd4b5df19d7c82
});

function handleExit(code?: number) {
  console.log('closing');

  Promise.all([
    connection?.close(),
    API.server.close(),
    Scheduler.stop(),
  ]).finally(() => process.exit(code || 0));

  setTimeout(() => process.abort(), 1000).unref();
}

process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);
process.on('uncaughtException', (err) => {
  console.error('uncaught error', err);
  handleExit(1);
});
