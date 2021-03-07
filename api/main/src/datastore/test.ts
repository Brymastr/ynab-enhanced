import YnabDatastore, { Schema } from './Ynab';
import Datastore from './Datastore';
import SessionDatastore from './Session';
import { randomBytes } from 'crypto';

// (async function main() {
//   const x = new YnabDatastore();

//   const result = await x.getByYnabUserId('bc7710b1-9229-497d-9e28-89161eee1241');
//   console.log(result);
// })();

// (async function main() {
//   const x = new Datastore();

//   const result = await x['getItem']({
//     HashKey: '1d19ddb5-bee2-4d23-a773-3226084c25ac',
//     RangeKey: 'Info',
//   });
//   console.log(result);
// })();

// (async function main() {
//   const x = new SessionDatastore();

//   const result = await x.getSessionByUser('1d19ddb5-bee2-4d23-a773-3226084c25ac');
//   console.log(result);
// })();

(async function main() {
  const x = randomBytes(32).toString('hex');
  console.log(x);
  ad2ce4ad4e0d78f10517e0e1fcbecd471ab6eca8279f12f98548f194b1ca882f;
})();
