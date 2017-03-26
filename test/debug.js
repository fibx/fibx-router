var coroutine = require("coroutine");
var http = require('http');
var app = require('@fibjs/fibx')();
var run = require('./server')(app);

coroutine.start(run);
coroutine.sleep(100);

var r = http.request('post', 'http://127.0.0.1:7758/slash/rube/');
console.log(r.read().toString());
