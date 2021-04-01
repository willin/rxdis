# Rxdis

RxJS wrapper for Redis

[![npm](https://img.shields.io/npm/v/rxdis.svg?style=plastic)](https://npmjs.org/package/rxdis) [![npm](https://img.shields.io/npm/dm/rxdis.svg?style=plastic)](https://npmjs.org/package/rxdis)
[![npm](https://img.shields.io/npm/dt/rxdis.svg?style=plastic)](https://npmjs.org/package/rxdis)

Minimum, Flexible, Scalable.

## Install

```bash
npm install --save rxdis
# or
yarn add rxdis
```

## IORedis Adapter

```ts
import { Rxdis } from 'rxdis';
import IORedis from 'ioredis';

const client = new IORedis();
// options
const rxdis = Rxdis(client);

rxdis
  .set('test', 'hello')
  // Output: OK
  .subscribe(console.log);
```

### Pipeline

```ts
import { Rxdis, Pipeline } from 'rxdis';
import IORedis from 'ioredis';

const redis = new IORedis();
const rxdis = Rxdis(redis);

const source$ = rxdis
  .pipeline()
  .set('test1', 'hello')
  .set('test2', 'world')
  // Nesscessary type transform
  .get('test1') as Pipeline;

source$.exec().subscribe({
  next: console.log,
  complete() {
    rxdis.disconnect();
  },
  error: console.error
});
```

### Multi

```ts
import { Rxdis, Pipeline } from 'rxdis';
import IORedis from 'ioredis';

const redis = new IORedis();
const rxdis = Rxdis(redis);

const source$ = rxdis
  .multi()
  .set('test1', 'hello')
  .set('test2', 'world')
  // Nesscessary type transform
  .get('test1') as Pipeline; // Same with pipeline()

source$.exec().subscribe({
  next: console.log,
  complete() {
    rxdis.disconnect();
  },
  error: console.error
});
```

## Node-Redis Adapter

```ts
import { Rxdis } from 'rxdis';
import Redis from 'redis';

const client = Redis
  .createClient
  // options
  ();
const rxdis = Rxdis(client);

rxdis
  .set('test', 'hello')
  // Output: OK
  .subscribe(console.log);
```

## Typescript Defination

> p.s. If you are not using Typescript, you can use all methods that the version (IORedis or Redis) you installed supplied.

Currently, you can use these:

(Submit a issue/PR to add a new one)

- append
- auth
- auth
- bgrewriteaof
- bgsave
- bitcount
- bitcount
- blpop
- brpop
- brpoplpush
- bzpopmax
- bzpopmin
- cluster
- config
- dbsize
- debug
- decr
- decrby
- del
- discard
- dump
- echo
- eval
- evalsha
- exec
- exists
- expire
- expireat
- flushall
- flushdb
- geoadd
- geodist
- geohash
- geopos
- georadius
- georadiusbymember
- get
- getbit
- getrange
- getset
- hdel
- hexists
- hget
- hgetall
- hincrby
- hincrbyfloat
- hkeys
- hlen
- hmget
- hmset
- hscan
- hset
- hsetnx
- hstrlen
- hvals
- incr
- incrby
- incrbyfloat
- info
- keys
- lastsave
- lindex
- linsert
- llen
- lpop
- lpos
- lpush
- lpushx
- lrange
- lrem
- lset
- ltrim
- memory
- mget
- migrate
- monitor
- move
- mset
- msetnx
- multi
- multi
- object
- persist
- pexpire
- pexpireat
- pfadd
- pfcount
- pfmerge
- ping
- psetex
- psubscribe
- pttl
- publish
- punsubscribe
- randomkey
- rename
- renamenx
- restore
- rpop
- rpoplpush
- rpush
- rpushx
- sadd
- save
- scan
- scard
- script
- sdiff
- sdiffstore
- select
- set
- setbit
- setex
- setnx
- setrange
- shutdown
- sinter
- sinterstore
- sismember
- slaveof
- smembers
- smove
- sort
- spop
- srandmember
- srem
- sscan
- strlen
- subscribe
- substr
- sunion
- sunionstore
- sync
- time
- ttl
- type
- unlink
- unsubscribe
- unwatch
- watch
- xack
- xadd
- xclaim
- xdel
- xgroup
- xinfo
- xlen
- xpending
- xrange
- xread
- xreadgroup
- xrevrange
- xtrim
- zadd
- zcard
- zcount
- zinterstore
- zpopmax
- zpopmin
- zrange
- zrangebylex
- zrangebyscore
- zrank
- zrem
- zremrangebylex
- zremrangebyrank
- zremrangebyscore
- zrevrangebylex
- zrevrange
- zrevrangebyscore
- zrevrank
- zscan
- zscore
- zunionstore

## Roadmap

- [x] Add IORedis `pipeline` and `multi` support
- [ ] Add Redis `multi` support

## License

Apache-2.0
