# fibx-router

## Installation

```javascript    
npm install @fibjs/fibx-router		
```

## Test				

```javascript
npm install --save-dev
npm test
```

## Example

```javascript
var app = require('fibjs-fibx')();
var route = require('fibjs-fibx-router')({
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
```

## Api

[API Doc](https://github.com/fibx/fibx-router/blob/master/doc/api.md)

## Other

如果你想写一个 fibjs 模块上传到 npm,必须像本项目在目录下放如 fibjs-install.js 的文件.							

```javascript			 
var fs = require('fs');
var os = require('os');
var process = require('process');

var modulesPath = '../../.modules';
var moduleName = JSON.parse(fs.readFile('package.json').toString()).name;

var isExists = fs.exists(modulesPath);
!isExists && fs.mkdir(modulesPath);

switch (os.type) {
    case 'Darwin':
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
        break;
    default :
        process.exec('ln -s ../node_modules/' + moduleName + ' ' + modulesPath + '/' + moduleName);
}
```

然后在 package.json 中添加     

```json					
"scripts": {
    "install": "fibjs fibjs-install.js",
 }
```   

## Next

* 对 route 使用 () 捕获参数的支持
