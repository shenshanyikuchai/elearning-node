module.exports = [
	{
		name : "api",
		path : "api",
		type : "get",
		modules : ["html/api"]
	},{
		name : "帮助",
		path : "help",
		type : "get",
		modules : ["html/help"]
	},{
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
		modules : ["index","mobile/index","mobile/indexRequest","component/courseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},{
		name : "pc端首页",
		path : "pcIndex",
		type : "get",
		modules : ["index","pc/index","pc/indexRequest","component/courseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	}
]