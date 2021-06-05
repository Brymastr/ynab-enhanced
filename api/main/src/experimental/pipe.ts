export type ExtractFunctionArguments<Fn> = Fn extends (...args: infer P) => any ? P : never;
export type ExtractFunctionReturnValue<Fn> = Fn extends (...args: any[]) => infer P ? P : never;
export type FirstFunction = (...args: any[]) => any;
export type OtherFunction = (arg: any) => unknown;
export type IsAny<O, T = true, F = false> = any extends O ? (any extends O ? T : F) : F;

export type Pipe<
  Fns extends any[],
  PreviousFunction = void,
  InitalParams extends any[] = any[],
  ReturnType = any,
> = {
  next: ((..._: Fns) => any) extends (_: infer First, ..._1: infer Next) => any
    ? PreviousFunction extends void
      ? Pipe<Next, First, ExtractFunctionArguments<First>, ExtractFunctionReturnValue<First>>
      : ReturnType extends ExtractFunctionArguments<First>[0]
      ? Pipe<Next, First, InitalParams, ExtractFunctionReturnValue<First>>
      : IsAny<ReturnType> extends true
      ? Pipe<Next, First, InitalParams, ExtractFunctionReturnValue<First>>
      : {
          ERROR: [
            'Return type',
            ReturnType,
            'does not comply with the input of',
            ExtractFunctionArguments<First>[0],
          ];
          POSITION: ['Incorrect input argument at position', Fns['length']];
        }
    : never;
  done: (...args: InitalParams) => ReturnType;
}[Fns extends [] ? 'done' : 'next'];

export type PipeFn = <Fns extends [FirstFunction, ...OtherFunction[]]>(
  ...fns: Fns & Pipe<Fns> extends FirstFunction ? Fns : never
) => Pipe<Fns>;

// @ts-ignore
export const pipe: PipeFn = function pipe(entry: FirstFunction, ...funcs: OtherFunction[]) {
  return (...args: unknown[]) => {
    return funcs.reduce((acc, item) => {
      return item.call(item, acc);
    }, entry(...args));
  };
};
