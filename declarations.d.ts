declare module 'querystring' {
  export function stringify(val: object): string;
  export function parse(val: string): object;
}

export type Function1<T, R> = (t: T) => R;
export type Proc1<T> = (t: T) => void;
export type Proc = () => void;
