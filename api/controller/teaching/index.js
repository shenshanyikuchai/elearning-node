const Request = require('../../request');
const iGlobal = require('../../global');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.memberId && ctx.query.token && ctx.query.userLevel){
		await next();
		let teacherClassList = [];
		
		let serverTime = new Date().getTime();
		let classState = "0";
		ctx.state.teacherClass.forEach((classElement, classIndex) => {
			let classCourseList = [];
			if(serverTime < classElement.starTime){
				classState = "0";
			}else if(classElement.starTime<serverTime && serverTime<classElement.endTme){
				classState = "1";
			}else if(classElement.endTme<serverTime){
				classState = "2";
			}
			

			classElement.courseList.forEach((courseElement, courseIndex) => {
				classCourseList.push({
					"startTime" : iGlobal.getDate(courseElement.beginTime),
					"courseCategoryId" : courseElement.courseCategoryId,
					"courseId" : courseElement.courseId,
					"courseName" : courseElement.courseName,
					"planId" : courseElement.planId,
					"teacherId" : courseElement.teacherId,
					"teacherName" : courseElement.teacherName,
					"versionId" : courseElement.versionId,
					"sort" : courseElement.sort
				})

			})
			teacherClassList.push({
				"state" : classState,
				"startTime" : iGlobal.getDate(classElement.starTime),
				"endTime" : iGlobal.getDate(classElement.endTime),
				"classId" : classElement.id,
				"className" : classElement.name,
				"classTeacherName" : classElement.classTeacherName,
				"classTeacherId" : classElement.classTeacherId,
				"classAssistant" : classElement.classAssistant,
				"QRCode" : classElement.qrCodeUrl,
				"classCourse" : classCourseList
			})
		})
		let liveList = [];
		console.log(ctx.state.liveList)
		ctx.state.liveList.forEach((liveElement, liveIndex) => {
			liveList.push(liveElement)
		})
		
		let loginTimeago = '';
		if(ctx.state.loginLog && ctx.state.loginLog.length){
			loginTimeago = ctx.state.loginLog[0] ? iGlobal.timeago(ctx.state.loginLog[0].loginTime/1000) : "第一次登录";
		}
		ctx.state.data = {
			loginTimeago : loginTimeago,
			teacherClass : teacherClassList,
			liveList : liveList
		};
		
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}