/**
 * @author Rube
 * @date 15/12/16
 */

'use strict';
var connect = function(middlewares) {

    var that = this;
    var length = middlewares.length;
    if (!length) {
        return;
    }

    var mws = [];
    for (var i = length - 1; i >= 0; i--) {
        mws[i] = function(i) {
            var idx = i;
            return function() {
                var argv = Array.prototype.slice.call(arguments);
                idx < length - 1 && argv.push(mws[idx + 1]);
                middlewares[idx].apply(that, argv);
            };
        }(i);
    }
    return function() {
        mws[0].call(this);
    }
};

module.exports = connect;