import typeorm from 'fastify-typeorm-plugin';
import { Connection } from 'typeorm';

import * as API from './api';
import {mintDonationNFT} from './contracts/donations';
import getDBConnection from './db/getConnection';
import * as Monitoring from './monitoring';
import * as ServerScheduler from './server/scheduler';
import * as WorkerScheduler from './worker/scheduler';

let connection: Connection;

Monitoring.start();

getDBConnection().then(async (newConnection) => {
  connection = newConnection;

  API.server.register(typeorm, { connection: newConnection! });

  await mintDonationNFT();

  await ServerScheduler.start();
  await WorkerScheduler.start();
  await API.start();
});

function handleExit(code?: number) {
  console.log('closing');

  Promise.all([
    connection?.close(),
    API.server.close(),
    ServerScheduler.stop(),
    WorkerScheduler.stop(),
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
