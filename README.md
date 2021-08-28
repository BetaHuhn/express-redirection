<div align="center">
  
# ⚡♻️ Express Redirection

[![Node CI](https://github.com/BetaHuhn/express-redirection/workflows/Node%20CI/badge.svg)](https://github.com/BetaHuhn/express-redirection/actions?query=workflow%3A%22Node+CI%22) [![Release CI](https://github.com/BetaHuhn/express-redirection/workflows/Release%20CI/badge.svg)](https://github.com/BetaHuhn/express-redirection/actions?query=workflow%3A%22Release+CI%22) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/express-redirection/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/express-redirection)

Quick redirect configuration for Express.js

</div>

## Features

- **🔌 Quick integration** - *can be used directly as an Express middleware*
- **🔨 Easy Customization** - *use a simple JSON file to define your redirects*
- **♻️ Path rewrites** - *capture and rewrite parts of your routes*
- **🚦 Conditional redirects** - *redirect based on specific hosts, ips, headers, query strings or cookie values*

## 🚀 Get started

Install [express-redirection](https://github.com/BetaHuhn/express-redirection) via NPM:

```shell
npm install express-redirection
```

*Requires express to be installed*

## 📚 Usage

Create a redirect config `redirects.json` and define your redirects:

*redirects.json*
```json
[
    { "src": "/user", "dest": "/api/user" },
    { "src": "/view-source", "dest": "https://github.com/betahuhn/express-redirection", "statusCode": 308 },
    { 
        "src": "/:path((?!uk/).*)",
        "dest": "/uk/:path*",
        "has": {
            "header": {
                "cf-ipcountry": "GB"
            }
        },
        "statusCode": 307
    }
]
```

Use the middleware with Express:

*index.js*
```js
const express = require('express')
const redirectMiddleware = require('express-redirection')

const app = express()

// Load the redirects from the redirects.json file
const redirects = require('./redirects.json')

// Use the middleware and pass it the redirects
app.use(redirectMiddleware(redirects))
```

> Note: Make sure to use the middleware before any other routes

That's it 🎉

Take a look below to see how to use the `redirects.json` file.

## ⚙️ Configuration

`app.use(redirectMiddleware(redirects))` accepts a JSON array containing redirects to perform. Each item needs to at least include a `src` and `dest` attribute. `src` needs to be a relative pathname, `dist` can be a absolute URL or relative pathname. See below for the rest of the options.

It is recommended to define the redirects in a `redirects.json` file and load it with `require`, but you can also define it programmatically as a JSON object:

*index.js*
```js
const redirects = [ { src: '/foo', dest: '/bar' } ]

app.use(redirectMiddleware(redirects))
```

### Redirect object definition

Here are all the options you can use in the redirect object:

- `src`: A pattern that matches each incoming pathname (excluding querystring). The pattern must follow the syntax from [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
- `dest`: A location destionation defined as a relative pathname or external URL. You can reuse path params from the `src` here.
- `statusCode`: A [HTTP status](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) to return to the client. Defaults to `301`.
- `method`: A [HTTP Request Method](https://datatracker.ietf.org/doc/html/rfc7231#section-4) to match the request to.
- `protocol`: The protocol to match the request to. Either `http` or `https` (for TLS requests).
- `has`: An optional object containing request properties to match against.
    - `host`: The hostname to match against the HTTP host header. Can be a glob expression.
    - `ip`: Matched against the remote IP address of the request. Can be a glob expression.
    - `query`: Match against parsed key value pairs from the request querystring.
        - `key`: string
        - `value`: string. Can be a glob expression.
    - `header`: Match against parsed key value pairs from the request headers.
        - `key`: string
        - `value`: string. Can be a glob expression.
    - `cookie`: Match against parsed key value pairs from cookies sent by the request.
        - `key`: string
        - `value`: string. Can be a glob expression.

## 📖 Examples

Here are some example redirects to use:

### Basic

Here is the most basic configuration consisting of a source pathname and a destination pathname to redirect the request to if it matches the source.

*redirects.json*
```json
[
    { "src": "/user", "dest": "/api/user" }
]
```

### Path params

You can use params (`:string`) to pass parts of a request pathname to the destination:

*redirects.json*
```json
[
    { "src": "/api/:path", "dest": "https://api.example.com/:path" }
]
```

For example `/api/users/names` will be redirected to `https://api.example.com/users/names`.

### Custom status code

By default redirects will be performed with the `301` status code, this can be changed with the `statusCode` option:

*redirects.json*
```json
[
    { "src": "/source", "dest": "https://github.com/betahuhn/express-redirection", "statusCode": 302 },
]
```

### Request method

By default it will redirect requests regardless of the HTTP method used. You can specify a specific one instead:

*redirects.json*
```json
[
    { "method": "POST", "src": "/user", "dest": "/api/user" },
]
```

### Hostname

You can also limit the redirect to a specific hostname:

*redirects.json*
```json
[
    { "host": "example.com", "src": "/user", "dest": "/api/user" },
]
```

The `host` value can also be a glob pattern like `*.example.com`

### Conditional redirect

You can use the `has` option to define propteries that need to exist on the request in order for the redirect to apply:

*redirects.json*
```json
[
    { 
        "src": "/feedback",
        "dest": "/feedback/issue",
        "has": {
            "query": {
                "type": "issue"
            }
        }
    }
]
```

Here only requests to `/feedback` with the querystring of `?type=issue` would be redirected.

### Advanced

*redirects.json*
```json
[
    { 
        "src": "/:path((?!uk/).*)",
        "dest": "/uk/:path*",
        "has": {
            "header": {
                "cf-ipcountry": "GB"
            }
        },
        "statusCode": 307
    }
]
```

Translation: Request for `/product/features` from GB (based on `cf-ipcountry` header) will be redirected to `/uk/product/features` with a status code of `307`

## 💻 Development

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn watch` or `npm run watch` to watch for changes.
- run `yarn build` or `npm run build` to produce a compiled version in the `lib` folder.

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

### Credits

The project was inspired by Vercel's `vercel.json` [redirects](https://vercel.com/docs/configuration#project/redirects). I wanted something similar to use for any Express app.

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
