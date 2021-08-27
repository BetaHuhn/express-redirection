<div align="center">
  
# express-redirect-file

[![Node CI](https://github.com/BetaHuhn/express-redirect-file/workflows/Node%20CI/badge.svg)](https://github.com/BetaHuhn/express-redirect-file/actions?query=workflow%3A%22Node+CI%22) [![Release CI](https://github.com/BetaHuhn/express-redirect-file/workflows/Release%20CI/badge.svg)](https://github.com/BetaHuhn/express-redirect-file/actions?query=workflow%3A%22Release+CI%22) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/express-redirect-file/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/express-redirect-file)

Define express redirects with a JSON file similar to vercel.json

</div>

## 📚 Usage

Create a redirect config:

```json
[
    { "src": "/user", "dest": "/api/user" },
    { "src": "/view-source", "dest": "https://github.com/betahuhn/express-redirect-file", "statusCode": 308 },
    {
        "src": "/*",
        "has": {
            "header": {
                "x-country": "GB"
            }
        },
        "dest": "/uk",
        "statusCode": 307
    }
]
```

Use the middleware:

```js
const express = require('express')
const { redirectMiddleware } = require('express-redirect-file')

const app = express()

app.use(redirectMiddleware())
```

## 💻 Development

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn watch` or `npm run watch` to watch for changes.
- run `yarn build` or `npm run build` to produce a compiled version in the `lib` folder.

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
