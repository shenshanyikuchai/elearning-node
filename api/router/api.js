module.exports = [
	{
		name : "登录",
		path : "login",
		type : "get",
		modules : ["login/getToken","login/login"],
		queryData : {
			type : "pcWeb",
			username : "zpk",
			password : "123456"
		}
	},{
		name : "移动端首页",
		path : "mobileIndex",
		type : "get",
		modules : ["index","mobileIndex/index","mobileIndex/mobileIndex","component/getCourseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},{
		name : "首页",
		path : "index",
		type : "get",
		// modules : ["index/entry","courseInfo/learningcourse","courseInfo/getCourseProgress","courseInfo/getExamDate","userInfo/mycount","userInfo/getLoginLog","userInfo/messageList-noRead","slideList","index/index"],
		modules : ["index","home/index","home/home","component/getCourseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	}
]