
const axios = require('axios');
const config = require('./axios-config');
const COMMON = require('../global/constant');
const api = require('./api');
// axios.defaults.timeout = 0;

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// axios.interceptors.request.use(function (config) {
  
//   return config;
    
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }); 
axios.interceptors.response.use((res) => {
  if (typeof res.data == "string") {
    try {
      res.data = JSON.parse(res.data);
    } catch (e) {
      Promise.reject(res.data);
    }
  }
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
  if(process.env.NODE_ENV == "demo"){ // production development
    if(thatServer.staticDataDemo){
      args.url = thatServer.staticDataDemo;
      args.type = 'GET';
    }else{
      hostName  = COMMON.host.demoName;
      if(thatServer.hostNameDemo){
        hostName = thatServer.hostNameDemo;
      }
      if(thatServer.urlDemo){
        thatServerUrl = thatServer.urlDemo;
      }
      if(payload.ctxState.mock){
        args.url = thatServer.mock;
        args.type = 'JSON';
      }else{
        args.url = hostName + thatServerUrl;
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
      args.url = hostName + thatServerUrl;
      args.type = thatServer.type ? thatServer.type : 'GET';
    }
  }
  
  let showUrl = args.url;
  let requestParameter = '';
  for(var i in payload.data){
    requestParameter += '&' +i +'=' + payload.data[i];
  }
  console.log(showUrl+'?'+requestParameter.substr(1))
  if (args.type === 'POST') {
    return axios.post(args.url, payload.data, config).then(res => done(args, payload, res)).catch(err => fail(args, payload, err));
  } else if (args.type === 'GET') {
    return axios.get(args.url, {
      params: payload.data
    }, config).then(res => done(args, payload, res)).catch(err => fail(args, payload, err));
  }else if(args.type === 'JSON'){
    var fs = require('fs');
    var path = require('path');
    // let file = `${process.cwd()}/static/mock/${args.url}`;
    
    let file = `${__dirname}/../static/${args.url}`;
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
function done(args, payload, res){
  if(res.state == "success"){
    return res;
    if(payload.server == "messageListNoRead"){
      return res;
    }else{
      return res.data;
    }
    
  }else if(res.state == "error"){
    let path = '';
    if(args.type == "GET"){
      for(var i in payload.data){
        path += '&' +i +'=' + payload.data[i];
      }
      path = args.url+'?'+path.substr(1)
    }
    err.request = {
      path : path,
      url : args.url,
      type : args.type,
      data : payload.data,
      error : err.msg
    }
    payload.ctxState.fail.push(res);
    return res;
  }
  
}
function fail(args, payload, err){
  if(payload.server == "getappdownloadinfo" || payload.server == "getTeacherLiveCourselist" || payload.server == "applyrestudylist"){
    return err
  }else if(payload.server == "memberGetplan" && err.msg == "没有对应的学习计划"){
    return err
  }else{
    let path = '';
    if(args.type == "GET"){
      for(var i in payload.data){
        path += '&' +i +'=' + payload.data[i];
      }
      path = args.url+'?'+path.substr(1)
    }
    err.request = {
      path : path,
      url : args.url,
      type : args.type,
      data : payload.data,
      error : err.msg
    }
    payload.ctxState.fail.push(err);
    return err;
  }
  
  
}

module.exports = {
  ajax
}