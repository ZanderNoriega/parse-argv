/**
 * Typesafe options parsing for command line programs.
 */

type ArgsDict<T> = { [k: string]: T[keyof T] };

/**
 * Just an alias. Functorial stuff not implemented.
 */
type Maybe<T> = T | undefined;

/**
 * To parse means to go from some `S` to (maybe) some value
 * whose type is that of a property of some options T.
 */
type Parser<T extends ArgsDict<T>, S> = (k: keyof T, s: S) => Maybe<T[keyof T]>;

/**
 * Fully generic (ie. no mention of `string`) argument parsing logic.
 * `T` would be your programs options interface.
 * (Default implementation where `S` = `string` provided below.)
 */
export const parseOne =
  <T extends ArgsDict<T>, S>(
    defaults: T,
    parseVal: Parser<T, S>,
    sep: S,
    split: (s: S, sep: S) => S[],
    formatKey: (s: S) => keyof T
  ) =>
  (rawArg: S): T => {
    const kv: S[] = split(rawArg, sep);
    const k: Maybe<S> = kv[0];
    const parsedK: Maybe<keyof T> = k ? formatKey(k) : undefined;
    if (parsedK) {
      const v: Maybe<S> = kv[1];
      const parsedV: Maybe<T[keyof T]> = v ? parseVal(parsedK, v) : undefined;
      if (parsedV && typeof defaults[parsedK] == typeof parsedV) {
        return { ...defaults, [parsedK]: parsedV };
      } else {
        return defaults;
      }
    } else {
      return defaults;
    }
  };

/**
 * Default implementations for parsing from string[].
 * Eg. Node's plain `process.argv` array.
 */

const hyphenatedToCamelCase = (s: string): string =>
  s
    .replace('--', '')
    .split('-')
    .map((s, i) => (i > 0 ? s.substr(0, 1).toUpperCase() + s.substr(1) : s))
    .join('');

export const parseNumber = (v: string): number | undefined =>
  v.match(/^[0-9]$|(^[1-9][0-9]*$)/) != null ? Number(v) : undefined;
export const parseBoolean = (v: string): boolean | undefined =>
  v == 'true' ? true : v == 'false' ? false : undefined;

const splitStr = (s: string, sep: string): string[] => s.split(sep);

export const fromStrings =
  <T extends ArgsDict<T>>(
    defaults: T,
    parseVal: Parser<T, string>,
    sep: string = '=',
    split: (s: string, sep: string) => string[] = splitStr,
    formatKey: (s: string) => string = hyphenatedToCamelCase
  ) =>
  (argv: string[]): T => {
    const options: T = argv.reduce((acc: T, x: string) => {
      return parseOne<T, string>(acc, parseVal, sep, split, formatKey)(x || '');
    }, defaults);
    return options;
  };
