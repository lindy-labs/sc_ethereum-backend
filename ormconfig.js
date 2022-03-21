const _ = require('lodash');

const baseFolder = process.env.NODE_ENV === 'production' ? 'build' : 'src';

const databaseURL = process.env.DATABASE_URL;

const opts = {
  type: 'postgres',
  entities: [__dirname + `/${baseFolder}/db/entities/*.{ts,js}`],
  synchronize: process.env.NODE_ENV === 'test',
  logging: false,
  migrations: [`${baseFolder}/migrations/*.ts`],
  cli: {
    migrationsDir: `${baseFolder}/migrations`,
  },
};

if (databaseURL) {
  module.exports = _.extend(
    {
      url: databaseURL || 'localhost',
    },
    opts,
  );
} else {
  module.exports = _.extend(
    {
      host: process.env.POSTGRESQL_HOST || 'localhost',
      port: parseInt(process.env.POSTGRESQL_PORT || '5432'),
      username: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DB || 'ethereum_backend_dev',
    },
    opts,
  );
}
