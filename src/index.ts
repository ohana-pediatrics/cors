import { Middleware, ParameterizedContext } from "koa";

const vary = require('vary');

export type CORSOptions = {
  origin?: string | ((ctx: ParameterizedContext) => string|false|Promise<string|false> )|  Promise<string>
  allowMethods?: string | string[],
  exposeHeaders?: string | string[],
  allowHeaders?: string | string[],
  maxAge?: string | number,
  credentials?: boolean,
  keepHeadersOnError?: boolean
};

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
export const cors = (options:CORSOptions = {}): Middleware => {
  const defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  options = Object.assign({}, defaults, options);

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.credentials = !!options.credentials;
  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return async (ctx, next) => {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    const requestOrigin = ctx.get('Origin');

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary('Origin');

    if (!requestOrigin) return await next();

    let origin: string;
    if(options.origin instanceof Promise) {
      origin = await options.origin;
    } else if (typeof options.origin === 'function') {
      const result = await options.origin(ctx);
      if (!result) { 
        return await next();
      }
      origin = result;
    } else {
      origin = options.origin ?? requestOrigin;
    }

    const headersSet: Record<string, string | string[]> = {};

    function set(key: string, value: string | string[]) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (!options.keepHeadersOnError) {
        return await next();
      }
      try {
        return await next();
      } catch (err) {
        const errHeadersSet = err.headers || {};
        const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
        delete errHeadersSet.Vary;

        err.headers = Object.assign({}, errHeadersSet, headersSet, { vary: varyWithOrigin });

        throw err;
      }
    } else {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return await next();
      }

      ctx.set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', `${options.maxAge}`);
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      let allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }
      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }

      ctx.status = 204;
    }
  };
};
