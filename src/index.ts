import fastify from 'fastify';
import typeorm from 'fastify-typeorm-plugin';
import { Connection } from 'typeorm';

import { VaultMetric } from './db';
import getConnection from './db/getConnection';
import { initSchedule } from './scheduler';

let connection: Connection;

const server = fastify({
  logger: {
    prettyPrint:
      process.env.NODE_ENV !== 'development'
        ? {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          }
        : false,
  },
});

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

getConnection().then(async (newConnection) => {
  connection = newConnection;

  // TEST CODE
  const vaultMetricsRepo = connection.getRepository(VaultMetric);
  let allVaultMetrics = await vaultMetricsRepo.find();
  console.log(allVaultMetrics);

  server.register(typeorm, {
    connection: newConnection,
  });

  server.listen(process.env.PORT || 8080, async (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.debug(`Server listening at ${address}`);

    initSchedule();
  });
});

process.on('uncaughtException', (err) => {
  console.error('uncaught error', err);

  Promise.all([connection.close(), server.close()]).then(() => process.exit(1));

  setTimeout(() => process.abort(), 1000).unref();
});
