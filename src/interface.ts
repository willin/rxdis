import { Observable } from 'rxjs';
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
type OriginPipeline = Omit<IORedis.Pipeline, 'exec'>;
export interface Pipeline extends OriginPipeline {
  exec<T, R>(callback?: Callback<Array<[Error | null, R]>>): Observable<T[]>;
  exec<T>(callback?: Callback<Array<[Error | null, any]>>): Observable<T[]>;
  exec(callback?: Callback<Array<[Error | null, any]>>): Promise<Array<[Error | null, any]>>;
}

/**
 * Multi
 */
// type OriginNodeMulti = Omit<NodeRedis.Multi, 'exec' | 'EXEC'>;
// export interface Multi extends OriginNodeMulti {
//   exec<T, R>(cb?: (err: Error | null, reply: R[]) => void): Observable<T[]>;
//   exec<T>(cb?: (err: Error | null, reply: any[]) => void): Observable<T[]>;
//   exec(cb?: (err: Error | null, reply: any[]) => void): boolean;
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
