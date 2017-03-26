var app = require('@fibjs/fibx')();
var route = require('../index')({
    fixSlash: true,
    simulation: true,
    size: 200
});

/** all 提供各个路由的统一执行体, 不提供路由能力 **/
route.all('/rube', function(next) {
    next('rube-dong');
});

route.get('/rube', function(p){
    this.body = p;
});

route.post('/rube', function(p){
    this.body = p;
});

route.get('/hello', function() {
    this.body = 'hello world';
});

route.get('/show/:name', function() {
    this.body = 'hello world ---' + this.params.name;
});

route.post('/show/:name', function() {
    this.body = 'hello world ---' + this.params.name;
});

app.use(function(next) {
    try {
        next();
    } catch (e) {
        this.body = 'error';
    }
});

app.use('/', route.getAllRoute());

console.log('you can open browser, input 127.0.0.1:7759/hello    and more~');

app.listen(7759);
