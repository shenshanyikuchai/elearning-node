<<<<<<< HEAD
const axios = require('axios');
const config = require('./axios-config');
const COMMON = require('../global/constant');
const api = require('./api');

=======

const axios = require('axios');
const config = require('./axios-config');
const COMMON = require('../global/constant');
const api = require('./api.js');
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
// axios.defaults.timeout = 0;

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// axios.defaults.maxContentLength = 800000;


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
<<<<<<< HEAD
      // Promise.reject(res.data);
      res.data ={
        isMock : true,
        state : "success"
      };
=======
      Promise.reject(res.data);
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
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

function ajax(payload) {
  var args = {};
  var thatServer = api[payload.server];
  var hostName = '';
  var thatServerUrl = thatServer.url;
<<<<<<< HEAD
  if(!payload.url){
    if (process.env.NODE_ENV == "dev") {
      if (thatServer.staticDataDemo) {
        args.url = thatServer.staticDataDemo;
        args.type = 'GET';
      } else {
        hostName = COMMON.host.apiDev;
        if (thatServer.action) {
          hostName = COMMON.host.actionDev;
        }
        // if(thatServer.urlDemo){
        //   thatServerUrl = thatServer.urlDemo;
        // }
        if (payload.ctxState && payload.ctxState.mock) {
          args.url = thatServer.mock;
          args.type = 'JSON';
        } else {
          args.url = hostName + thatServerUrl;
          args.type = thatServer.type ? thatServer.type : 'GET';
        }
=======
  if(process.env.NODE_ENV == "demo"){ // production development
    if(thatServer.staticDataDemo){
      args.url = thatServer.staticDataDemo  + "?verTT=" + new Date().getTime();
      args.type = 'GET';
    }else{
      hostName  = COMMON.host.demoName;
      if(thatServer.hostName){
        hostName = thatServer.hostName;
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
      }
    } else if (process.env.NODE_ENV == "demo") { // production development
      if (thatServer.staticDataDemo) {
        args.url = thatServer.staticDataDemo;
        args.type = 'GET';
      } else {
        hostName = COMMON.host.apiDemo;
        if (thatServer.action) {
          hostName = COMMON.host.actionDemo;
        }
        // if(thatServer.urlDemo){
        //   thatServerUrl = thatServer.urlDemo;
        // }
        if (payload.ctxState && payload.ctxState.mock) {
          args.url = thatServer.mock;
          args.type = 'JSON';
        } else {
          args.url = hostName + thatServerUrl;
          args.type = thatServer.type ? thatServer.type : 'GET';
        }
      }
    } else {

      hostName = COMMON.host.api;
      if (thatServer.action) {
        hostName = COMMON.host.action;
      }
      if (payload.ctxState && payload.ctxState.mock) {
        args.url = payload.mock ? payload.mock : thatServer.mock;
        args.type = 'JSON';
      } else {
        args.url = hostName + thatServerUrl;
        args.type = thatServer.type ? thatServer.type : 'GET';
      }
    }
  }else{

    args.url = payload.url;
    args.type = thatServer.type ? thatServer.type : 'GET';
  }

  let showUrl = args.url;
  let requestParameter = '';
  if(args.type == "POST"){
    console.log(showUrl)
    console.log(payload.data)
  }else{
    for (var i in payload.data) {
      requestParameter += '&' + i + '=' + payload.data[i];
    }
    console.log(showUrl + '?' + requestParameter.substr(1))
  }
<<<<<<< HEAD
  
  if (args.type === 'POST') {
    return axios.post(args.url, payload.data, config).then(res => done(args, payload, res)).catch(err => fail(args, payload, err));
  } else if (args.type === 'GET') {
    return axios.get(args.url, {
      params: payload.data
    }, config).then(res => done(args, payload, res)).catch(err => fail(args, payload, err));
  } else if (args.type === 'JSON') {
    var fs = require('fs');
    var path = require('path');
    // let file = `${process.cwd()}/static/mock/${args.url}`;

    let file = `${__dirname}/../static/${args.url}`;
    return new Promise(function(resolve, reject) {
      fs.readFile(file, "utf8", function(err, data) {
        if (err) {
=======
  // console.log(args.url+JSON.stringify(payload.data))
  if (args.type === 'POST') {
    return axios.post(args.url, payload.data, config).then(res => done(payload, res)).catch(err => fail(payload, err));
  } else if (args.type === 'GET') {
    return axios.get(args.url, {
      params: payload.data
    }, config).then(res => done(payload, res)).catch(err => fail(payload, err));
  }else if(args.type === 'JSON'){
    var fs = require('fs');
    var path = require('path');
    // let file = `${process.cwd()}/static/mock/${args.url}`;
    
    let file = `${__dirname}/../static/mock/${args.url}`;
    return new Promise(function(resolve, reject){
      fs.readFile(file, "utf8", function(err, data){
        if(err){
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      })
    });
  }


}
<<<<<<< HEAD

function done(args, payload, res) {
  if (res.state == "success") {
=======
function done(payload, res){
  if(res.state == "success"){
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
    return res;
    if (payload.server == "messageListNoRead") {
      return res;
    } else {
      return res.data;
    }

  } else if (res.state == "error") {
    let path = '';
    if (args.type == "GET") {
      for (var i in payload.data) {
        path += '&' + i + '=' + payload.data[i];
      }
      path = args.url + '?' + path.substr(1)
    }
    err.request = {
      path: path,
      url: args.url,
      type: args.type,
      data: payload.data,
      error: err.msg
    }
    if(payload.ctxState){
      payload.ctxState.fail.push(res);
    }
    
    return res;
  }

}
<<<<<<< HEAD

function fail(args, payload, err) {
  let errType = typeof err;
  let path = '';
  if (args.type == "GET") {
    for (var i in payload.data) {
      path += '&' + i + '=' + payload.data[i];
    }
    path = args.url + '?' + path.substr(1)
  }
  if(errType == "object"){
    if (payload.server == "getStudyPlanList" || payload.server == "studyPlanProgressSave" || payload.server == "getappdownloadinfo" || payload.server == "getTeacherLiveCourselist" || payload.server == "applyrestudylist" ) {
      return err;
    } else if ( (payload.server == "getClassPlanDetail" || payload.server == "memberGetplan") && err.msg == "没有对应的学习计划") {
      return err;
    } else if (payload.server == "login" && err.msg == "同步错误,id可能已存在" && err.msg == "登录彻底失败") {
      return err;
    } else {
      err.request = {
        path: path,
        url: args.url,
        type: args.type,
        data: payload.data,
        error: err.msg
      }
      if(payload.ctxState){
        payload.ctxState.fail.push(err);
      }
      return err;
    }
=======
function fail(payload, err){
  if(payload.server == "getappdownloadinfo"){
    return err
  }else if(payload.server == "memberGetplan" && err.msg == "没有对应的学习计划"){
    return err
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
  }else{
    if(payload.ctxState){
      payload.ctxState.fail.push({
        state: "error",
        request: {
          path: path,
          url: args.url,
          type: args.type,
          data: payload.data,
          error: err
        }
      });
    }
    return err;
  }

}

module.exports = {
  ajax
}