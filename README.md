# superreactive

Documentation will be populated at a later date.

## Brief installation and usage notes

Install the package via:
`npm install -S superreactive`

This package was written in TypeScript, type declarations are generated and emitted automatically by the TypeScript compiler; no need to `npm install -D @types/superreactive`.

Once installed, configure the `SuperReactive` service at startup:

```typescript
import SuperReactive, { reactive } from 'superreactive';

class MyClass {
    // Mark property as "reactive" using TypeScript decorators,
    // for the property to be able to emit changes and react to remote changes.
    @reactive('myPropertyIdentifier')
    private myProperty: number = 123;

    constructor() {
        SuperReactive.start('front-end', 'back-end', process.env.REDIS_URL);
    }
}
```

And that's all there to it, for right now. The `myProperty` property will get written to whenever the "back-end" modifies its "myPropertyIdentifier"-identified instance, and viceversa. The package was written for my own purposes, as a way to immediately synchronize variables across multiple containers/processes.

## TODO

Re-write the infrastructure to keep the source of truth **single**.

## License

MIT. Do whatever you please with this package. Contributions and pull requests are very well accepted, would be my pleasure to review and integrate. Thank you!
