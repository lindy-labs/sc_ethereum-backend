const baseFolder = process.env.NODE_ENV === "production" ? "build" : "src";

module.exports = {
  type: "postgres",
  host: process.env.POSTGRESQL_HOST || "localhost",
  port: parseInt(process.env.POSTGRESQL_PORT || "5432"),
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DB || "ethereum_backend_dev",
  entities: [__dirname + `/${baseFolder}/db/entities/*.{ts,js}`],
  synchronize: process.env.NODE_ENV === "test",
  logging: false,
  migrations: [`${baseFolder}/migrations/*.ts`],
  cli: {
    migrationsDir: `${baseFolder}/migrations`,
  },
};
