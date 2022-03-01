import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

let connection: Connection;

export default async () => {
  if (!connection) connection = await createConnection();

  return connection;
};
