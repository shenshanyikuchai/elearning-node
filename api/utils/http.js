var http = require('http');
var options = {
    hostname:'demo.caicui.com',
    path:'/api/zbids/member/login/v1.0?account=zpk&password=123456&token=9197bc18-bf12-485d-a6a4-4572c5e1de2c',
    method:'post'
};
var req = http.request(options,function(respones){
    var str = '';
    respones.on('data',function(chunk){
      str += chunk;
    });
    respones.on('end',function(){
      console.log(str);
    });
});
req.end();
