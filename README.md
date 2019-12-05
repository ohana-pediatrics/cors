@ahanapediatrics/cors
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@ahanapediatrics/cors.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ahanapediatrics/cors
[travis-image]: https://img.shields.io/travis/ohanapediatrics/cors.svg?style=flat-square
[travis-url]: https://travis-ci.org/ohanapediatrics/cors
[codecov-image]: https://codecov.io/github/ohanapediatrics/cors/coverage.svg?branch=v2.x
[codecov-url]: https://codecov.io/github/ohanapediatrics/cors?branch=v2.x
[david-image]: https://img.shields.io/david/ohanapediatrics/cors.svg?style=flat-square
[david-url]: https://david-dm.org/ohanapediatrics/cors
[download-image]: https://img.shields.io/npm/dm/@ahanapediatrics/cors.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ahanapediatrics/cors

[Cross-Origin Resource Sharing(CORS)](https://developer.mozilla.org/en/docs/Web/HTTP/Access_control_CORS) for koa

## Installation

```bash
$ npm install @ahanapediatrics/cors --save
```

## Quick start

Enable cors with default options:

- origin: request Origin header
- allowMethods: GET,HEAD,PUT,POST,DELETE,PATCH

```js
const Koa = require('koa');
const cors = require('@ahanapediatrics/cors');

const app = new Koa();
app.use(cors());
```

## cors(options)

```ts
/**
 * CORS middleware
 *
 * @param {CORSOptions} [options]
 * @param [options.origin] `Access-Control-Allow-Origin`, default is request Origin header
 * @param [options.allowMethods] `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 * @param [options.exposeHeaders] `Access-Control-Expose-Headers`
 * @param [options.allowHeaders] `Access-Control-Allow-Headers`
 * @param [options.maxAge] `Access-Control-Max-Age` in seconds
 * @param [options.credentials] `Access-Control-Allow-Credentials`
 * @param [options.keepHeadersOnError] Add set headers to `err.header` if an error is thrown
 * 
 * @return {Middleware} Koa middleware
 * @api public
 */
```

## License

[MIT](./LICENSE)
