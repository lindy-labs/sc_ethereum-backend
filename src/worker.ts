import { Connection } from 'typeorm';

import getDBConnection from './db/getConnection';
import * as Monitoring from './monitoring';
import * as Scheduler from './scheduler/worker';

let connection: Connection;

Monitoring.start();

getDBConnection().then(async (newConnection) => {
  connection = newConnection;

  await Scheduler.start();
});

function handleExit(code?: number) {
  console.log('closing');

  Promise.all([
    connection?.close(),
    Scheduler.stop(),
    Monitoring.stop(),
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
