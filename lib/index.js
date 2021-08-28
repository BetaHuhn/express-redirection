"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var minimatch_1 = __importDefault(require("minimatch"));
var cookie_1 = __importDefault(require("cookie"));
var path_to_regexp_1 = require("path-to-regexp");
var parseConfig = function (config) {
    return config.map(function (item) {
        var requiredOptions = ['src', 'dest'];
        requiredOptions.forEach(function (option) {
            if (!item[option]) {
                throw new Error("Missing required option: " + option);
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
var checkValue = function (valueToCheck, value) {
    if (valueToCheck === undefined)
        return false;
    if (valueToCheck === value)
        return true;
    if (minimatch_1.default(valueToCheck, value))
        return true;
    return false;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var foundRedirectMiddleware = function (rawConfig) {
    var _a;
    if (rawConfig === undefined) {
        var configPath = path_1.default.resolve((_a = require.main) === null || _a === void 0 ? void 0 : _a.path, 'redirects.json');
        rawConfig = require(configPath);
    }
    var config = parseConfig(rawConfig);
    return function (req, res, next) {
        var requestPath = req.baseUrl + req.path;
        var foundRedirect = config.find(function (item) {
            var runMatch = path_to_regexp_1.match(item.src, { decode: decodeURIComponent });
            var matched = runMatch(requestPath);
            return matched !== false;
        });
        if (!foundRedirect)
            return next();
        if (foundRedirect.method !== undefined) {
            var valid = req.method === foundRedirect.method;
            if (!valid)
                return next();
        }
        if (foundRedirect.protocol !== undefined) {
            var valid = req.protocol === foundRedirect.protocol;
            if (!valid)
                return next();
        }
        var has = foundRedirect.has;
        if (has !== undefined) {
            if (has.ip !== undefined) {
                var valueToCheck = req.ip;
                var valid = checkValue(valueToCheck, has.ip);
                if (!valid)
                    return next();
            }
            if (has.host !== undefined) {
                var valueToCheck = req.hostname;
                var valid = checkValue(valueToCheck, has.host);
                if (!valid)
                    return next();
            }
            if (has.query !== undefined) {
                for (var _i = 0, _a = Object.entries(has.query); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    var valueToCheck = req.query[key];
                    var valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
            if (has.header !== undefined) {
                for (var _c = 0, _d = Object.entries(has.header); _c < _d.length; _c++) {
                    var _e = _d[_c], key = _e[0], value = _e[1];
                    var valueToCheck = req.headers[key];
                    var valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
            if (has.cookie !== undefined) {
                for (var _f = 0, _g = Object.entries(has.cookie); _f < _g.length; _f++) {
                    var _h = _g[_f], key = _h[0], value = _h[1];
                    var cookies = cookie_1.default.parse(req.headers.cookie || '');
                    var valueToCheck = cookies[key];
                    var valid = checkValue(valueToCheck, value);
                    if (!valid)
                        return next();
                }
            }
        }
        var runMatch = path_to_regexp_1.match(foundRedirect.src, { decode: decodeURIComponent });
        var matched = runMatch(requestPath);
        if (foundRedirect.dest.startsWith('https://')) {
            var _j = new URL(foundRedirect.dest), origin_1 = _j.origin, pathname = _j.pathname;
            var toPath_1 = path_to_regexp_1.compile(pathname, { encode: encodeURIComponent });
            var result_1 = "" + origin_1 + toPath_1(matched.params);
            return res.redirect(foundRedirect.statusCode, decodeURIComponent(result_1));
        }
        var toPath = path_to_regexp_1.compile(foundRedirect.dest, { encode: encodeURIComponent });
        var result = toPath(matched.params);
        return res.redirect(foundRedirect.statusCode, decodeURIComponent(result));
    };
};
exports.default = foundRedirectMiddleware;
module.exports = foundRedirectMiddleware;
