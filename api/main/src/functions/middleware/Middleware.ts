/**
 * This class can be used to build an API Gateway triggered Lambda function
 * that is composed of multiple smaller functions. It exposes a pipe function
 * that adds functions in order to a list and uses functional composition to
 * produce one function with the input of the first and the return type of the last.
 * It also exposes a catch function that will catch any errors from any piped function
 * before the final return. It can be used to return an error response to API Gateway instead
 * of just crashing and resulting in a 500.
 */

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

        const restFuncResult = await fns.reduce(async (arg, fn) => fn(await arg), firstFuncResult);

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
