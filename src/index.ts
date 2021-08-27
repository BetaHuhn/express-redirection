import path from 'path'
import Express from 'express'
import minimatch from 'minimatch'
import cookie from 'cookie'

interface RedirectItem {
	src: string
	dest: string
	statusCode?: number
	method?: string
	protocol?: string
	has?: {
		query?: { [key: string]: string }
		header?: { [key: string]: string }
		cookie?: { [key: string]: string }
		host?: string
		ip?: string
	}
}

type RedirectConfig = RedirectItem[]

const parseConfig = (config: RedirectConfig) => {
	return config.map((item) => {
		const requiredOptions = [ 'src', 'dest' ]
		requiredOptions.forEach((option) => {
			if (!(item as any)[option]) {
				throw new Error(`Missing required option: ${ option }`)
			}
		})

		return {
			src: item.src,
			dest: item.dest,
			statusCode: item.statusCode || 301,
			method: item.method,
			protocol: item.protocol,
			has: item.has
		}
	})
}

const checkValue = (valueToCheck: any, value: string) => {
	if (valueToCheck === undefined) return false
	if (valueToCheck === value) return true
	if (minimatch(valueToCheck, value)) return true

	return false
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const redirectMiddleware = (rawConfig?: RedirectConfig) => {
	if (rawConfig === undefined) {
		const configPath = path.resolve(require.main?.path as string, 'redirects.json')
		rawConfig = require(configPath)
	}

	const config = parseConfig(rawConfig as any)

	return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
		const requestPath = req.baseUrl + req.path
		const match = config.find((item) => item.src === requestPath || minimatch(requestPath, item.src))

		if (!match) return next()

		if (match.method !== undefined) {
			const valid = req.method === match.method
			if (!valid) return next()
		}

		if (match.protocol !== undefined) {
			const valid = req.protocol === match.protocol
			if (!valid) return next()
		}

		const has = match.has
		if (has !== undefined) {
			if (has.ip !== undefined) {
				const valueToCheck = req.ip

				const valid = checkValue(valueToCheck, has.ip)
				if (!valid) return next()
			}

			if (has.host !== undefined) {
				const valueToCheck = req.hostname

				const valid = checkValue(valueToCheck, has.host)
				if (!valid) return next()
			}

			if (has.query !== undefined) {
				for (const [ key, value ] of Object.entries(has.query)) {
					const valueToCheck = req.query[key]

					const valid = checkValue(valueToCheck, value)
					if (!valid) return next()
				}
			}

			if (has.header !== undefined) {
				for (const [ key, value ] of Object.entries(has.header)) {
					const valueToCheck = req.headers[key]

					const valid = checkValue(valueToCheck, value)
					if (!valid) return next()
				}
			}

			if (has.cookie !== undefined) {
				for (const [ key, value ] of Object.entries(has.cookie)) {
					const cookies = cookie.parse(req.headers.cookie || '')
					const valueToCheck = cookies[key as string]

					const valid = checkValue(valueToCheck, value)
					if (!valid) return next()
				}
			}

			return res.redirect(match.statusCode, match.dest)
		}

		res.redirect(match.statusCode, match.dest)
	}
}

export default redirectMiddleware