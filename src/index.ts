import { bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientType, getClientType } from './helper';
import { IORedisClient, NodeRedisClient, RxdisForIORedis, RxdisForNodeRedis, Pipeline } from './interface';

export * from './interface';

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

  if (clientType === ClientType.IORedis) {
    Object.assign(source, {
      multi(): Pipeline {
        const p = (source.__client as IORedisClient).multi();
        const { exec: execFn } = p;
        Object.assign(p, {
          exec<T>(): Observable<T[]> {
            // eslint-disable-next-line
            const source$ = bindNodeCallback(execFn.bind(p)).apply(null, arguments) as Observable<[Error | null, T][]>;
            return source$.pipe(
              map((xs: [Error | null, T][]) => {
                const errs = [];
                let hasError = false;
                const res = xs.map(([e, v]) => {
                  errs.push(e);
                  if (e != null && !hasError) hasError = true;
                  return v;
                });
                if (hasError) throw errs;
                return res;
              })
            );
          }
        });
        return p as Pipeline;
      },
      pipeline(): Pipeline {
        const p = (source.__client as IORedisClient).pipeline();
        const { exec: execFn } = p;
        Object.assign(p, {
          exec<T>(): Observable<T[]> {
            // eslint-disable-next-line
            const source$ = bindNodeCallback(execFn.bind(p)).apply(null, arguments) as Observable<[Error | null, T][]>;
            return source$.pipe(
              map((xs: [Error | null, T][]) => {
                const errs = [];
                let hasError = false;
                const res = xs.map(([e, v]) => {
                  errs.push(e);
                  if (e != null && !hasError) hasError = true;
                  return v;
                });
                if (hasError) throw errs;
                return res;
              })
            );
          }
        });
        return p as Pipeline;
      }
    });
  }
  // else if (clientType === ClientType.NodeRedis) {
  //   Object.assign(source, {
  //     multi(): Multi {
  //       const p = (source.__client as NodeRedisClient).multi();
  //       const { exec: execFn } = p;
  //       Object.assign(p, {
  //         exec: bindNodeCallback(execFn.bind(p)) as <T>() => Observable<T[]>
  //       });

  //       return p as Multi;
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
