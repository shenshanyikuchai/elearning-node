const Request = require('../../request');
const iGlobal = require('../../global');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	if(ctx.query.token){
		await next();
		let classCourseList = ctx.state.classCourseList;
		let serverTime = classCourseList['server-time'];
		let classCourseListRes = [];
		if(classCourseList.data && classCourseList.data.length){
			classCourseList.data.forEach((element, index) => {
				let classCourse = '';
				let classAssistant = '';
				let classAssistantArray = [];
				if(element.classCourse && element.classCourse.length){
					classCourse = element.classCourse[0];
				}
				if(element.classAssistant && element.classAssistant.length){
					classAssistant = element.classAssistant;
				}
				
				if(classAssistant && classAssistant.length){
					classAssistant.forEach((item) => {
						classAssistantArray.push(item.teacherName)
					})
				}

				if(classCourse){
					classCourseListRes.push({
						"className" : iGlobal.toString(element.name),
						"startTime" : iGlobal.toString(element.startTime),
						"entTime" : iGlobal.toString(element.entTime),
						"headmasterName" : iGlobal.toString(element.classTeacherName),
						"headmasterId" : iGlobal.toString(element.classTeacherId),
						"QRCode" : iGlobal.toString(element.qrCodeUrl),
						
						"courseCategoryId" : iGlobal.toString(classCourse.courseCategoryId),
						"courseId" : iGlobal.toString(classCourse.courseId),
						"createTime" : iGlobal.toString(classCourse.createTime),
						"lecturerName" : iGlobal.toString(classCourse.teacherName),
						"lecturerId" : iGlobal.toString(classCourse.teacherId),
						"assistant" : classAssistantArray || "",
						"versionId" : iGlobal.toString(classCourse.versionId),
						"planId" : iGlobal.toString(classCourse.planId),
						"serverTime" : iGlobal.toString(serverTime)
					})
				}
				console.log(classCourseListRes)
			})
		}
		ctx.state.data = {
			classCourseList : classCourseListRes
		};
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}