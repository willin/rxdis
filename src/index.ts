import { bindNodeCallback } from 'rxjs';
import { map } from 'rxjs/operators';

export function Rxdis(client) {
  return new Proxy(
    {
      __client: client,
      disconnect(): void {
        client.disconnect();
      },
      pipeline() {
        const p = client.pipeline();
        const { exec } = p;
        p.exec = function () {
          return bindNodeCallback(exec.bind(p))
            .apply(null, arguments)
            .pipe(
              map((xs) => {
                // Map result from [[err, res], [err, res], ...] to [res, res, ...]
                const err = [];
                let hasError = false;
                const res = (xs as any).map((x, i) => {
                  err[i] = x[0];
                  if (x[0] != null && !hasError) hasError = true;
                  return x[1];
                });
                if (hasError) throw err;
                return res;
              })
            );
        };
        return p;
      },
      multi() {
        // IORedis
        if (client.constructor.name === 'Redis') {
          const p = client.multi();
          const { exec } = p;
          p.exec = function () {
            return bindNodeCallback(exec.bind(p))
              .apply(null, arguments)
              .pipe(
                map((xs) => {
                  // Map result from [[err, res], [err, res], ...] to [res, res, ...]
                  const err = [];
                  let hasError = false;
                  const res = (xs as any).map((x, i) => {
                    err[i] = x[0];
                    if (x[0] != null && !hasError) hasError = true;
                    return x[1];
                  });
                  if (hasError) throw err;
                  return res;
                })
              );
          };
          return p;
        }
        // clientconstructor.name === 'RedisClient'
        // node_redis
        const p = client.multi();
        const { exec } = p;
        p.exec = bindNodeCallback(exec.bind(p));
        return p;
      }
    },
    {
      get(obj, property: string | symbol) {
        if (Object.keys(obj).includes(property.toString())) {
          return obj[property];
        }
        return bindNodeCallback(obj.__client[property].bind(obj.__client));
      }
    }
  );
}

export default Rxdis;
