module.exports = {
	"NODE_ENV" : "demo", // 环境 正式： 测试：demo 开发：dev
	"isSendErrorSms" : false, // 是否开启短信预警
	"admin": [
	  {
	    "level" : 0,
	    // "mobile" : 13601270155,
	    "name" : "徐老师",
	    // "email" : "panke.zhao@zbgedu.com"
	  },{
	    "level" : 0,
	    "mobile" : 18612875765,
	    "name" : "zpk",
	    "email" : "panke.zhao@zbgedu.com"
	  }
	],
	"isDb" : false, // 是否启用数据库
	"dbs" : "172.16.120.154/studyData" // 正式环境数据库地址
	// "dbs" : "localhost/studyData" // 本地环境数据库地址
	// "dbs" : "127.0.0.1/studyData" // dev环境地址
}