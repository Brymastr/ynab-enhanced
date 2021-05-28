import { createResponse } from 'src/util/helpers';

type ExtractFunctionArguments<Fn> = Fn extends (...args: infer P) => any ? P : never;
type ExtractFunctionReturnValue<Fn> = Fn extends (...args: any[]) => infer P ? P : never;
type AnyFunction<Fn> = Fn extends (...args: infer X) => infer Y ? (args: X) => Y : never;
type PipeFunction<X, Y = any> = (arg: X) => Y;
// type AnyFunction = (...args: any[]) => any;
type ErrorFunction = (err: any) => any;

// declare interface Middleware<X> {
//   pipe(fn: PipeFunction<X>);
// }

class Middleware<X = any> {
  private fn: PipeFunction<X>;
  public next: Middleware;

  constructor(fn: PipeFunction<any>) {
    this.fn = fn;
  }

  public pipe(fn: PipeFunction<X>) {
    const next = new Middleware(fn);

    return next;
  }

  public handler() {}

  public catch(fn: ErrorFunction) {}
}

function f1(str: string) {
  console.log('f1 input:', str);

  return 'f1 output';
}

function f2(str: string) {
  console.log('f2 input:', str);
  throw 'An unknown error has occured';
  return true;
}

function f3(str: string) {
  console.log('f3 input:', str);
  return 'f3 output';
}

function catchFunc(err: any) {
  console.log('catch');
  return { message: err };
}

const s1 = new Middleware(f1);
const s2 = new Middleware(f2);

console.log(newFunc('an arbitrary string'));
