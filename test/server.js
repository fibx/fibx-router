module.exports = function(app) {
    return function() {
        run(app);
    }
};

function run(app) {

    /** slash **/
    var routerSlash = require('../index')({
        fixSlash: true
    });
    routerSlash.post('/slash/method', function() {
        this.body = 'slash ok';
    });
    routerSlash.post('/slash/:method', function() {
        this.body = 'slash ok--' + this.params.method;
    });
    app.use('/slash(/.*)', routerSlash.getAllRoute());

    /** sim **/
    var routerSim = require('../index')({
        simulation: true
    });
    routerSim.put('/sim/method', function() {
        this.body = 'put';
    });
    routerSim.delete('/sim/method', function() {
        this.body = 'delete';
    });
    app.use('/sim(/.*)', routerSim.getAllRoute());

    /** base **/
    var routerBase = require('../index')({
        base: '/base'
    });
    routerBase.post('/papapa', function() {
        this.body = this.query.h;
    });
    routerBase.post('/gogo/:hello', function() {
        this.body = this.params.hello;
    });
    app.use('/base(/.*)', routerBase.getAllRoute());

    /** all **/
    var router = require('../index')();
    router.all('/aa', function(next) {
        this.state = {};
        this.state.number = 1;
        next();
    });
    router.get('/aa', function() {
        this.state.number++;
        this.body = 'all' + 2;
    });

    /** put, get, post, delete **/
    router.get('/method', function() {
        this.body = 'get';
    });
    router.post('/method', function() {
        this.body = 'post';
    });
    router.put('/method', function() {
        this.body = 'put';
    });
    router.delete('/method', function() {
        this.body = 'delete';
    });

    /** executive body **/
    router.get('/exec/two', function(next) {
        next(this.query.h);
    }, function(hello) {
        this.body = hello + ' exec two';
    });

    router.get('/exec/more', function(next) {
        next(1);
    }, function(n, next) {
        next(n + 1);
    }, function(n, next) {
        next(n + 1);
    }, function(n, next) {
        next(n + 1);
    }, function(n, next) {
        next(n + 1);
    }, function(n) {
        this.body = this.query.h + ' exec more' + n;
    });

    /** params **/
    router.post('/params/:hello', function() {
        this.body = this.params.hello;
    });

    router.post('/params/:hello/gg/:good', function() {
        this.body = this.params.hello + '--' + this.params.good;
    });

    router.post('/params/login/:userID/check', function() {
        this.body = this.params.userID + '--' + this.query.name;
    });

    /** multi route **/
    router.post('/login/:userID', function(next) {
        next(this.params.userID + '--rubedong');
    }, function(params) {
        this.body = params;
    });
    router.post('/sign/[1-9]+', function() {
        this.body = 'regex1 ok';
    });
    router.post('/sign/:hello/[1-9]+/:good', function() {
        this.body = 'regex2 ok--' + this.params.hello + '--' + this.params.good;
    });
    router.get('/sign/[a-z]+/hello/:hello', function() {
        this.body = 'regex3 ok--' + this.params.hello;
    });
    router.get('/sign/[a-z]+/:hello/[0-9]+/check', function() {
        this.body = 'regex4 ok--' + this.params.hello;
    });

    app.use('/', router.getAllRoute());

    app.listen(7758);
}