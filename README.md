# @atomico/rollup-plugin-sizes

This small utility allows you to monitor the size of the bundle as it is generated by rollup, generating a record by console, the size of both in gzip and brotli.

```js
import sizes from "@atomico/rollup-plugins-sizes";

export default {
  input: /*...*/,
  output: /*...*/,
  plugins: [
    sizes()
  ]
};
```

Additionally you can give `sizes(limit:number|string)` a first parameter capable of generating alerts by console, example `size(1.2)` or `size("1.2KB")`, **this parameter will always represent KB**.

1. if it exceeds the limit, the file will be printed in red.
2. If it approaches 90% of the limit, it will be printed in yellow.
3. if it does not fulfill the 2 previous conditions, it is printed in green.

> compatible with dynamic rollup import
