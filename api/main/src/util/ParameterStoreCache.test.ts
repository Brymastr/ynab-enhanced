const prefix = '/a/b/c/d/e/f';
import { GetParametersCommand, GetParametersResult } from '@aws-sdk/client-ssm';

const sendFunc = async (command: GetParametersCommand): Promise<GetParametersResult> => ({
  Parameters: command.input.Names.map((key, index) => ({
    Name: `${key}`,
    Value: `TestValue${index + 1}`,
  })),
});

const ssmMock = jest.mock('@aws-sdk/client-ssm', () => {
  const mockedSSM = {
    send: jest.fn(sendFunc),
  };
  return {
    SSMClient: jest.fn(() => mockedSSM),
    GetParametersCommand,
  };
});

import ParameterStoreCache from './ParameterStoreCache';

describe('ParameterStoreCache', () => {
  const allKeys = ['TestKey1', 'TestKey2', 'TestKey3', 'TestKey4', 'TestKey5'];

  afterAll(() => {
    ssmMock.restoreAllMocks();
  });

  describe('load', () => {
    test('complex prefix is added as expected without provided trailing slash', async () => {
      const expectedValues = allKeys.map((_, index) => `TestValue${index + 1}`);

      const cache = new ParameterStoreCache(allKeys, prefix);

      await cache.load();

      const keys = Array.from(cache['cache'].keys());
      const values = Array.from(cache['cache'].values());

      expect(keys).toStrictEqual(allKeys); // shouldn't include the prefix
      expect(values).toStrictEqual(expectedValues); // shouldn't include the prefix
    });

    test('complex prefix is added as expected with provided trailing slash', async () => {
      const expectedValues = allKeys.map((_, index) => `TestValue${index + 1}`);

      const cache = new ParameterStoreCache(allKeys, prefix + '/');

      await cache.load();

      const keys = Array.from(cache['cache'].keys());
      const values = Array.from(cache['cache'].values());

      expect(keys).toStrictEqual(allKeys); // shouldn't include the prefix
      expect(values).toStrictEqual(expectedValues); // shouldn't include the prefix
    });

    test('values load without prefix', async () => {
      const expectedValues = allKeys.map((_, index) => `TestValue${index + 1}`);

      const cache = new ParameterStoreCache(allKeys);

      await cache.load();

      const keys = Array.from(cache['cache'].keys());
      const values = Array.from(cache['cache'].values());

      expect(keys).toStrictEqual(allKeys); // shouldn't include the prefix
      expect(values).toStrictEqual(expectedValues); // shouldn't include the prefix
    });
  });

  describe('get', () => {
    const loadFunc = async function () {
      allKeys.forEach((key, index) => this.cache.set(key, `${this.prefix}TestValue${index + 1}`));
      this.expires = Date.now() + this.timeoutSeconds * 1000;
    };
    const loadMock = jest.fn(loadFunc);

    afterAll(() => {
      loadMock.mockRestore();
    });
    describe('calling `load` from get', () => {
      afterEach(() => {
        loadMock.mockClear();
      });
      test(`load should not be called when date of 'get' invocation is within expiry date`, async () => {
        const cache = new ParameterStoreCache(allKeys);
        cache.load = loadMock;

        await cache.load();
        loadMock.mockClear();
        const result = await cache.get('TestKey1');
        expect(loadMock).not.toBeCalled();
      });
      test(`load should be called once when date of 'get' invocation is after expiry date`, async () => {
        const cache = new ParameterStoreCache(allKeys, undefined, -1);
        cache.load = loadMock;

        await cache.load();
        loadMock.mockClear();
        const result = await cache.get('TestKey1');
        expect(loadMock).toBeCalledTimes(1);
      });
    });
    describe('get string[]', () => {
      const cache = new ParameterStoreCache(allKeys);
      test(`return list of strings given multiple query keys`, async () => {
        const result = await cache.get(['TestKey1', 'TestKey2', 'TestKey3']);
        expect(result).toStrictEqual(['TestValue1', 'TestValue2', 'TestValue3']);
      });
      test(`return single string in array given array containing a single query key`, async () => {
        const result = await cache.get(['TestKey1']);
        expect(result).toStrictEqual(['TestValue1']);
      });
      test(`return array of strings and undefined given list of keys where only some exist`, async () => {
        const result = await cache.get(['TestKey1', 'InvalidKey1', 'TestKey3', 'InvalidKey2']);
        expect(result).toStrictEqual(['TestValue1', undefined, 'TestValue3', undefined]);
      });
      test(`return array of all undefined given list of keys that don't exist`, async () => {
        const result = await cache.get(['InvalidKey1', 'InvalidKey2', 'InvalidKey3']);
        expect(result).toStrictEqual([undefined, undefined, undefined]);
      });
    });
    describe('get string', () => {
      const cache = new ParameterStoreCache(allKeys);
      test(`return single string given single query key`, async () => {
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test(`return undefined given single query key that doesn't exist`, async () => {
        const result = await cache.get('InvalidKey');
        expect(result).toBeUndefined();
      });
    });
    describe('get string when key prefix', () => {
      test('can fetch key when no prefix', async () => {
        const cache = new ParameterStoreCache(allKeys);
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when simple prefix without trailing slash', async () => {
        const cache = new ParameterStoreCache(allKeys, '/Integrations');
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when simple prefix with trailing slash', async () => {
        const cache = new ParameterStoreCache(allKeys, '/Integrations/');
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when complex prefix without trailing slash', async () => {
        const cache = new ParameterStoreCache(allKeys, '/a/b/c/d/e/f/g');
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when complex prefix with trailing slash', async () => {
        const cache = new ParameterStoreCache(allKeys, '/a/b/c/d/e/f/g/');
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when complex prefix without leading slash', async () => {
        const cache = new ParameterStoreCache(allKeys, 'a/b/c/d/e/f/g/');
        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
      test('can fetch key when complex prefix without leading or trailing slash', async () => {
        const cache = new ParameterStoreCache(allKeys, 'a/b/c/d/e/f/g');

        const result = await cache.get('TestKey1');
        expect(result).toEqual('TestValue1');
      });
    });
  });
  describe('batchParameterKeys', () => {
    test('single batch given less than 10 keys', () => {
      const threeKeys = ['a', 'b', 'c'];
      const cache = new ParameterStoreCache(threeKeys);
      const result = cache['batchParameterKeys'](threeKeys);
      expect(result).toEqual([threeKeys]);
    });
    test('single batch given 10 keys', () => {
      const tenKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      const cache = new ParameterStoreCache(tenKeys);
      const result = cache['batchParameterKeys'](tenKeys);
      expect(result).toEqual([tenKeys]);
    });
    test('two batches given 11 keys', () => {
      const elevenKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const cache = new ParameterStoreCache(elevenKeys);
      const result = cache['batchParameterKeys'](elevenKeys);

      const expected = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], ['k']];
      expect(result).toEqual(expected);
    });
    test('three batches given 21 keys', () => {
      // prettier-ignore
      const allKeys = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u'
      ];
      const cache = new ParameterStoreCache(allKeys);
      const result = cache['batchParameterKeys'](allKeys);

      const expected = [
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
        ['u'],
      ];
      expect(result).toEqual(expected);
    });
  });
  describe('constructor', () => {
    test('Constructor just works, lol', () => {
      const cache = new ParameterStoreCache(['a', 'b'], 'prefixxx', 345);

      expect(cache['names']).toStrictEqual(['a', 'b']);
      expect(cache['prefix']).toEqual('/prefixxx/');
      expect(cache['timeoutSeconds']).toEqual(345);
    });
  });
});
