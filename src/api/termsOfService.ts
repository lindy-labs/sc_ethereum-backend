import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fs from 'fs';
import { getSignatoryRepository } from '../db';
import { ethers } from 'ethers';

const tosFile = path.join(__dirname, '../public/termsOfService.txt');
const fileContent = fs.readFileSync(tosFile, 'utf-8');

interface BodyParams {
  signature: string;
}

const getLatestSignature = async (address: string) => {
  const repository = await getSignatoryRepository();

  const data = await repository
    .createQueryBuilder('signatory')
    .select('signatory.signature', 'signature')
    .where('signatory.address = :address', { address })
    .orderBy('"createdAt"', 'DESC')
    .getRawOne();

  return data?.signature;
};

const isValidSignature = (address: string, signature: string) => {
  const signerAddress = ethers.utils.verifyMessage(fileContent, signature);
  return signerAddress === address;
};

const isValidSignatureFormat = (signature: string) => {
  try {
    return !!ethers.utils.splitSignature(signature);
  } catch (error) {
    return false;
  }
};

export default async function (
  server: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  server.get('', async (_request, reply) => {
    return reply.sendFile('termsOfService.txt');
  });

  server.get<{ Params: { address: string } }>(
    '/signatories/:address',
    async (request, reply) => {
      const address = request.params.address;

      if (!ethers.utils.isAddress(address)) {
        reply.header('Content-Type', 'application/json');
        reply.status(400);
        return reply.send({ message: 'Address format is invalid' });
      }

      const signature = await getLatestSignature(address);

      if (!signature) {
        reply.header('Content-Type', 'application/json');
        reply.status(404);
        return reply.send({
          message: 'Current Terms of Service are not signed',
        });
      }

      if (!isValidSignature(address, signature)) {
        reply.header('Content-Type', 'application/json');
        reply.status(404);
        return reply.send({
          message: 'Current Terms of Service are not signed',
        });
      }

      reply.header('Content-Type', 'application/json');
      reply.status(200);
      reply.send({ message: 'Current Terms of Service are signed' });
    },
  );

  server.post<{ Params: { address: string } }>(
    '/signatories/:address',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            signature: { type: 'string' },
          },
          required: ['signature'],
        },
      },
    },
    async (request, reply) => {
      const address = request.params.address;
      const { signature } = request.body as BodyParams;

      if (
        !ethers.utils.isAddress(address) ||
        !isValidSignatureFormat(signature)
      ) {
        reply.header('Content-Type', 'application/json');
        reply.status(400);
        return reply.send({
          message: 'Address or Signature format is invalid',
        });
      }

      if (!isValidSignature(address, signature)) {
        reply.header('Content-Type', 'application/json');
        reply.status(422);
        return reply.send({ message: 'The signature is not valid' });
      }

      const latestSignature = await getLatestSignature(address);

      if (latestSignature === signature) {
        reply.header('Content-Type', 'application/json');
        reply.status(200);
        return reply.send({
          message: 'Current Terms of Service were already signed',
        });
      }

      const repository = await getSignatoryRepository();
      await repository.save({
        address,
        signature,
      });

      reply.header('Content-Type', 'application/json');
      reply.status(201);
      reply.send({ message: 'Current Terms of Service are signed' });
    },
  );
}
