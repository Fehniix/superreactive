# SuperReactive

![Code Size](https://img.shields.io/github/languages/code-size/fehniix/superreactive)
![npm Total Downloads](https://img.shields.io/npm/dt/superreactive)
![GitHub Open Issues](https://img.shields.io/github/issues-raw/fehniix/superreactive)

This package is to be considered unstable, as it still needs extensive testing - please use with caution!
An updated version of this documentation *might* be available on the [GitHub Repo](https://github.com/Fehniix/superreactive).
If you were to encounter any issue or come up with a suggestion, feel free to open a new issue [here](https://github.com/Fehniix/superreactive/issues).
All PRs and contributions are very well accepted and appreciated - thank you!

## Brief installation and usage notes

Install the package via:
`npm install -S superreactive`

This package was written in TypeScript, type declarations are generated and emitted automatically by the TypeScript compiler.

Once installed, configure the `SuperReactive` service at startup:

```typescript
import SuperReactive, { reactive } from 'superreactive';

class MyClass {
    // Mark property as "reactive" using TypeScript decorators,
    // for the property to be able to emit changes and react to remote changes.
    @reactive('myPropertyIdentifier')
    private myProperty: number = 123;

    constructor() {
        SuperReactive.start(process.env.REDIS_URL, {
            localEndpointName: 'myLocalService',
            remoteEndpointName: 'myRemoteService'
        });
    }
}
```

And that's all there to it, for right now. The `myProperty` property will get written to whenever the "back-end" modifies its "myPropertyIdentifier"-identified instance, and viceversa. The package was written for my own purposes, as a way to immediately synchronize variables across multiple containers/processes.

## Configuration

As of currently, `~0.4.0`, SuperReactive must be configured using the following configuration object:

```typescript
interface SuperReactiveConfiguration {
    /**
     * The **unique** identifier for the current endpoint.
    */
    localEndpointName: string,

    /**
    * The **unique** identifier for the remote endpoint.
    */
    remoteEndpointName: string
}
```

Where, as previously mentioned, `localEndpointName` and `remoteEndpointName` must cross-match; i.e.: your back-end service might be called "back" and your front-end service "front" - on your back-end service, `SuperReactive`'s `localEndpointName` shall be "back", and `remoteEndpointName` be "front"; on your front-end service these two options ought to be opposite.

```typescript
class MyBackEnd {
    @reactive
    private myTest?: string

    public constructor() {
        SuperReactive.start(process.env.MY_REDIS_URL, {
            localEndpointName: 'back',
            remoteEndpointName: 'front'
        });
    }
}

class MyFrontEnd {
    @reactive
    private myTest?: string

    public constructor() {
        SuperReactive.start(process.env.MY_REDIS_URL, {
            localEndpointName: 'front',
            remoteEndpointName: 'back'
        });
    }
}
```

## Events

- `remoteUpdate`: emitted when the remote endpoint updated a value.
- `localValueRead`: emitted when a local `@reactive` property was read.
- `localValueWritten`: emitted when a local `@reactive` property was written to (triggering an update on the remote endpoint).

## License

MIT. Do as you please with this package. Contributions and pull requests are very well accepted, would be my pleasure to review and integrate. Thank you!
