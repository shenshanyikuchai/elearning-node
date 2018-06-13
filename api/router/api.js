module.exports = [
	{
		name : "接口文档",
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
		type : "post",
		modules : ["login/getToken","login/login"],
		queryData : {
			type : "pcWeb",
			username : "zpk",
			password : "123456"
		}
	},{
		name : "pc端布局",
		path : "layout",
		type : "get",
		modules : ["component/header"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
		}
	},{
		name : "移动端首页",
		path : "mobileIndex",
		type : "get",
		modules : ["mobile/index","mobile/indexRequest","component/courseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},
	{
		name : "在学课程",
		path : "myCourse/studyIn",
		type : "get",
		modules : ["myCourse/studyIn"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},
	{
		name : "未激活课程",
		path : "myCourse/noActive",
		type : "get",
		modules : ["myCourse/noActive"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			pageNo : "0",
			pageSize : "999"
		}
	},
	{
		name : "已过期课程",
		path : "myCourse/expiration",
		type : "get",
		modules : ["myCourse/expiration"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			pageNo : "0",
			pageSize : "999"
		}
	},
	{
		name : "pc端首页",
		path : "pcIndex",
		type : "get",
		modules : ["pc/index","pc/indexRequest","component/courseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},
	{
		name : "pc端课程首页",
		path : "pcCourseIndex",
		type : "get",
		modules : ["pc/courseIndex","pc/courseIndexRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "班级课程列表",
		path : "classCourseList",
		type : "get",
		modules : ["classCourse/list","classCourse/listRequest"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41"
		}
	},{
		name : "班级课程详情",
		path : "classCourseDetail",
		type : "get",
		// modules : ["classCourse/detail","classCourse/detailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		modules : ["component/teachingPlan/courseDetail","component/teachingPlan/courseDetailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "教学计划-课程详情",
		path : "teachingPlan/courseDetail",
		type : "get",
		modules : ["component/teachingPlan/courseDetail","component/teachingPlan/courseDetailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "学习中心-教学计划-课程详情",
		path : "studycenter/teachingPlan/courseDetail",
		type : "get",
		modules : ["studycenter/teachingPlan/courseDetail","component/teachingPlan/courseDetailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "课程计划详情",
		path : "coursePlanDetail",
		type : "get",
		// modules : ["classCourse/detail","classCourse/detailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		modules : ["component/teachingPlan/courseDetail","component/teachingPlan/courseDetailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "教学大纲",
		path : "teachingProgram",
		type : "get",
		modules : ["classCourse/teachingProgram"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "教学计划",
		path : "teachingPlan",
		type : "get",
		modules : ["classCourse/teachingPlan"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "测评成绩报告",
		path : "examReport",
		type : "get",
		modules : ["classCourse/examReport","classCourse/examReportRequest","component/knowledge"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "教师端登录",
		path : "teacher/login",
		type : "post",
		modules : ["login/getToken","login/teacherLogin"],
		queryData : {
			type : "pcWeb",
			username : "zpk",
			password : "123456"
		}
	},{
		name : "教师端首页",
		path : "teacher/index",
		type : "get",
		modules : ["teaching/index", "teaching/indexRequest", "component/loginLog"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : 'ff8080815133db0d0151375bfdf30c0d',
			userLevel : "0"
		}
	},{
		name : "教学班级列表",
		path : "teaching/classList",
		type : "get",
		modules : ["teaching/classList","teaching/classListRequest","component/loginLog"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : 'ff8080815133db0d0151375bfdf30c0d',
			type : "0"
		}
	},{
		name : "教学课程详情",
		path : "teaching/courseDetail",
		type : "get",
		modules : ["teaching/courseDetail","teaching/courseDetailRequest","component/memberGetplan","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	}
]
