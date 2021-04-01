import IORedis from 'ioredis';
import { Rxdis } from '../src';

const client = new IORedis();
const rxdis = Rxdis(client);

describe('IORedis', () => {
  it('set', (complete) => {
    rxdis.set('test', 'hello').subscribe({
      next: (value) => {
        expect(value).toEqual('OK');
      },
      complete
    });
  });

  it('get', (complete) => {
    rxdis.get('test').subscribe({
      next: (value) => {
        expect(value).toEqual('hello');
      },
      complete
    });
  });

  afterAll(() => {
    rxdis.disconnect();
  });
});
