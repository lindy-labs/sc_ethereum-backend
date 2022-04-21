import Redis from 'ioredis';

const redisOptions: Redis.RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const connection = new Redis(
  process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  redisOptions,
);

export default {
  connection,
};
