import { Observable, pipe } from 'rxjs';
import { EventEmitter } from 'events';
import { Readable } from 'stream';
/* eslint-disable import/no-unresolved */
import IORedis from 'ioredis';
import NodeRedis from 'redis';

export type Ok = 'OK';
type KeyType = string | Buffer;
type ValueType = string | Buffer | number | any[];
type BooleanResponse = 1 | 0;
type Callback<T> = (err: Error | null, res: T) => void;
interface ScanStreamOption {
  match?: string;
  count?: number;
  type?: string;
  key?: string;
}

interface OverloadedBlockingListCommand<T, U> {
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, timeout: number): Observable<U>;
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, timeout: number): Observable<U>;
  (arg1: T, arg2: T, arg3: T, arg4: T, timeout: number): Observable<U>;
  (arg1: T, arg2: T, arg3: T, timeout: number): Observable<U>;
  (arg1: T, arg2: T, timeout: number): Observable<U>;
  (arg1: T, timeout: number): Observable<U>;
  (arg1: Array<T | number>): Observable<U>;
  (...args: Array<T | number>): Observable<U>;
}

interface OverloadedKeyCommand<T, U> {
  (key: KeyType, ...args: T[]): Observable<U>;
  (key: KeyType, arg1: T[]): Observable<U>;
}

interface OverloadedEvalCommand<T, U> {
  (script: string, numKeys: number, ...args: T[]): Observable<U>;
  (script: string, numKeys: number, arg1: T[]): Observable<U>;
}

interface OverloadedHashCommand<T, U> {
  (data: T[] | { [key: string]: T } | Map<string, T>): Observable<U>;
  (...args: T[]): Observable<U>;
}

interface OverloadedKeyedHashCommand<T, U> {
  (key: KeyType, data: T[] | { [key: string]: T } | Map<string, ValueType>): Observable<U>;
  (key: KeyType, ...args: T[]): Observable<U>;
}

interface OverloadedCommand<T, U> {
  (...args: T[]): Observable<U>;
  (arg1: T[]): Observable<U>;
}

interface OverloadedSubCommand<T, U> {
  (...args: T[]): Observable<U>;
  (arg1: T[]): Observable<U>;
}

interface OverloadedListCommand<T, U> {
  (...args: T[]): Observable<U>;
  (arg1: T[]): Observable<U>;
}

export type IORedisClient = IORedis.Redis;
export type NodeRedisClient = NodeRedis.RedisClient;

/**
 * Pipeline
 */
export type Pipeline = IORedis.Pipeline;
// export interface Pipeline extends IORedis.Pipeline {
//   exec<T>(callback?: Callback<Array<[Error | null, T]>>): Observable<T[]>;
//   exec<T>(): Observable<T[]>;
// }
// export interface Pipeline {
//   append(key: KeyType, value: ValueType, callback?: Callback<number>): Pipeline;
//   auth(password: string, callback?: Callback<string>): Pipeline;
//   auth(username: string, password: string, callback?: Callback<string>): Pipeline;
//   bgrewriteaof(callback?: Callback<string>): Pipeline;
//   bgsave(callback?: Callback<string>): Pipeline;
//   bitcount(key: KeyType, callback?: Callback<number>): Pipeline;
//   bitcount(key: KeyType, start: number, end: number, callback?: Callback<number>): Pipeline;
//   blpop(...keys: KeyType[]): Pipeline;
//   brpop(...keys: KeyType[]): Pipeline;
//   brpoplpush(source: string, destination: string, timeout: number, callback?: Callback<string>): Pipeline;
//   bzpopmax(...args: Array<string | number | Callback<[string, string, string]>>): Pipeline;
//   bzpopmin(...args: Array<string | number | Callback<[string, string, string]>>): Pipeline;
//   cluster(...args: ValueType[]): Pipeline;
//   config(...args: ValueType[]): Pipeline;
//   dbsize(callback?: Callback<number>): Pipeline;
//   debug(...args: ValueType[]): Pipeline;
//   decr(key: KeyType, callback?: Callback<number>): Pipeline;
//   decrby(key: KeyType, decrement: number, callback?: Callback<number>): Pipeline;
//   del(...keys: KeyType[]): Pipeline;
//   discard(callback?: Callback<any>): Pipeline;
//   dump(key: KeyType, callback?: Callback<string>): Pipeline;
//   echo(message: string, callback?: Callback<string>): Pipeline;
//   eval(script: string, numKeys: number, ...args: ValueType[]): Pipeline;
//   evalsha(scriptSha: string, numKeys: string, ...args: ValueType[]): Pipeline;
//   exec(callback?: Callback<Array<[Error | null, any]>>): Observable<Array<[Error | null, any]>>;
//   exists(...keys: KeyType[]): Pipeline;
//   expire(key: KeyType, seconds: number, callback?: Callback<BooleanResponse>): Pipeline;
//   expireat(key: KeyType, timestamp: number, callback?: Callback<BooleanResponse>): Pipeline;
//   flushall(callback?: Callback<string>): Pipeline;
//   flushdb(callback?: Callback<string>): Pipeline;
//   geoadd(key: KeyType, longitude: number, latitude: number, member: string, callback?: Callback<number>): Pipeline;
//   geodist(
//     key: KeyType,
//     member1: string,
//     member2: string,
//     unit: 'm' | 'km' | 'ft' | 'mi',
//     callback?: Callback<string | null>
//   ): Pipeline;
//   geohash(key: KeyType, ...fields: string[]): Pipeline;
//   geopos(key: KeyType, ...fields: string[]): Pipeline;
//   georadius(
//     key: KeyType,
//     longitude: number,
//     latitude: number,
//     radius: number,
//     unit: 'm' | 'km' | 'ft' | 'mi',
//     callback?: Callback<string[]>
//   ): Pipeline;
//   georadius(
//     key: KeyType,
//     longitude: number,
//     latitude: number,
//     radius: number,
//     unit: 'm' | 'km' | 'ft' | 'mi',
//     count: 'COUNT',
//     countValue: number,
//     callback?: Callback<string[]>
//   ): Pipeline;
//   georadiusbymember(
//     key: KeyType,
//     member: string,
//     radius: number,
//     unit: 'm' | 'km' | 'ft' | 'mi',
//     callback?: Callback<string[]>
//   ): Pipeline;
//   georadiusbymember(
//     key: KeyType,
//     member: string,
//     radius: number,
//     unit: 'm' | 'km' | 'ft' | 'mi',
//     count: 'COUNT',
//     countValue: number,
//     callback?: Callback<string[]>
//   ): Pipeline;
//   get(key: KeyType, callback?: Callback<string>): Pipeline;
//   getbit(key: KeyType, offset: number, callback?: Callback<number>): Pipeline;
//   getrange(key: KeyType, start: number, end: number, callback?: Callback<string>): Pipeline;
//   getset(key: KeyType, value: ValueType, callback?: Callback<string>): Pipeline;
//   hdel(key: KeyType, ...fields: string[]): Pipeline;
//   hexists(key: KeyType, field: string, callback?: Callback<BooleanResponse>): Pipeline;
//   hget(key: KeyType, field: string, callback?: Callback<string | string>): Pipeline;
//   hgetall(key: KeyType, callback?: Callback<Record<string, string>>): Pipeline;
//   hincrby(key: KeyType, field: string, increment: number, callback?: Callback<number>): Pipeline;
//   hincrbyfloat(key: KeyType, field: string, increment: number, callback?: Callback<number>): Pipeline;
//   hkeys(key: KeyType, callback?: Callback<string[]>): Pipeline;
//   hlen(key: KeyType, callback?: Callback<number>): Pipeline;
//   hmget(key: KeyType, ...fields: string[]): Pipeline;
//   hmset(key: KeyType, ...args: ValueType[]): Pipeline;
//   hmset(key: KeyType, data: Record<string, unknown> | Map<string, any>, callback?: Callback<BooleanResponse>): Pipeline;
//   hscan(key: KeyType, cursor: number | string, ...args: ValueType[]): Pipeline;
//   hset(key: KeyType, ...args: ValueType[]): Pipeline;
//   hset(key: KeyType, data: Record<string, unknown> | Map<string, any>, callback?: Callback<BooleanResponse>): Pipeline;
//   hset(key: KeyType, field: string, value: ValueType, callback?: Callback<BooleanResponse>): Pipeline;
//   hsetnx(key: KeyType, field: string, value: ValueType, callback?: Callback<BooleanResponse>): Pipeline;
//   hstrlen(key: KeyType, field: string, callback?: Callback<number>): Pipeline;
//   hvals(key: KeyType, callback?: Callback<string[]>): Pipeline;
//   incr(key: KeyType, callback?: Callback<number>): Pipeline;
//   incrby(key: KeyType, increment: number, callback?: Callback<number>): Pipeline;
//   incrbyfloat(key: KeyType, increment: number, callback?: Callback<number>): Pipeline;
//   info(callback?: Callback<string>): Pipeline;
//   info(section: string, callback?: Callback<string>): Pipeline;
//   keys(pattern: string, callback?: Callback<string[]>): Pipeline;
//   lastsave(callback?: Callback<number>): Pipeline;
//   lindex(key: KeyType, index: number, callback?: Callback<string>): Pipeline;
//   linsert(
//     key: KeyType,
//     direction: 'BEFORE' | 'AFTER',
//     pivot: string,
//     value: ValueType,
//     callback?: Callback<number>
//   ): Pipeline;
//   llen(key: KeyType, callback?: Callback<number>): Pipeline;
//   lpop(key: KeyType, callback?: Callback<string>): Pipeline;
//   lpush(key: KeyType, ...values: ValueType[]): Pipeline;
//   lpushx(key: KeyType, value: ValueType, callback?: Callback<number>): Pipeline;
//   lrange(key: KeyType, start: number, stop: number, callback?: Callback<string[]>): Pipeline;
//   lrem(key: KeyType, count: number, value: ValueType, callback?: Callback<number>): Pipeline;
//   lset(key: KeyType, index: number, value: ValueType, callback?: Callback<Ok>): Pipeline;
//   ltrim(key: KeyType, start: number, stop: number, callback?: Callback<Ok>): Pipeline;
//   memory(argument: 'USAGE', key: KeyType, callback?: Callback<number>): Pipeline;
//   mget(...keys: KeyType[]): Pipeline;
//   migrate(...args: ValueType[]): Pipeline;
//   monitor(callback?: Callback<EventEmitter>): Pipeline;
//   move(key: KeyType, db: string, callback?: Callback<BooleanResponse>): Pipeline;
//   mset(...args: ValueType[]): Pipeline;
//   mset(data: Record<string, unknown> | Map<string, any>, callback?: Callback<string>): Pipeline;
//   msetnx(...args: ValueType[]): Pipeline;
//   msetnx(data: Record<string, unknown> | Map<string, any>, callback?: Callback<BooleanResponse>): Pipeline;
//   multi(callback?: Callback<string>): Pipeline;
//   object(subcommand: string, ...args: ValueType[]): Pipeline;
//   persist(key: KeyType, callback?: Callback<BooleanResponse>): Pipeline;
//   pexpire(key: KeyType, milliseconds: number, callback?: Callback<BooleanResponse>): Pipeline;
//   pexpireat(key: KeyType, millisecondsTimestamp: number, callback?: Callback<BooleanResponse>): Pipeline;
//   pfadd(key: KeyType, ...elements: string[]): Pipeline;
//   pfcount(...keys: KeyType[]): Pipeline;
//   pfmerge(destkey: KeyType, ...sourcekeys: KeyType[]): Pipeline;
//   ping(callback?: Callback<string>): Pipeline;
//   ping(message: string, callback?: Callback<string>): Pipeline;
//   psetex(key: KeyType, milliseconds: number, value: ValueType, callback?: Callback<Ok>): Pipeline;
//   psubscribe(...patterns: string[]): Pipeline;
//   pttl(key: KeyType, callback?: Callback<number>): Pipeline;
//   publish(channel: string, message: string, callback?: Callback<number>): Pipeline;
//   punsubscribe(...patterns: string[]): Pipeline;
//   randomkey(callback?: Callback<string>): Pipeline;
//   rename(key: KeyType, newkey: KeyType, callback?: Callback<string>): Pipeline;
//   renamenx(key: KeyType, newkey: KeyType, callback?: Callback<BooleanResponse>): Pipeline;
//   restore(...args: ValueType[]): Pipeline;
//   rpop(key: KeyType, callback?: Callback<string>): Pipeline;
//   rpoplpush(source: string, destination: string, callback?: Callback<string>): Pipeline;
//   rpush(key: KeyType, ...values: ValueType[]): Pipeline;
//   rpushx(key: KeyType, value: ValueType, callback?: Callback<number>): Pipeline;
//   sadd(key: KeyType, ...members: ValueType[]): Pipeline;
//   save(callback?: Callback<string>): Pipeline;
//   scan(cursor: number | string): Pipeline;
//   scan(cursor: number | string, matchOption: 'match' | 'MATCH', pattern: string): Pipeline;
//   scan(cursor: number | string, countOption: 'count' | 'COUNT', count: number): Pipeline;
//   scan(
//     cursor: number | string,
//     matchOption: 'match' | 'MATCH',
//     pattern: string,
//     countOption: 'count' | 'COUNT',
//     count: number
//   ): Pipeline;
//   scan(
//     cursor: number | string,
//     countOption: 'count' | 'COUNT',
//     count: number,
//     matchOption: 'match' | 'MATCH',
//     pattern: string
//   ): Pipeline;
//   scard(key: KeyType, callback?: Callback<number>): Pipeline;
//   script(...args: ValueType[]): Pipeline;
//   sdiff(...keys: KeyType[]): Pipeline;
//   sdiffstore(destination: string, ...keys: KeyType[]): Pipeline;
//   select(index: number, callback?: Callback<string>): Pipeline;
//   set(key: KeyType, value: ValueType, callback?: Callback<string>): Pipeline;
//   set(key: KeyType, value: ValueType, setMode: string, callback?: Callback<string>): Pipeline;
//   set(key: KeyType, value: ValueType, expiryMode: string, time: number, callback?: Callback<string>): Pipeline;
//   set(
//     key: KeyType,
//     value: ValueType,
//     expiryMode: string,
//     time: number,
//     setMode: string,
//     callback?: Callback<string>
//   ): Pipeline;
//   setbit(key: KeyType, offset: number, value: ValueType, callback?: Callback<number>): Pipeline;
//   setex(key: KeyType, seconds: number, value: ValueType, callback?: Callback<Ok>): Pipeline;
//   setnx(key: KeyType, value: ValueType, callback?: Callback<BooleanResponse>): Pipeline;
//   setrange(key: KeyType, offset: number, value: ValueType, callback?: Callback<number>): Pipeline;
//   shutdown(save: 'SAVE' | 'NOSAVE', callback?: Callback<never>): Pipeline;
//   sinter(...keys: KeyType[]): Pipeline;
//   sinterstore(destination: string, ...keys: KeyType[]): Pipeline;
//   sismember(key: KeyType, member: string, callback?: Callback<BooleanResponse>): Pipeline;
//   slaveof(host: string, port: number, callback?: Callback<string>): Pipeline;
//   smembers(key: KeyType, callback?: Callback<string[]>): Pipeline;
//   smove(source: string, destination: string, member: string, callback?: Callback<string>): Pipeline;
//   sort(key: KeyType, ...args: string[]): Pipeline;
//   spop(key: KeyType, callback?: Callback<string | null>): Pipeline;
//   spop(key: KeyType, count: number, callback?: Callback<string[]>): Pipeline;
//   srandmember(key: KeyType, callback?: Callback<string | null>): Pipeline;
//   srandmember(key: KeyType, count: number, callback?: Callback<string[]>): Pipeline;
//   srem(key: KeyType, ...members: ValueType[]): Pipeline;
//   sscan(key: KeyType, cursor: number | string, ...args: ValueType[]): Pipeline;
//   strlen(key: KeyType, callback?: Callback<number>): Pipeline;
//   subscribe(...channels: ValueType[]): Pipeline;
//   substr(key: KeyType, start: number, end: number, callback?: Callback<string>): Pipeline;
//   sunion(...keys: KeyType[]): Pipeline;
//   sunionstore(destination: string, ...keys: KeyType[]): Pipeline;
//   sync(callback?: Callback<any>): Pipeline;
//   time(callback?: Callback<[string, string]>): Pipeline;
//   ttl(key: KeyType, callback?: Callback<number>): Pipeline;
//   type(key: KeyType, callback?: Callback<string>): Pipeline;
//   unlink(...keys: KeyType[]): Pipeline;
//   unsubscribe(...channels: string[]): Pipeline;
//   unwatch(callback?: Callback<string>): Pipeline;
//   watch(...keys: KeyType[]): Pipeline;
//   xack(key: KeyType, group: string, ...ids: string[]): Pipeline;
//   xadd(key: KeyType, id: string, ...args: string[]): Pipeline;
//   xclaim(
//     key: KeyType,
//     group: string,
//     consumer: string,
//     minIdleTime: number,
//     id: string,
//     ...args: ValueType[]
//   ): Pipeline;
//   xdel(key: KeyType, ...ids: string[]): Pipeline;
//   xgroup(...args: ValueType[]): Pipeline;
//   xinfo(...args: ValueType[]): Pipeline;
//   xlen(key: KeyType): Pipeline;
//   xpending(key: KeyType, group: string, ...args: ValueType[]): Pipeline;
//   xrange(key: KeyType, start: string, end: string, ...args: ValueType[]): Pipeline;
//   xread(...args: ValueType[]): Pipeline;
//   xreadgroup(command: 'GROUP' | 'group', group: string, consumer: string, ...args: ValueType[]): Pipeline;
//   xrevrange(key: KeyType, end: string, start: string, ...args: ValueType[]): Pipeline;
//   xtrim(key: KeyType, strategy: 'MAXLEN' | 'maxlen', ...args: ValueType[]): Pipeline;
//   zadd(key: KeyType, ...scoresAndMembers: Array<number | string>): Pipeline;
//   zcard(key: KeyType, callback?: Callback<number>): Pipeline;
//   zcount(key: KeyType, min: number | string, max: number | string, callback?: Callback<number>): Pipeline;
//   zinterstore(destination: string, numkeys: number, key: KeyType, ...args: string[]): Pipeline;
//   zincrby(key: KeyType, increment: number, member: string, callback?: Callback<string>): Pipeline;
//   zpopmax(key: KeyType, count: number, callback?: Callback<string[]>): Pipeline;
//   zpopmin(key: KeyType, count: number, callback?: Callback<string[]>): Pipeline;
//   zrange(key: KeyType, start: number, stop: number, callback?: Callback<string[]>): Pipeline;
//   zrange(key: KeyType, start: number, stop: number, withScores: 'WITHSCORES', callback?: Callback<string[]>): Pipeline;
//   zrangebylex(key: KeyType, min: string, max: string, callback?: Callback<string[]>): Pipeline;
//   zrangebylex(
//     key: KeyType,
//     min: string,
//     max: string,
//     limit: 'LIMIT',
//     offset: number,
//     count: number,
//     callback?: Callback<string[]>
//   ): Pipeline;
//   zrangebyscore(key: KeyType, min: number | string, max: number | string, ...args: string[]): Pipeline;
//   zrank(key: KeyType, member: string, callback?: Callback<number>): Pipeline;
//   zrem(key: KeyType, ...members: ValueType[]): Pipeline;
//   zremrangebylex(key: KeyType, min: string, max: string, callback?: Callback<number>): Pipeline;
//   zremrangebyrank(key: KeyType, start: number, stop: number, callback?: Callback<number>): Pipeline;
//   zremrangebyscore(key: KeyType, min: number | string, max: number | string, callback?: Callback<number>): Pipeline;
//   zrevrange(key: KeyType, start: number, stop: number, callback?: Callback<string[]>): Pipeline;
//   zrevrange(
//     key: KeyType,
//     start: number,
//     stop: number,
//     withScores: 'WITHSCORES',
//     callback?: Callback<string[]>
//   ): Pipeline;
//   zrevrangebylex(key: KeyType, min: string, max: string, callback?: Callback<string[]>): Pipeline;
//   zrevrangebylex(
//     key: KeyType,
//     min: string,
//     max: string,
//     limit: 'LIMIT',
//     offset: number,
//     count: number,
//     callback?: Callback<string[]>
//   ): Pipeline;
//   zrevrangebyscore(key: KeyType, max: number | string, min: number | string, ...args: string[]): Pipeline;
//   zrevrank(key: KeyType, member: string, callback?: Callback<number>): Pipeline;
//   zscan(key: KeyType, cursor: number | string, ...args: ValueType[]): Pipeline;
//   zscore(key: KeyType, member: string, callback?: Callback<number>): Pipeline;
//   zunionstore(destination: string, numkeys: number, key: KeyType, ...args: string[]): Pipeline;
// }

/**
 * Commands
 */
interface RedisCommands {
  append(key: KeyType, value: ValueType): Observable<number>;
  auth(username: string, password: string): Observable<string>;
  auth(password: string): Observable<string>;
  bgrewriteaof(): Observable<string>;
  bgsave(): Observable<string>;
  bitcount(key: KeyType): Observable<number>;
  bitcount(key: KeyType, start: number, end: number): Observable<number>;
  blpop: OverloadedBlockingListCommand<KeyType, [string, string]>;
  brpop: OverloadedBlockingListCommand<KeyType, [string, string]>;
  brpoplpush(source: string, destination: string, timeout: number): Observable<string>;
  bzpopmax: OverloadedBlockingListCommand<KeyType, [string, string, string]>;
  bzpopmin: OverloadedBlockingListCommand<KeyType, [string, string, string]>;
  cluster: OverloadedSubCommand<ValueType, any>;
  config(op: 'GET', cfg: string): Observable<string[]>;
  config(op: 'REWRITE' | 'RESETSTAT'): Observable<Ok>;
  config(op: 'SET', key: string, value: ValueType): Observable<Ok>;
  dbsize(): Observable<number>;
  debug: OverloadedSubCommand<ValueType, any>;
  decr(key: KeyType): Observable<number>;
  decrby(key: KeyType, decrement: number): Observable<number>;
  del: OverloadedListCommand<KeyType, number>;
  discard(): Observable<Ok>;
  dump(key: KeyType): Observable<string>;
  echo(message: string): Observable<string>;
  eval: OverloadedEvalCommand<ValueType, any>;
  evalsha: OverloadedEvalCommand<ValueType, any>;
  exec(): Observable<Array<[Error | null, string]>>;
  exists(...keys: KeyType[]): Observable<number>;
  expire(key: KeyType, seconds: number): Observable<BooleanResponse>;
  expireat(key: KeyType, timestamp: number): Observable<BooleanResponse>;
  flushall(): Observable<Ok>;
  flushdb(): Observable<Ok>;
  geoadd(key: KeyType, longitude: number, latitude: number, member: string): Observable<number>;
  geodist(key: KeyType, member1: string, member2: string, unit: 'm' | 'km' | 'ft' | 'mi'): Observable<string | null>;
  geohash: OverloadedKeyCommand<string, string[]>;
  geopos: OverloadedKeyCommand<string, string[]>;
  georadius(
    key: KeyType,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'm' | 'km' | 'ft' | 'mi',
    sort?: 'ASC' | 'DESC'
  ): Observable<string[]>;
  georadius(
    key: KeyType,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'm' | 'km' | 'ft' | 'mi',
    count: 'COUNT',
    countValue: number,
    sort?: 'ASC' | 'DESC'
  ): Observable<string[]>;
  georadiusbymember(key: KeyType, member: string, radius: number, unit: 'm' | 'km' | 'ft' | 'mi'): Observable<string[]>;
  georadiusbymember(
    key: KeyType,
    member: string,
    radius: number,
    unit: 'm' | 'km' | 'ft' | 'mi',
    count: 'COUNT',
    countValue: number
  ): Observable<string[]>;
  get(key: KeyType): Observable<string | null>;
  getbit(key: KeyType, offset: number): Observable<number>;
  getrange(key: KeyType, start: number, end: number): Observable<string>;
  getset(key: KeyType, value: ValueType): Observable<string | null>;
  hdel: OverloadedKeyCommand<KeyType, number>;
  hexists(key: KeyType, field: string): Observable<BooleanResponse>;
  hget(key: KeyType, field: string): Observable<string | null>;
  hgetall(key: KeyType): Observable<Record<string, string>>;
  hincrby(key: KeyType, field: string, increment: number): Observable<number>;
  hincrbyfloat(key: KeyType, field: string, increment: number): Observable<number>;
  hkeys(key: KeyType): Observable<string[]>;
  hlen(key: KeyType): Observable<number>;
  hmget: OverloadedKeyCommand<KeyType, Array<string | null>>;
  hmset: OverloadedKeyedHashCommand<ValueType, Ok>;
  hscan: OverloadedKeyCommand<ValueType, [string, string[]]>;
  hset: OverloadedKeyedHashCommand<ValueType, number>;
  hsetnx(key: KeyType, field: string, value: ValueType): Observable<BooleanResponse>;
  hstrlen(key: KeyType, field: string): Observable<number>;
  hvals(key: KeyType): Observable<string[]>;
  incr(key: KeyType): Observable<number>;
  incrby(key: KeyType, increment: number): Observable<number>;
  incrbyfloat(key: KeyType, increment: number): Observable<number>;
  info(section?: string): Observable<string>;
  keys(pattern: string): Observable<string[]>;
  lastsave(): Observable<number>;
  lindex(key: KeyType, index: number): Observable<string>;
  linsert(key: KeyType, direction: 'BEFORE' | 'AFTER', pivot: string, value: ValueType): Observable<number>;
  llen(key: KeyType): Observable<number>;
  lpop(key: KeyType): Observable<string>;
  lpos(key: KeyType, value: ValueType, rank?: number, count?: number, maxlen?: number): Observable<number | null>;
  lpush: OverloadedKeyCommand<ValueType, number>;
  lpushx: OverloadedKeyCommand<ValueType, number>;
  lrange(key: KeyType, start: number, stop: number): Observable<string[]>;
  lrem(key: KeyType, count: number, value: ValueType): Observable<number>;
  lset(key: KeyType, index: number, value: ValueType): Observable<Ok>;
  ltrim(key: KeyType, start: number, stop: number): Observable<Ok>;
  memory(argument: 'USAGE', key: KeyType, callback?: Callback<number>): Observable<number>;
  mget: OverloadedListCommand<KeyType, Array<string | null>>;
  migrate: OverloadedListCommand<ValueType, Ok | 'NOKEY'>;
  monitor(): Observable<EventEmitter>;
  move(key: KeyType, db: string): Observable<BooleanResponse>;
  mset: OverloadedHashCommand<ValueType, Ok>;
  msetnx: OverloadedHashCommand<ValueType, BooleanResponse>;
  multi(
    commands?: string[][],
    options?: {
      pipeline: boolean;
    }
  ): Pipeline;
  multi(options: { pipeline: false }): Observable<Ok>;
  object: OverloadedListCommand<ValueType, any>;
  persist(key: KeyType): Observable<BooleanResponse>;
  pexpire(key: KeyType, milliseconds: number): Observable<BooleanResponse>;
  pexpireat(key: KeyType, millisecondsTimestamp: number): Observable<BooleanResponse>;
  pfadd: OverloadedKeyCommand<string, number>;
  pfcount: OverloadedListCommand<KeyType, number>;
  pfmerge: OverloadedKeyCommand<KeyType, Ok>;
  ping(message?: string): Observable<string>;
  psetex(key: KeyType, milliseconds: number, value: ValueType): Observable<Ok>;
  psubscribe: OverloadedListCommand<string, number>;
  pttl(key: KeyType): Observable<number>;
  publish(channel: string, message: string): Observable<number>;
  punsubscribe: OverloadedCommand<string, number>;
  randomkey(): Observable<string>;
  rename(key: KeyType, newkey: KeyType): Observable<Ok>;
  renamenx(key: KeyType, newkey: KeyType): Observable<BooleanResponse>;
  restore: OverloadedListCommand<ValueType, Ok>;
  rpop(key: KeyType): Observable<string>;
  rpoplpush(source: string, destination: string): Observable<string>;
  rpush: OverloadedKeyCommand<ValueType, number>;
  rpushx: OverloadedKeyCommand<ValueType, number>;
  sadd: OverloadedKeyCommand<ValueType, number>;
  save(): Observable<string>;
  scan(cursor: number | string, matchOption: 'match' | 'MATCH', pattern: string): Observable<[string, string[]]>;
  scan(cursor: number | string, countOption: 'count' | 'COUNT', count: number): Observable<[string, string[]]>;
  scan(
    cursor: number | string,
    matchOption: 'match' | 'MATCH',
    pattern: string,
    countOption: 'count' | 'COUNT',
    count: number
  ): Observable<[string, string[]]>;
  scan(
    cursor: number | string,
    countOption: 'count' | 'COUNT',
    count: number,
    matchOption: 'match' | 'MATCH',
    pattern: string
  ): Observable<[string, string[]]>;
  scard(key: KeyType): Observable<number>;
  script: OverloadedSubCommand<ValueType, any>;
  sdiff: OverloadedListCommand<KeyType, string[]>;
  sdiffstore: OverloadedKeyCommand<KeyType, number>;
  select(index: number): Observable<Ok>;
  set(
    key: KeyType,
    value: ValueType,
    expiryMode?: string | any[],
    time?: number | string,
    setMode?: number | string
  ): Observable<Ok | null>;
  setbit(key: KeyType, offset: number, value: ValueType): Observable<number>;
  setex(key: KeyType, seconds: number, value: ValueType): Observable<Ok>;
  setnx(key: KeyType, value: ValueType): Observable<BooleanResponse>;
  setrange(key: KeyType, offset: number, value: ValueType): Observable<number>;
  shutdown(save: 'SAVE' | 'NOSAVE'): Observable<never>;
  sinter: OverloadedListCommand<KeyType, string[]>;
  sinterstore: OverloadedKeyCommand<KeyType, number>;
  sismember(key: KeyType, member: string): Observable<BooleanResponse>;
  slaveof(host: string, port: number): Observable<string>;
  smembers(key: KeyType): Observable<string[]>;
  smove(source: string, destination: string, member: string): Observable<BooleanResponse>;
  sort: OverloadedListCommand<KeyType | number, string[] | number>;
  spop(key: KeyType): Observable<string | null>;
  spop(key: KeyType, count: number): Observable<string[]>;
  srandmember(key: KeyType): Observable<string | null>;
  srandmember(key: KeyType, count: number): Observable<string[]>;
  srem: OverloadedKeyCommand<ValueType, number>;
  sscan(key: KeyType, options?: ScanStreamOption): Readable;
  strlen(key: KeyType): Observable<number>;
  subscribe: OverloadedListCommand<string, number>;
  substr(key: KeyType, start: number, end: number): Observable<string>;
  sunion: OverloadedListCommand<KeyType, string[]>;
  sunionstore: OverloadedKeyCommand<KeyType, number>;
  sync(): Observable<any>;
  time(): Observable<[string, string]>;
  ttl(key: KeyType): Observable<number>;
  type(key: KeyType): Observable<string>;
  unlink: OverloadedListCommand<KeyType, number>;
  unsubscribe: OverloadedCommand<string, number>;
  unwatch(): Observable<string>;
  watch: OverloadedListCommand<KeyType, Ok>;
  xack: OverloadedKeyCommand<ValueType, number>;
  xadd: OverloadedKeyCommand<ValueType, string>;
  xclaim: OverloadedKeyCommand<ValueType, Array<[string, string[]]>>;
  xdel: OverloadedKeyCommand<string, number>;
  xgroup: OverloadedSubCommand<ValueType, Ok>;
  xinfo: OverloadedSubCommand<ValueType, any>;
  xlen(key: KeyType): Observable<number>;
  xpending: OverloadedKeyCommand<ValueType, any>;
  xrange: OverloadedKeyCommand<ValueType, Array<[string, string[]]>>;
  xread: OverloadedListCommand<ValueType, Array<[string, Array<[string, string[]]>]>>;
  xreadgroup: OverloadedKeyCommand<ValueType, Array<[string, string[]]>>;
  xrevrange: OverloadedKeyCommand<ValueType, Array<[string, string[]]>>;
  xtrim: OverloadedKeyCommand<ValueType, number>;
  zadd: OverloadedKeyCommand<KeyType | number, number | string>;
  zcard(key: KeyType): Observable<number>;
  zcount(key: KeyType, min: number | string, max: number | string): Observable<number>;
  zinterstore: OverloadedKeyCommand<KeyType | number, number>;
  zpopmax(key: KeyType, count?: number): Observable<string[]>;
  zpopmin(key: KeyType, count?: number): Observable<string[]>;
  zrange(key: KeyType, start: number, stop: number, withScores?: 'WITHSCORES'): Observable<string[]>;
  zrangebylex(key: KeyType, min: string, max: string): Observable<string[]>;
  zrangebylex(
    key: KeyType,
    min: string,
    max: string,
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrangebyscore(
    key: KeyType,
    min: number | string,
    max: number | string,
    withScores?: 'WITHSCORES'
  ): Observable<string[]>;
  zrangebyscore(
    key: KeyType,
    min: number | string,
    max: number | string,
    withScores: 'WITHSCORES',
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrangebyscore(
    key: KeyType,
    min: number | string,
    max: number | string,
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrank(key: KeyType, member: string): Observable<number | null>;
  zrem: OverloadedKeyCommand<ValueType, number>;
  zremrangebylex(key: KeyType, min: string, max: string): Observable<number>;
  zremrangebyrank(key: KeyType, start: number, stop: number): Observable<number>;
  zremrangebyscore(key: KeyType, min: number | string, max: number | string): Observable<number>;
  zrevrangebylex(key: KeyType, min: string, max: string): Observable<string[]>;
  zrevrangebylex(
    key: KeyType,
    min: string,
    max: string,
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrevrange(key: KeyType, start: number, stop: number, withScores?: 'WITHSCORES'): Observable<string[]>;
  zrevrangebyscore(
    key: KeyType,
    max: number | string,
    min: number | string,
    withScores?: 'WITHSCORES'
  ): Observable<string[]>;
  zrevrangebyscore(
    key: KeyType,
    max: number | string,
    min: number | string,
    withScores: 'WITHSCORES',
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrevrangebyscore(
    key: KeyType,
    max: number | string,
    min: number | string,
    limit: 'LIMIT',
    offset: number,
    count: number
  ): Observable<string[]>;
  zrevrank(key: KeyType, member: string): Observable<number | null>;
  zscan: OverloadedKeyCommand<ValueType, [string, string[]]>;
  zscore(key: KeyType, member: string): Observable<string>;
  zunionstore: OverloadedKeyCommand<KeyType | number, number>;
}

interface RxdisCommon extends RedisCommands {
  __client: IORedisClient | NodeRedisClient;

  disconnect: () => void;
}

export interface RxdisForNodeRedis extends RxdisCommon {
  pipeline?: () => any;
}

export interface RxdisForIORedis extends RxdisCommon {
  pipeline(commands?: string[][]): Pipeline;
}
