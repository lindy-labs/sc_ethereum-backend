import { FastifyInstance, RegisterOptions } from 'fastify';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const hashFile = (filename: string) => {
  const fileBuffer = fs.readFileSync(filename);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

const tosFile = path.join(__dirname, '../public/termsOfService.txt');
const fileHash = hashFile(tosFile);

export default function (
  server: FastifyInstance,
  _opts: RegisterOptions,
  done: Function,
) {
  server.get('', async (_request, reply) => {
    return reply.sendFile('termsOfService.txt');
  });

  done();
}
