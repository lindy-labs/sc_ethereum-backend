import typeorm from 'fastify-typeorm-plugin';
import { Connection } from 'typeorm';

import { server } from './server';
import { VaultMetric } from './db';
import getConnection from './db/getConnection';
import { initSchedule } from './scheduler';
import { vaultPerformances } from './vault';
import { collectMetrics } from './services/vaultMetric';

let connection: Connection;

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

getConnection().then(async (newConnection) => {
  connection = newConnection;

  server.register(typeorm, {
    connection: newConnection,
  });

  server.listen(process.env.PORT || 8080, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.debug(`Server listening at ${address}`);

    initSchedule();

    collectMetrics('vault_performance', vaultPerformances);
  });
});

process.on('uncaughtException', (err) => {
  console.error('uncaught error', err);

  Promise.all([connection.close(), server.close()]).then(() => process.exit(1));

  setTimeout(() => process.abort(), 1000).unref();
});
