declare module "collections/sorted-array-map" {
  type Key = string | number;

  class SortedArrayMap<V> {
    length: number;

    constructor(
      values?: { [key in Key]: V }[],
      equals?: (a: V, b: V) => boolean,
      compare?: (a: V, b: V) => 0 | -1 | 1,
      getDefault?: (key: string) => V
    );

    has(key: Key): boolean;
    get(key: Key, defaultValue?: V): V | undefined;
    set(key: Key, value: V): void;
    add(value: V, key: Key): void;
    delete(key: Key): boolean;
    keys(): Key[];
    values(): V[];
    entries(): { [key in Key]: V }[];
    addEach(value: { [key in Key]: V } | { [key in Key]: V }[]): this;
    deleteEach(value: Key | V, equals?: (a: V, b: V) => boolean): number;
    clear(): void;
    iterate(): Iterator<V>;
    iterator(): Iterator<V>;
    forEach(callbackfn: (value: { [key in Key]: V }, index?: number) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: { [key in Key]: V }, index: Key) => U, thisArg?: any): U[];
    filter(callbackfn: (value: { [key in Key]: V }, index: number) => boolean, thisArg?: any): { [key in Key]: V }[];
    reduce<T>(
      callbackfn: (previousValue: T, currentValue: { [key in Key]: V }, currentIndex: number) => T,
      initialValue?: T
    ): T;
    reduceRight<T>(
      callbackfn: (previousValue: T, currentValue: { [key in Key]: V }, currentIndex: number) => T,
      initialValue?: T
    ): T;
    toArray(): any[];
    toObject(): object;
    toJSON(): string;
  }

  export = SortedArrayMap;
}
