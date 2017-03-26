var test = require('test');
test.setup();

var coroutine = require("coroutine");
var http = require('http');
var app = require('@fibjs/fibx')();
var run = require('./server')(app);
var isDebug = false;

app.use(function(next) {
    try {
        next();
    } catch (e) {
        if (isDebug){
            throw e;
        }
        this.body = 'error';
    }
});

coroutine.start(run);
coroutine.sleep(100);

describe('----------------------------fibx-router--------------------------\r\n', function() {

    describe('Method support', function() {
        it('get', function() {
            var r = http.request('get', 'http://127.0.0.1:7758/method');
            assert.equal(r.read().toString(), 'get');
        });

        it('post', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/method');
            assert.equal(r.read().toString(), 'post');
        });

        it('delete', function() {
            var r = http.request('delete', 'http://127.0.0.1:7758/method');
            assert.equal(r.read().toString(), 'delete');
        });

        it('put', function() {
            var r = http.request('put', 'http://127.0.0.1:7758/method');
            assert.equal(r.read().toString(), 'put');
        });

        it('all', function() {
            var r = http.request('get', 'http://127.0.0.1:7758/aa');
            assert.equal(r.read().toString(), 'all2');
        });

        it('error method', function() {
            var r = http.request('rube', 'http://127.0.0.1:7758/aa');
            assert.equal(r.read().toString(), 'error');
        });

        it('put simulation', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/sim/method', "_method=put", {"Content-type": "application/x-www-form-urlencoded"});
            assert.equal(r.read().toString(), 'put');
        });

        it('delete simulation', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/sim/method', "_method=delete", {"Content-type": "application/x-www-form-urlencoded"});
            assert.equal(r.read().toString(), 'delete');
        });
    });

    describe('Router parse', function() {

        it('route base option', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/base/papapa?h=hello_base');
            assert.equal(r.read().toString(), 'hello_base');
        });

        it('route fixSlash option', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/slash/method/');
            assert.equal(r.read().toString(), 'slash ok');

            var r = http.request('post', 'http://127.0.0.1:7758/method/');
            assert.equal(r.read().toString(), 'error');

            var r = http.request('post', 'http://127.0.0.1:7758/slash/rube/');
            assert.equal(r.read().toString(), 'slash ok--rube');
        });

        it('error route', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/base/papapsda?h=hello_base');
            assert.equal(r.read().toString(), 'error');

            var r = http.request('get', 'http://127.0.0.1:7758/metho');
            assert.equal(r.read().toString(), 'error');
        });

        it('route params', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/params/rube');
            assert.equal(r.read().toString(), 'rube');

            var r = http.request('post', 'http://127.0.0.1:7758/params/rube/gg/dong');
            assert.equal(r.read().toString(), 'rube--dong');

            var r = http.request('post', 'http://127.0.0.1:7758/params/login/100888/check?name=dong');
            assert.equal(r.read().toString(), '100888--dong');

            var r = http.request('post', 'http://127.0.0.1:7758/params/login/gg/check?name=dong');
            assert.equal(r.read().toString(), 'login--check');
        });

        it('route params have base', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/base/gogo/rube');
            assert.equal(r.read().toString(), 'rube');
        });

        it('multi route', function() {
            var r = http.request('post', 'http://127.0.0.1:7758/login/rubedong110');
            assert.equal(r.read().toString(), 'rubedong110--rubedong');

            var r = http.request('post', 'http://127.0.0.1:7758/sign/1688');
            assert.equal(r.read().toString(), 'regex1 ok');

            var r = http.request('post', 'http://127.0.0.1:7758/sign/rube/1688/dong');
            assert.equal(r.read().toString(), 'regex2 ok--rube--dong');

            var r = http.request('get', 'http://127.0.0.1:7758/sign/rube/hello/dong');
            assert.equal(r.read().toString(), 'regex3 ok--dong');

            var r = http.request('get', 'http://127.0.0.1:7758/sign/rube/dong/110/check');
            assert.equal(r.read().toString(), 'regex4 ok--dong');

            var r = http.request('post', 'http://127.0.0.1:7758/sign/f-u-c-k');
            assert.equal(r.read().toString(), 'error');
        });
    });

    describe('Multi executive body', function() {

        it('two executive body', function() {
            var r = http.request('get', 'http://127.0.0.1:7758/exec/two?h=hello');
            assert.equal(r.read().toString(), 'hello exec two');
        });

        it('more executive body', function() {
            var r = http.request('get', 'http://127.0.0.1:7758/exec/more?h=hello');
            assert.equal(r.read().toString(), 'hello exec more' + 5);
        });

        it('next can return value', function(){
            var r = http.request('get', 'http://127.0.0.1:7758/exec/next');
            assert.equal(r.read().toString(), 'next successful!');
        });

        it('executive body feature ok', function() {
            var r = http.request('get', 'http://127.0.0.1:7758/aa');
            assert.equal(r.read().toString(), 'all2');
        });
    });
});

test.run();
