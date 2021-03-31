import Redis from 'redis';
import { Rxdis } from '../src';

const client = Redis.createClient();
const rxdis = Rxdis(client);

describe('Node-Redis', () => {
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
