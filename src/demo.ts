import IORedis from 'ioredis';
// import { bindNodeCallback } from 'rxjs';
import { Rxdis } from '.';

const redis = new IORedis();
const rxdis = Rxdis(redis);

const source$ = rxdis
  //
  .pipeline()
  .set('test', 'hello')
  .get('test')
  .exec();

source$.subscribe(console.log);
