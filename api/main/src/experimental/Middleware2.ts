import { APIGatewayProxyHandler } from 'aws-lambda';

type AnyFunction = (...args: any[]) => any;
type ErrorFunction = (err: any) => any;

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
