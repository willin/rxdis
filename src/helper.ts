export enum ClientType {
  IORedis = 'ioredis',
  NodeRedis = 'node-redis',
  Unkown = 'unkown'
}

export function getClientType(name: string): ClientType {
  switch (name) {
    case 'Redis':
      return ClientType.IORedis;
    case 'RedisClient':
      return ClientType.NodeRedis;
    default:
      return ClientType.Unkown;
  }
}
