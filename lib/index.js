"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectMiddleware = void 0;
const path_1 = __importDefault(require("path"));
const minimatch_1 = __importDefault(require("minimatch"));
const cookie_1 = __importDefault(require("cookie"));
const parseConfig = (config) => {
    return config.map((item) => {
        const requiredOptions = ['src', 'dest'];
        requiredOptions.forEach((option) => {
            if (!item[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });
        return {
            src: item.src,
            dest: item.dest,
            statusCode: item.statusCode || 301,
            method: item.method,
            protocol: item.protocol,
            has: item.has
        };
    });
};
const checkValue = (valueToCheck, value) => {
    if (valueToCheck === undefined)
        return false;
    if (valueToCheck === value)
        return true;
    if (minimatch_1.default(valueToCheck, value))
        return true;
    return false;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const redirectMiddleware = (rawConfig) => {
    var _a;
    if (rawConfig === undefined) {
        const configPath = path_1.default.resolve((_a = require.main) === null || _a === void 0 ? void 0 : _a.path, 'redirects.json');
        rawConfig = require(configPath);
    }
    const config = parseConfig(rawConfig);
    return (req, res, next) => {
        const requestPath = req.baseUrl + req.path;
        const match = config.find((item) => item.src === requestPath || minimatch_1.default(requestPath, item.src));
        if (!match)
            return next();
        if (match.method !== undefined) {
            const valid = req.method === match.method;
            if (!valid)
                return next();
        }
        if (match.protocol !== undefined) {
            const valid = req.protocol === match.protocol;
            if (!valid)
                return next();
        }
        const has = match.has;
        if (has !== undefined) {
            if (has.ip !== undefined) {
                const valueToCheck = req.ip;
                const valid = checkValue(valueToCheck, has.ip);
                if (!valid)
                    return next();
            }
            if (has.host !== undefined) {
                const valueToCheck = req.hostname;
                const valid = checkValue(valueToCheck, has.host);
                if (!valid)
                    return next();
            }
            if (has.query !== undefined) {
                for (const [key, value] of Object.entries(has.query)) {
                    const valueToCheck = req.query[key];
                    const valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
            if (has.header !== undefined) {
                for (const [key, value] of Object.entries(has.header)) {
                    const valueToCheck = req.headers[key];
                    const valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
            if (has.cookie !== undefined) {
                for (const [key, value] of Object.entries(has.cookie)) {
                    const cookies = cookie_1.default.parse(req.headers.cookie || '');
                    const valueToCheck = cookies[key];
                    const valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
            return res.redirect(match.statusCode, match.dest);
        }
        res.redirect(match.statusCode, match.dest);
    };
};
exports.redirectMiddleware = redirectMiddleware;
exports.default = exports.redirectMiddleware;
