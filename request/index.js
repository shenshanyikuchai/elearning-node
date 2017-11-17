

const axios = require('axios');
const qs = require('qs');
// const config = require('./axios-config');
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
function ajax(servername,payload){
  var args = {};
  var thatServer = api[servername];
  var hostName = '';
  var thatServerUrl = thatServer.url;
  if(process.env.NODE_ENV == "development"){ // production development
    if(thatServer.staticDataDemo){
      args.url = thatServer.staticDataDemo  + "?verTT=" + new Date().getTime();
      args.type = 'GET';
    }else{
      hostName  = COMMON.host.demoName;
      if(thatServer.hostNameDemo){
        hostName = thatServer.hostNameDemo;
      }
      if(thatServer.urlDemo){
        thatServerUrl = thatServer.urlDemo;
      }
      if(thatServer.mock){
        args.url = thatServer.mock;
        args.type = 'GET';
      }else{
        args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
        args.type = thatServer.type ? thatServer.type : 'GET';
      }
    }
  }else if(process.env.NODE_ENV  === "production"){
    hostName = COMMON.host.name;
    if(thatServer.hostName){
      hostName = thatServer.hostName;
    }
    if(thatServer.mock){
      args.url = thatServer.mock;
      args.type = 'GET';
    }else{
      args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
      args.type = thatServer.type ? thatServer.type : 'GET';
    }
  }else{
    hostName = COMMON.demo ? COMMON.host.demoName : COMMON.host.name;
    args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
    args.type = thatServer.type ? thatServer.type : 'GET';
  }
  let localData = '';
  try{
    localData = localStorage.getItem('elearning/'+servername);
  }catch(err){
    localData = '';
  }
  if(localData){
    return Vue.localForage.getItem(servername);
  }else{
    if (args.type === 'POST') {
      return axios.post(args.url, qs.stringify(payload)).then(res => done(servername,res)).catch(err => err)
    } else if (args.type === 'GET') {
      return axios.get(args.url, {
        params: payload
      }).then(res => done(servername,res)).catch(err => fail(err))
    }
  }
}
function done(servername,res){
  return res
}
function fail(err){
  return err
}

module.exports = {
  ajax
}