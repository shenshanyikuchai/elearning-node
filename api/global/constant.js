module.exports = {
  "ENTER_KEY" : "13",
  "token": "",
  "loginLink" : "http://www.zbgedu.com/index.php?m=user&c=index&a=index",
  "loginLinkTest" : "#studycenterLogin",
  "host": {
    "origin" : "http://elearning.zbgedu.com",
    "name": "http://api.zbgedu.com",
    "nameAction": "http://action.zbgedu.com",
    "demoName" : "http://demo.caicui.com",
    // "demoName" : "http://192.168.10.112:8083",
    "static" : "http://exstatic.zbgedu.com/",
    "img" : "http://eximg.zbgedu.com",
    "imgAddress" : "http://exstatic.zbgedu.com/",
    "infoAddress" : "http://elearning.zbgedu.com/",
    "IPLocation" : "http://elearning.zbgedu.com/api/v2/",
    "actionHostName" : "http://action.zbgedu.com/api/userAction/scene/mobileIndex"
  },
  "product": {
    "pcWeb": {
      "appType": "pc",
      "appId": "pcWeb",
      "appKey": "e877000be408a6cb0428e0f584456e03"
    },
    "winExe": {
      "appType": "pcEXE",
      "appId": "pcEXECourse",
      "appKey": "4a9a86b12b9339f66852d9cb58973f6e"
    },
    "iPad": {
      "appType": "iPad",
      "appId": "iPadCourse",
      "appKey": "bd2de9a5d1606fe68083026e911def3a"
    },
    "iPhone": {
      "appType": "iPhone",
      "appId": "iPhoneCourse",
      "appKey": "8f81bf2e06c0f32df06ba7a04cf4bbb7"
    },
    "aPhone": {
      "appType": "aPhone",
      "appId": "aPhoneCourse",
      "appKey": "4b6454d8cf903498116e26b26dd5791a"
    },
    "aPad": {
      "appType": "aPad",
      "appId": "aPadCourse",
      "appKey": "f7e4ebaa872f38db7b548b870c13e79e"
    }
  },
  "response" : {
    "success" : {
      "code" : "200",
      "msg" : "成功",
      "state" : "success"
    },
    "nologin" : {
      "code" : "333",
      "msg" : "没有登录",
      "state" : "nologin"
    },
    "errorInput" : {
      "code" : "334",
      "msg" : "用户名或密码错误",
      "state" : "errorInput"
    },
    "error" : {
      "code" : "444",
      "msg" : "服务器错误",
      "state" : "error"
    },
    "noparameter" : {
      "code" : "555",
      "msg" : "参数错误",
      "state" : "noparameter"
    },
    "loading" : {
      "code" : "666",
      "msg" : "网络没有响应",
      "state" : "loading"
    },
    "nodeerror" : {
      "code" : "777",
      "msg" : "node服务器错误",
      "state" : "nodeerror"
    }
  },
  "userLevel" : [{
    "id" : "ff808081473905e701475d5bb8cc004a",
    "name" : "默认等级",
    "type" : ""
  },{
    "id" : "ff80808147816dbc0147a07edb4c0041",
    "name" : "第一级",
    "type" : ""
  },{
    "id" : "ff80808147816dbc0147a07f31710042",
    "name" : "第二级",
    "type" : ""
  },{
    "id" : "ff8080814a709fa2014a750aed1a07c1",
    "name" : "中博内部用户",
    "type" : ""
  },{
    "id" : "0216ec613eee11e8904f64006a5147e8",
    "name" : "讲师",
    "type" : "0"
  },{
    "id" : "17099c893eee11e8904f64006a5147e8",
    "name" : "助教",
    "type" : "2"
  },{
    "id" : "1dc54b253eee11e8904f64006a5147e8",
    "name" : "班主任",
    "type" : "1"
  }]
}