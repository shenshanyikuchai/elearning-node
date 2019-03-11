const { ajax } = require('../request');

module.exports = {
	callMe : async(who, data) => {
		// console.log(data)
		// data : {
		// 	courseId : "0"
		// }
		// error:"课程ID长度非法[32位]! [0]"
		// isCallMe:true
		// path:"https://api.zbgedu.com/api/teachsource/course/courseDetail/data?courseId=0"
		// type:"GET"
		// url:"https://api.zbgedu.com/api/teachsource/course/courseDetail/data"
		for(let item of who){
			if(item.mobile){
				await ajax({
					// url : "http://123.126.152.178:8084/api/base/sms/sendErrorAlertSms",
				  server : 'sendsms',
				  // ctxState : ctx.state,
				  data : {
						'adminName': item.name,
						'mobile' : item.mobile,
						'errorUrl': data.url,
						'errorMsg': data.error,
						'errorId' : 'test'
					}
				}).then((res) => {
					console.log(res)
				})
			}
			if(item.email){
				await ZBG.Request.ajax({
					// url: 'http://123.126.152.178:8084/api/base/mail/sendStudentQuestionMessageMail',
				  server : 'sendStudentQuestionMessageMail',
				  // ctxState : ctx.state,
				  data : {
				  	// memberName: item.name,
				  	memberName: "接口url："+data.path+"；错误信息："+data.error,
			  		email: item.email
			  	}
				}).then((res) => {
				  console.log(res)
				})
			}
			
		}


	}
}