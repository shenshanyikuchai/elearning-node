

const axios = require('axios');
const qs = require('qs');
const config = require('./axios-config');
const COMMON = require('../global/constant')
const api = require('./api.js')
// axios.defaults.timeout = 0;

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// axios.interceptors.request.use(function (config) {
  
//   return config;
    
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });
axios.interceptors.response.use((res) => {
  if (res && res.data.state == 'success') {
    return Promise.resolve(res.data);
  } else {
    return Promise.reject(res.data);
  }
}, (error) => {
  return Promise.reject(error);
});

function ajax(payload){
  var args = {};
  var thatServer = api[payload.server];
  var hostName = '';
  var thatServerUrl = thatServer.url;
  // console.log(process.env.NODE_ENV)
  if(process.env.NODE_ENV == "demo"){ // production development
    console.log(thatServer)
    if(thatServer.staticDataDemo){
      args.url = thatServer.staticDataDemo  + "?verTT=" + new Date().getTime();
      args.type = 'GET';
    }else{
      hostName  = COMMON.host.demoName;
      if(thatServer.hostName){
        hostName = thatServer.hostName;
      }
      if(thatServer.urlDemo){
        thatServerUrl = thatServer.urlDemo;
      }
      if(payload.ctxState.mock){
        args.url = thatServer.mock;
        args.type = 'JSON';
      }else{
        args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
        args.type = thatServer.type ? thatServer.type : 'GET';
      }
    }
  }else{
    hostName = COMMON.host.name;
    if(thatServer.hostName){
      hostName = thatServer.hostName;
    }
    if(payload.ctxState.mock){
      args.url = thatServer.mock;
      args.type = 'JSON';
    }else{
      args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
      args.type = thatServer.type ? thatServer.type : 'GET';
    }
  }
  if (args.type === 'POST') {
    return axios.post(args.url, payload.data, config).then(res => done(res)).catch(err => fail(payload, err))
  } else if (args.type === 'GET') {
    // console.log(args.url+JSON.stringify(payload.data))
    return axios.get(args.url, {
      params: payload.data
    }, config).then(res => done(payload, res)).catch(err => fail(payload, err))
  }else if(args.type === 'JSON'){
    var fs = require('fs');
    var path = require('path');
    var file = path.resolve(__dirname, '../'+args.url);
    
    return new Promise(function(resolve, reject){
      fs.readFile(file, "utf8", function(err, data){
        if(err){
          reject(err);
        }else{
          resolve(JSON.parse(data));
        }
      })
    });
  }

  
}
function done(payload, res){
  if(res.state == "success"){
    return res;
    if(payload.server == "messageListNoRead"){
      return res;
    }else{
      return res.data;
    }
    
  }else if(res.state == "error"){
    payload.ctxState.fail.push(res);
    return res;
  }
  
}
function fail(payload, err){
  payload.ctxState.fail.push(err);
  return err
}

module.exports = {
  ajax
}