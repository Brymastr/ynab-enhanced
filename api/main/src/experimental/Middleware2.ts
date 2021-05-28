import { APIGatewayProxyHandler } from 'aws-lambda';

type AnyFunction = (...args: any[]) => any;
type ErrorFunction = (err: any) => any;

// @ts-ignore
async function reducer(arg, fn) {
  return await fn(arg);
}

export default class Middleware {
  private functions: AnyFunction[] = [];
  private catchFunc: ErrorFunction;

  constructor(fn?: AnyFunction) {
    if (fn) this.pipe(fn);
  }

  public pipe(fn: AnyFunction) {
    this.functions.push(fn);
    return this;
  }

  public handler() {
    const [entry, ...fns] = this.functions;

    const composedFunction: APIGatewayProxyHandler = async (...args) => {
      try {
        const isAsync = entry.constructor.name === 'AsyncFunction';
        const firstFuncResult = isAsync ? await entry(...args) : entry(...args);

        const restFuncResult = await fns.reduce(async (arg, fn) => await fn(arg), firstFuncResult);

        return restFuncResult;
      } catch (err) {
        if (this.catchFunc !== undefined) {
          return this.catchFunc.call(this, err);
        } else throw err;
      }
    };

    return composedFunction;
  }

  public catch(fn: ErrorFunction) {
    this.catchFunc = fn;
    return this;
  }
}

// function f1(str: string): string {
//   console.log('f1 input:', str);

//   return 'f1 output';
// }

// function f2(str: string): string {
//   console.log('f2 input:', str);
//   // throw 'An unknown error has occured';
//   return 'f2 output';
// }

// function f3(str: string): string {
//   console.log('f3 input:', str);
//   return 'f3 output';
// }

// function catchFunc(err: any) {
//   console.log('catch');
//   console.error(err);
//   return { message: err };
// }

// const newFunc = new Middleware().pipe(f1).pipe(f2).pipe(f3).catch(catchFunc).handler();

// console.log(newFunc('an arbitrary string'));
