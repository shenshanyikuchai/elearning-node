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
		name : "头部",
		path : "header",
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
	},{
		name : "pc端首页",
		path : "pcIndex",
		type : "get",
		modules : ["pc/index","pc/indexRequest","component/courseProgress"],
		queryData : {
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d"
		}
	},{
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
			token : "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			memberId : "ff8080815133db0d0151375bfdf30c0d",
			courseId : "8a22ecb5577562b70157b6fc00e8011c"
		}
	},{
		name : "班级课程详情",
		path : "classCourseDetail",
		type : "get",
		modules : ["classCourse/detail","classCourse/detailRequest","component/courseactivestatus","component/searchCourseAlterationsByVersionId"],
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
	}
]

/*
$.ajax({
url : 'http://localhost:3080/api/userAction/scene/mobileIndex/login',
type : 'post',
data : {
 type: "pcWeb",
username: "zpk",
password: "123456"
},
success : function(data){
console.log(data)
},error : function(err){
console.log(err)
}
})
*/