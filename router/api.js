module.exports = [
	{
		name : "登录",
		path : "/login",
		type : "get",
		modules : ["login/getToken","login/login"]
	},{
		name : "首页",
		path : "/index",
		type : "get",
		// modules : ["courseInfo/learningcourse","courseInfo/getCourseProgress","courseInfo/getExamDate","userInfo/mycount","userInfo/getLoginLog","userInfo/messageList-noRead","slideList","index/index"]
		modules : ["courseInfo/learningcourse","courseInfo/getCourseProgress","courseInfo/getExamDate","index/index"]
	}
]