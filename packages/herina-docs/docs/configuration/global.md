# Global Config

## environment

- **Required**
- Type: `'development' | 'production'`

The bundle will be built in which mode.

In production mode, code for profiling may be removed and the bundle will be minified by Terser.

## baseUrl

- **Required**
- Type: `string` | `Record<'android' | 'ios', string>`

The base URL for your resouces. This will be used to concat resource file name. When you called `requestBundleUpdate`, Herina would try to concat the bundle name with `baseUrl`. Let's say the `baseUrl` is `https://hector.im`, and the full URL for the business chunk will be `https://hector.im/main.chunk.js`.

If `baseUrl` is an object, each key represents a different base URL for each platform.

You should use https as the protocol. Otherwise, your connection will be seen as unsecured to the OS.

## entryFile

- **Required**
- Type: `string`

The path of your project entry file. Usually, it's `index.js` in the root dictionary.

## outputPath

- **Required**
- Type: `string`

The path of place output files.

## manifestPath

- **Required**
- Type: `string`

The path of place [`manifest.json`](/guide/concepts.html#manifest-json).

## platform

- **Required**
- Type: `'ios' | 'android'`

The target platform for buidling bundle.

## clean

- Type: `boolean`
- Default: `false`

Whether to clean `outputPath` or not before buidling.

## minify

- Type: `boolean`
- Default: `false`

Whether to use Terser to minify output files or not.

This option does not work if the `environment` is set to `production`.

## root

- Type: `string`
- Default: `process.cwd()`

The root dictionary path for your project.

## extensions

- Type: `string[]`
- Default: `["js", "jsx", "ts", "tsx"]`

When it comes to dynamic import, if you require a module without giving its suffix like `import('./dynamic')`, `extensions` will be used to match the correct suffix.

## maxWorkers

The number of workers to use for parallel processing in Metro.

- Type: `number`
- Default: `cpus().length`
