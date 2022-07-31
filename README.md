# parse-argv

Typesafe and generic command line parsing logic, in typescript.

Basic implementation for parsing from strings in `process.argv` included.

# Example

Define a type for your program's custom options. Eg.:

```typescript
type Env = 'DEV' | 'PROD';
type Options = {
  contrast: number,
  saturation: number,
  env: Env
}
```

Define a parser that handles any value for your `Options` type above. Eg.

```typescript
export const parseValue = (v: string): Env | number | undefined => {
  if (v == 'DEV' || v == 'PROD') {
    return v;
  } else {
    return ParseARGV.parseNumber(v); // Basic primitive value parser included in this lib.
  }
};
```

Define some default options:

```typescript
const opts: Options = {
  contrast: 0,
  saturation: 0,
  env: 'DEV'
};
```

Finally, import `ParseARGV.fromStrings` to use the default parsing. Ie. parsing from strings as they come in `process.argv`. 

```typescript
const opts: Options = ParseARGV.fromStrings(defaults, parseValue)(process.argv);

```
Now you have `opts`, which will always have some value defined.

The included default string parser handles some common things like string splitting by "=" to separate key values, formatting (de-hyphenating, etc.) that is commonly need it. But you could implement your own thing for each of those steps.

(Note that you provided `parseValue` because the default parsing logic doesn't know about your custom types.)

So there's no limitation for the type (ie. its data structure) that an option can be. If you can provide a default, and parse it, then it can be an option.

If you call it with valid values, they will be used.

```typescript

$ node run mycommand -- --contrast=5 --saturation=-3

```

If you pass garbage values:

```typescript

$ node run mycommand -- --contrast= --saturation='Cannibal Corpse'

```

The parsers will fail and the default values you provide will be used instead.

# Contributing

(Property/generative) tests are welcome.

# LICENSE

MIT.

tl;dr: Copy, modify, sell, re-sell, etc. Credit me, or don't. I don't care. Just don't blame me for any disasters you cause.

See license file.
