declare module "collections/sorted-array-set" {
  class SortedArraySet<V> {
    length: number;

    constructor(
      values?: V,
      equals?: (a: V, b: V) => boolean,
      compare?: (a: V, b: V) => 0 | -1 | 1,
      getDefault?: (key: string) => V
    );

    add(value: V): void;

    push(...values: V[]): void;
    unshift(...values: V[]): void;
    pop(): V;
    shift(): V;

    union(values: SortedArraySet<V>): SortedArraySet<V>;
    intersection(values: SortedArraySet<V>): SortedArraySet<V>;
    difference(values: SortedArraySet<V>): SortedArraySet<V>;
    symmetricDifference(values: SortedArraySet<V>): SortedArraySet<V>;

    has(value: any): boolean;
    contains(value: any): boolean;

    get(value: any): V;

    delete(value: any): boolean;
    remove(value: any): boolean;

    toggle(value: V): void;

    clear(): void;

    forEach(callbackfn: (value: V, index?: number) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: V, index: number) => U, thisArg?: any): U[];
    filter(callbackfn: (value: V, index: number) => boolean, thisArg?: any): V[];
    reduce<T>(callbackfn: (previousValue: T, currentValue: V, currentIndex: number) => T, initialValue?: T): T;

    toArray(): V[];
    toObject(): object;
    toJSON(): string;
  }

  export = SortedArraySet;
}
