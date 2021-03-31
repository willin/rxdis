import { bindNodeCallback } from 'rxjs';
// import { map } from 'rxjs/operators';
import { ClientType, getClientType } from './helper';
import { IORedisClient, NodeRedisClient, RxdisForIORedis, RxdisForNodeRedis } from './interface';

// export * from './interface';

export function Rxdis(client: IORedisClient): RxdisForIORedis;
export function Rxdis(client: NodeRedisClient): RxdisForNodeRedis;
export function Rxdis(client: IORedisClient | NodeRedisClient): RxdisForIORedis | RxdisForNodeRedis {
  const clientType = getClientType(client.constructor.name);

  const source = {
    __client: client,
    disconnect(): void {
      switch (clientType) {
        case ClientType.IORedis: {
          return (client as IORedisClient).disconnect();
        }
        case ClientType.NodeRedis: {
          return (client as NodeRedisClient).end(true);
        }
        default: {
          // Unknown
          return undefined;
        }
      }
    }
  };

  // if (clientType === ClientType.IORedis) {
  //   Object.assign(source, {
  //     pipeline(): Pipeline {
  //       const p = (source.__client as IORedisClient).pipeline();
  //       const { exec: execFn } = p;
  //       p.exec = function exec() {
  //         // <T>(callback?: (err: Error | null, res: [Error | null, T][]) => void): Observable<T[]> {
  //         console.log('test');
  //         const source$ = bindNodeCallback(execFn.bind(p))(callback);
  //         return source$; // as Observable<T[]>;
  //         // return source$.pipe() as Observable<T[]>;
  //       };
  //       return p;
  //     }
  //   });
  // }

  const handler = {
    get(obj: RxdisForIORedis | RxdisForNodeRedis, property: string): any {
      if (Object.keys(obj).includes(property)) {
        return obj[property as keyof typeof obj];
      }
      // eslint-disable-next-line
      return bindNodeCallback(obj.__client[property].bind(obj.__client));
    }
  };

  return new Proxy(source, handler) as RxdisForIORedis | RxdisForNodeRedis;
}

export default Rxdis;
