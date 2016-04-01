/**
 * Created by seven on 16/3/18.
 */
var httpProxy = require('http-proxy');
var fs=require('fs');
var isJSON = require('is-json');
var path=require('path');
var url=require('url');
module.exports=function (app,option) {
    var configPath=option&&option.configPath?option.configPath:'/config';
    return function (req,res,next) {
        function getHost(){
            var stat=fs.existsSync('./proxy.json');
            var config=stat?JSON.parse(fs.readFileSync('./proxy.json')):'';
            return config;
        }

        var host=getHost();
        var nowHost=host?'http://'+host.host+':'+host.port:'';
        function getMock() {
            var stat=fs.existsSync('./mock.json');
            var mock=stat?JSON.parse(fs.readFileSync('./mock.json')):[];
            return mock;
        }
        function setMock(data) {
            fs.writeFileSync('./mock.json',JSON.stringify(data));
        }

        var proxy = httpProxy.createProxyServer({});

        app.get("/change/host*",function (req,res) {
            console.log('change host success');
            nowHost='http://'+req.query.host+':'+req.query.port;
            fs.writeFileSync('./proxy.json',JSON.stringify(req.query));
            res.send(req.query);
        });

        app.get("/get/host",function (req,res) {
            res.send(getHost());
        });

        app.get('/get/mock',function (req,res) {
            res.send(getMock());
        });

        app.get('/set/mock',function(req,res){
            console.log(req.query.data);
            setMock(JSON.parse(req.query.data));
            res.send(JSON.parse(req.query.data));
        });

        app.get(configPath, function(req, res) {
            res.sendFile(__dirname + '/config.html')
        });
        app.get('/page/entry',function (req,res) {
            if(option.pageEntry){
                res.send(option.pageEntry)
            }else{
                res.send(null);
            }
        })
        app.get('/__mock_proxy_assets__*',function (req,res) {   
            res.sendFile(__dirname+req.url);
        })
        var apiRule=option.apiRule?option.apiRule:'/*';
        app.all(apiRule,function (req,res,next) {
            if(nowHost!='http://0:0'){
                next();
                return false;
            }
            var pathname=url.parse(req.url).pathname;
            var mock=getMock().reduce(function (reduce,data) {
                var message=data.message.replace(/\n/g,'');
                if(isJSON(message)){
                    reduce[url.parse(data.url).pathname]=JSON.parse(message);
                }else{
                    reduce[url.parse(data.url).pathname]=message;
                }
                return reduce;
            },{});
            console.log(mock);
            if(mock[pathname]){
                var mes=mock[pathname];
            }else{
                var mes={info:'这个接口没有定意'};
            }
            res.send(mes);
        });
        app.all(apiRule,function (req,res,next) {
            proxy.web(req, res, { target:nowHost });
        })
        next();
        return this;
    }
}