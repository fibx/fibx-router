'use strict';

var re = require('re');
var util = require('util');

var error = require('./lib/error');
var connect = require('./lib/connect');
/**
 * @param option Object
 * - simulation: boolean    whether support put and delete simulation
 * - size: number           to save path cache size
 * - base: string           base path
 * - fixSlash: boolean      if true the request 127.0.0.1/hello/ will be ok
 * @constructor
 */
function Router(option) {

    this._option = option;
    this._cache = option && option.size ? new util.LruCache(option.size) : new util.LruCache(100);
    this._base = option && option.base ? option.base : '';
    this._pathParams = {};
    this._map = {
        get: {},
        post: {},
        delete: {},
        put: {},
        all: {}
    }
}

Router.prototype = {
    getAllRoute: function() {

        var that = this;

        return function(next) {

            var method = this.method.toLowerCase();
            //var methodSim = this.query._method || this.form._method;
            var methodSim = this.form._method;
            var path = this.path, regexPath;

            var l = path.length - 1;
            if (that._option
                && that._option.fixSlash
                && path.lastIndexOf('/') == l) {
                path = path.substr(0, l);
            }

            method = filterMethod.call(that, method, methodSim);
            regexPath = findPath.call(that, method, path);
            extractParams.call(this, that, regexPath, path);
            exec.call(this, that, method, regexPath);

            next && next();
        }
    }
};

var methodList = ['get', 'post', 'put', 'delete'];

methodList.concat(['all']).forEach(function(m) {

    Router.prototype[m] = function() {

        var argv = Array.prototype.slice.call(arguments);
        var regex = routeRegex.call(this, argv.shift());
        this._map[m][regex] = argv;
    }
});

module.exports = function(option) {
    return new Router(option);
};

function extractParams(that, regexPath, requestPath) {

    var _params = that._pathParams[regexPath];
    if (!_params || _params.length === 0) {
        return;
    }

    this.params = this.params || {};
    var regex = re.compile('^' + that._base + regexPath + '$'),
        params = regex.exec(requestPath),
        _this = this;

    params.shift();
    params.forEach(function(p, idx) {
        _this.params[_params[idx]] = p;
    });
}

function exec(that, method, regexPath) {

    var executive = that._map[method][regexPath];
    if (that._map['all'][regexPath]) {
        executive = that._map['all'][regexPath].concat(executive);
    }
    connect.call(this, executive).call(this);
}

function filterMethod(method, methodSim) {

    if (!!!method) {
        throw error.P('not found method');
    }

    if (methodList.indexOf(method) != -1 && !!!methodSim) {
        return method;
    } else if (method === 'post' && (this._option && this._option.simulation)
        && (methodSim === 'put' || methodSim === 'delete')) {
        return methodSim;
    } else {
        throw error.P('not found method');
    }
}

function findPath(method, path) {

    var cacheResult = this._cache.get(path);
    if (cacheResult && cacheResult.m === method) {
        return cacheResult.p;
    } else {
        for (var _regex in this._map[method]) {
            var regex = new RegExp('^' + this._base + _regex + '$');                     //TODO: better
            if (regex.test(path)) {
                this._cache.set(path, {
                    m: method,
                    p: _regex
                });
                return _regex;
            }
        }
    }
    throw error.P('not found path');
}

function routeRegex(regex) {

    if (regex.indexOf('^') === 0) {
        regex = regex.substr(1);
    }
    if (regex.indexOf('$') === regex.length - 1) {
        regex = regex.substr(0, regex.length - 1);
    }

    var paramsRegex = /:[0-9a-zA-Z]+/g;
    var p;
    var params = [];
    while (p = paramsRegex.exec(regex)) {
        params.push(p[0].substr(1));
    }
    regex = regex.replace(/:[0-9a-zA-Z]+/g, '([^\/]+)');
    this._pathParams[regex] = params;

    return regex;
}
