import YnabDatastore, { Schema } from './Ynab';
import Datastore from './Datastore';

// (async function main() {
//   const x = new YnabDatastore();

//   const result = await x.getByYnabUserId('bc7710b1-9229-497d-9e28-89161eee1241');
//   console.log(result);

// })();

(async function main() {
  const x = new Datastore();

  const result = await x['getItem']({
    HashKey: '1d19ddb5-bee2-4d23-a773-3226084c25ac',
    RangeKey: 'Info',
  });
  console.log(result);
})();
