# Route

## 创建路由				

### route的创建					

```javascript

var app = require('fibjs-fibx')();
var route = require('fibjs-fibx-router')();

app.use('/', route.getAllRoute());

```

### Route([,option])						

```javascript

var option = {
    size: Number,            //请求路径缓存的大小,默认100
    fixSlash: Boolean,       //是否忽略路径后的斜杠  eg. hirube.com/fibjs/,默认false
    simulation: Boolean,     //是否支持模拟 put, delete 请求,默认false         
    base: String             //路由的基础路径
}

var app = require('fibjs-fibx')();
var route = require('fibjs-fibx-router')(option);

app.use('/', route.getAllRoute());

```       

* size: 为了对提升性能,对请求的路径做了缓存,下一次相同的请求路径就不用重复分析,size 就是此缓存的大小       
* fixSlash: 对于 url 后的反斜杠的处理, 默认是 false,不开启处理的         
* simulation: 开启的话,可以在表单中添加 _method 来模拟 put 和 delete	请求					
* base: 基础的路由, 比如设置 base 为 '/hello' , 那么 Route.get('/rube') 就是 /hello/rube       

### Route.all(route, handler)					

all 提供各个路由的统一执行体, 不提供路由能力, 就是不管是 get, 还是 post 都会先去执行这个一次才去执行相应的 route 路由     

### Route.get(route, handler...)

接受 get 请求并处理

### Route.post(route, handler...)

接受 post 请求并处理

### Route.put(route, handler...)

接受 put 请求并处理	  	

### Route.delete(route, handler...)

接受 delete 请求并处理    

### Route支持多个hander处理,同时支持 next 传值和返回值,这个和 fibx 的 next 相同				

```javascript

var app = require('fibjs-fibx')();
var route = require('fibjs-fibx-router')();

route.get('/hirube', function(next){
    this.body = next(1);															//页面输出2
}, function(value){
    return value+1;
});

app.use('/', route.getAllRoute());


```

### Route 支持参数捕获      

```javascript

route.get('/login/:userID', function(){
    this.body = this.params.userID;
});

```

### Route 支持复杂正则

```javascript

route.get('/login/:userID/[a-z]+/:type', function(){
    this.body = this.params.userID + this.params.type;
})
```
