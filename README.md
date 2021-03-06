# express-proxy-mock

# 使用背景
  在前端开发中有一项很重要的工作是后台同事进行数据联调，联调你就要通过对应不同的同事ip进行通讯，这个时候你会遇到浏览器的同源策略引起的跨域问题，还有你可能想有没有快速切换不同的ip进行联调，不用每次修改配制重起不同的服务，在后台接口还没开发完时，能在本地快速的创建假如据，而且接口与后台完全一制而不用在真正联调时还需要修改url，造成没必要的bug，以上这些问题就是我想开发这个express插件的初衷！
# 五行代码启动带 props,mock功能的 node 服务！
```
 npm install express
 npm install express-proxy-mock
```
  先在项目中运行以上两行命令；
  然后在你的项目建个‘server.js’的文件；
```
  var http=require('http');
  var proxyMock＝require('express-proxy-mock');
  var app=require('express')();
  proxyMock(app)
  http.createServer(app).listen(3000,'localhost');
```
最后运行 node server.js  在浏览器打开localhost:3000/config 就能看到props和mock功能界面！
![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info.png)

# props功能
  代理是用来解决浏器同源策略引起的跨域问题（这要保证你上线时与后同是在同一域），当然还有很多其它的解决方案比如直接关掉浏览器的同源策略就可以与后台联调，但这们做会引发很多问题，可能某些上线后真的会夸域的也会跳过，而且要在url上面绑定对应的ip，与线上的代码有些不同会造成没必要的bug；
  当然还可以通过nginx之类的来进行数据转发，但每次切换联调的ip都要修改配制文件的ip重起服务，假如切换切换频繁一个的确让人很烦的事，也不利于与 webpack一起使用，我们都知在webpack开发时都会通过node起动一个服务，那我们应该直接一个插件就把这些功能集成上去，而不用其它多余的工具辅助！
![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info1.png)

# mock功能
  在后台api还没开发完成前，我们经常要一些假数据进行调试，这就是mock的用途，这个插件构建的mock可以让快速可视化的编辑创建，并让api的url保持与线上完全一致！
![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info2.png)
![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info3.png)

# 部分mock功能
  很多时候我们与别人联调时，可能只是其中某个接口要联调，其它的接口可能会有不通的情况，这个时候部分mock是很好用的功能，我们只需代理转发要联调的接口其它用假数据，这也是其它mock工具比较难实现的功能之一
  ![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info4.png)

# 与webpack的结合
我们给redux官方的[todo](https://github.com/reactjs/redux/tree/master/examples/todos)的例子加上这个功能,
我们只需要在它的[server.js](https://github.com/reactjs/redux/blob/master/examples/todos/server.js)文件加上两行代码就可以了
```
var compiler = webpack(config)
//以下两行为添加的代码
var proxyMock＝require('express-proxy-mock');
proxyMock(app)
//end
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
```
最后运行localhost:3000/config你就能看到proxy,与mock 操作界面！

# 与vue-cli的结合(vue-cli 2.9.0 之前的版本)
在通过vue-cli构建出来的项目,我们只需要在build/dev-server.js上修改两行代码就能实现这个功能，如图添加前面两行代码，注释掉后面那行代码

![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info5.png)


最后运行npm run dev , 打开localhost:8080/config(8080为你项目配的port)你就能看到proxy,与mock 操作界面！

# webpack-dev-server的结合(vue-cli 2.9.0 之后的版本,开始使用webpack-dev-server)
在 webpack-dev-server的配制参数增加after的回调处理，代码如下（vue-cli 在webpack.dev.conf中devServer下添加after）

![image](https://raw.githubusercontent.com/shunseven/express-proxy-mock/master/images/info6.png)

最后运行npm run dev , 打开localhost:8080/setting(8080为你项目配的port)你就能看到proxy,与mock 操作界面！(由于config会与文件目录冲突，故这里配制成setting)

