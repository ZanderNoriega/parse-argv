# parse-argv

Typesafe and generic command line parsing logic, in typescript.

Basic implementation for parsing from strings in `process.argv` included.

# Example

Define a type for your programs arguments. Eg.:

```
type Env = 'DEV' | 'PROD';
type Options = {
  contrast: number,
  saturation: number,
  env: Env
}
```

Define a parser that handles any value for your `Options` type above. Eg.

```
export const parseValue = (v: string): Env | number | undefined => {
  if (v == 'DEV' || v == 'PROD') {
    return v;
  } else {
    return ParseARGV.parseNumber(v); // Basic primitive value parser included in this lib.
  }
};
```

Define some defaul args for your program:

```
const opts: Options = {
  contrast: 0,
  saturation: 0,
  env: 'DEV'
};
```

Finally, import `ParseARGV.fromStrings` to use the default parsing, ie. parsing from strings as they come in eg. `process.argv`. This default parser has some defaults in its arguments for string separator, string splitting, formatting (de-hyphenating, etc.) that should do the job for most needs.

```
const opts: Options = ParseARGV.fromStrings(defaults, parseValue)(process.argv);

```

(Note that you provided `parseValue` because the default parsing logic doesn't know about your custom types.)

Now you have `opts`, which will always have some value defined.

Meant to be use in the common syntax for bash scripts. Eg.

```

$ node run mycommand -- --contrast=5 --saturation=-3

```

If called with garbage values:

```

$ node run mycommand -- --contrast= --saturation='Cannibal Corpse'

```

The parsers will fail and the values from the `defaults` defined above will be used.

# Contributing

(Property/generative) tests are welcome.

# LICENSE

MIT.

tl;dr: Copy, modify, sell, re-sell, etc. Credit me, or don't. I don't care. Just don't blame me for any disasters you cause.

See license file.
