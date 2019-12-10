module.exports = [
	
	// base
	{
		isAddWord: true,
		name: "登录",
		path: "login",
		type: "post",
		modules: ["login/getToken", "login/login"],
		queryData: {
			type: "pcWeb",
			username: "zpk",
			password: "123456"
		}
	}, 
	{
		isAddWord: true,
		name : "获取我的证书科目",
		path: "getCategorySubject",
		type: "get",
		modules: ["myCourse/getCategorySubject", "component/course/classCourseRequest", "component/course/learningCourseRequest"],
		queryData: {
			token : ""
		}
	},
	{
		isAddWord: true,
		name: "班级课程列表",
		path: "classCourseList",
		type: "get",
		modules: ["classCourse/list", "classCourse/listRequest"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41"
		}
	}, 
	{
		isAddWord: true,
		name: "班级课程详情",
		path: "classCourseDetail",
		type: "get",
		// modules: ["component/teachingPlan/courseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId", "component/getCourseArrange"],
		modules: ["component/teachingPlan/courseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		isAddWord: true,
		name: "EZ课程详情",
		path: "ezCourseDetail",
		type: "get",
		modules: ["component/ezCoursePlan/courseDetail", "component/ezCoursePlan/courseDetailRequest", "component/memberGetplan", "component/courseactivestatus"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		isAddWord: true,
		name: "EZ课学习日历",
		path: "ezCourseCalendar",
		type: "get",
		modules: ["component/courseCalendar/courseDetail", "component/courseCalendar/courseDetailRequest", "component/memberGetplan"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
	{
		isAddWord: true,
		name: "新班级课程详情",
		path: "iClassCourseDetail",
		type: "get",
		modules: ["component/teachingPlan/iCourseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		isAddWord: true,
		name: "新EZ课程详情",
		path: "iEzCourseDetail",
		type: "get",
		modules: ["component/ezCoursePlan/iCourseDetail", "component/ezCoursePlan/courseDetailRequest", "component/memberGetplan", "component/courseactivestatus"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		isAddWord: true,
		name: "新EZ课学习日历",
		path: "iEzCourseCalendar",
		type: "get",
		modules: ["component/courseCalendar/iCourseDetail", "component/courseCalendar/courseDetailRequest", "component/memberGetplan"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
	{
		isAddWord: true,
		name: "测评成绩报告",
		path: "examReport",
		type: "get",
		modules: ["classCourse/examReport", "classCourse/examReportRequest", "component/knowledge"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			knowledgePointId: "ff8080815133db0d0151375bfdf30c0d",
			examenNum: 0
		}
	},
	// mobile 
	{
		isAddWord: true,
		name: "移动端首页",
		path: "mobileIndex",
		type: "get",
		modules: ["mobile/index", "mobile/indexRequest", "component/courseProgress"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			type: ""
		}
	}, 
	{
		isAddWord: true,
		name: "移动端首页-在学课程,班级课程",
		path: "mobile/home",
		type: "get",
		modules: ["mobile/home", "mobile/homeRequest", "classCourse/listRequest", "component/courseProgress"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			type: ""
		}
	}, 
	
	
	// myCourse
	{
		isAddWord: true,
		name: "在学课程",
		path: "myCourse/studyIn",
		type: "get",
		modules: ["myCourse/studyIn"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d"
		}
	}, {
		isAddWord: true,
		name: "未激活课程",
		path: "myCourse/noActive",
		type: "get",
		modules: ["myCourse/noActive"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d"
		}
	}, {
		isAddWord: true,
		name: "已过期课程",
		path: "myCourse/expiration",
		type: "get",
		modules: ["myCourse/expiration"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d"
		}
	}, 
	
	// teaching
	{
		name: "教师端登录",
		path: "teacher/login",
		type: "post",
		modules: ["login/getToken", "login/teacherLogin"],
		queryData: {
			type: "pcWeb",
			username: "zpk",
			password: "123456"
		}
	}, {
		name: "教师端首页",
		path: "teacher/index",
		type: "get",
		modules: ["teaching/index", "teaching/indexRequest", "component/loginLog"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: 'ff8080815133db0d0151375bfdf30c0d',
			userLevel: "0"
		}
	},
	{
		name: "课程试卷id列表",
		path: "teacher/exerciseIdList",
		type: "get",
		modules: ["teaching/exerciseIdList"],
		queryData: {
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		name: "教学班级列表",
		path: "teaching/classList",
		type: "get",
		modules: ["teaching/classList", "teaching/classListRequest", "component/loginLog"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: 'ff8080815133db0d0151375bfdf30c0d',
			type: "0"
		}
	}, {
		name: "教学课程详情",
		path: "teaching/courseDetail",
		type: "get",
		modules: ["teaching/courseDetail", "teaching/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	
	{
		name: "数据库",
		path: "db",
		type: "html",
		modules: ["db/index"]
	},
	// bbs
	{
		name : "保存帖子",
		path: "bbs/save",
		type: "post",
		modules: ["bbs/save","component/message/bbssave","component/message/getTeacherData","component/message/insertMessage","component/message/sendStudentQuestionMessageMail"],
		queryData: {
			
		}
	},
	{
		name : "回复帖子",
		path: "bbs/reply",
		type: "post",
		modules: ["bbs/reply","component/message/bbsreply","component/message/getTeacherData","component/message/insertMessage","component/message/sendStudentQuestionMessageMail"],
		queryData: {
			
		}
	},
	{
		name : "问题预警",
		path: "bbs/earlyWarning",
		type: "get",
		modules: ["bbs/earlyWarning","component/message/bbsCourseList"],
		queryData: {
			memberId : "",
			token : "",
			classId : "",
			isFirst : 0 // 第一次发送0，其他发送1
		}
	},
	{
		name : "获取教师帖子列表",
		path: "bbs/bbsTeacherList",
		type: "get",
		modules: ["bbs/bbsTeacherList","component/message/bbsCourseList"],
		queryData: {
			memberId : "",
			token : "",
			classId : "",
			isFirst : 0 // 第一次发送0，其他发送1
		}
	},

	// wx
	{
		name: "微信验证",
		path: "wxGetToken",
		type: "get",
		modules: ["wx/getToken"]
	}, 
	// mock
	{
		name: "注册",
		path: "register",
		type: "get",
		modules: ["login/register"],
	}, {
		name: "pad注册",
		path: "pad/register",
		type: "get",
		modules: ["login/register_pad"],
	}, 
	{
		name: "未激活课程假数据",
		path: "myCourse/noActivecourse",
		type: "get",
		modules: ["myCourse/noActivecourse"]
	}, {
		name: "pad未激活课程假数据",
		path: "myCourse/pad/noActivecourse",
		type: "get",
		modules: ["myCourse/noActivecourse_pad"]
	}, {
		name: "未激活课程假购买",
		path: "myCourse/payNoActivecourse",
		type: "get",
		modules: ["myCourse/payNoActivecourse"]
	}, 

	// no use
	{
		name: "pc端首页",
		path: "pcIndex",
		type: "get",
		modules: ["pc/index", "pc/indexRequest", "component/courseProgress"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d"
		}
	}, 
	{
		name: "pc端课程首页",
		path: "pcCourseIndex",
		type: "get",
		modules: ["pc/courseIndex", "pc/courseIndexRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		name: "pc端布局",
		path: "layout",
		type: "get",
		modules: ["component/header"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
		}
	}, 
	{
		name: "课程试卷id列表",
		path: "course/exerciseIdList",
		type: "get",
		modules: ["component/course/exerciseIdList", "component/course/exerciseIdListRequest"],
		queryData: {
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},  
	{
		name : "获取题库有权限的证书科目",
		path: "exam/get",
		type: "get",
		modules: ["bbs/bbsTeacherList","component/message/bbsCourseList"],
		queryData: {
			token : ""
		}
	},
	{
		name: "教学大纲",
		path: "teachingProgram",
		type: "get",
		modules: ["classCourse/teachingProgram"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	}, 
	{
		name: "课程详情",
		path: "courseDetail",
		type: "get",
		modules: ["component/courseDetail"]
	}, 
	
	{
		name: "学习中心-教学计划-课程详情",
		path: "studycenter/teachingPlan/courseDetail",
		type: "get",
		modules: ["studycenter/teachingPlan/courseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
	{
		name: "课程计划详情",
		path: "coursePlanDetail",
		type: "get",
		modules: ["component/teachingPlan/courseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId", "component/getCourseArrange"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
	{
		name: "教学计划",
		path: "teachingPlan",
		type: "get",
		modules: ["classCourse/teachingPlan"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
	{
		name: "教学计划-课程详情",
		path: "teachingPlan/courseDetail",
		type: "get",
		modules: ["component/teachingPlan/courseDetail", "component/teachingPlan/courseDetailRequest", "component/memberClassGetplan", "component/courseactivestatus", "component/searchCourseAlterationsByVersionId"],
		queryData: {
			token: "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId: "ff8080815133db0d0151375bfdf30c0d",
			courseId: "8a22ecb5577562b70157b6fc00e8011c"
		}
	},
]