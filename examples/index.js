import redirectMiddleware from '../lib'
import express from 'express'
const app = express()

import redirects from './redirects.json'

app.use(redirectMiddleware(redirects))

const PORT = 3000
app.listen(PORT, () => console.log(PORT))