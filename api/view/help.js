module.exports = [
	{
		code : "200",
		msg : "首页",
		state : "success"
	},
	{
		code : "333",
		msg : "没有登录",
		state : "nologin"
	},{
		code : "444",
		msg : "服务器错误",
		state : "error"
	},{
		code : "555",
		msg : "参数错误",
		state : "noparameter"
	},{
		code : "666",
		msg : "网络没有响应",
		state : "loading"
	},
	{
		example : "/login?type=pcWeb&username=zpk&password=123456",
		exampleData : {
		  "data" : {
		    "isAvatar" : true,
		    "token" : "6def47f6-fc2a-4dcb-91f2-9ad9a579c1aa",
		    "nickName" : "zpk",
		    "memberId" : "ff8080815133db0d0151375bfdf30c0d",
		    "avatar" : "/upload/avatar/big_ff8080815133db0d0151375bfdf30c0d.jpg"
		  },
		  "state" : "success",
		  "msg" : ""
		}
	},{
		example : "/index?token=dd68b8cb-9c9c-4da4-9d24-7cbc92006d41&memberId=ff8080815133db0d0151375bfdf30c0d",
		exampleData : {
			recentCourses : [{
				courseName : "CMA Part II 中文 （体验课）",// 课程名称
				courseId : "CMA Part II 中文 （体验课）",// 课程id
				versionId : "CMA Part II 中文 （体验课）",// 课程版本id
				courseBkImage : "/upload/201608/1986ba8d553347f2ba276fffc8161ab9.jpg",// 课程背景 
				examinationDate : "2018/04/14",// 考试时间
				expirationTime : "2018/08/14",//课程到期
				taskProgress : "3",// 任务进度
				taskTotal : "33",// 任务总数
				taskPercentage : "9"// 任务百分比
			}],
			activityList : [{
				url : "http://www.caicui.com/static/Special/acca2015/",// 活动连接地址
				imagePath : "http://exstatic.zbgedu.com/upload/201508/8fc9e3fde7224db0b1e5f4073582a3a7.jpg",// 活动图片
				title : "有梦想，无所谓"// 活动标题
			}],
			code : "200",
			msg : "首页",
			state : "success"
		}
	}
]