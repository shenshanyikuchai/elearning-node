const Request = require('../../request');
const iGlobal = require('../../global');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	if(ctx.query.token){
		await next();
		let classCourseList = ctx.state.classCourseList;
		let serverTime = parseInt(classCourseList['server-time']);
		let classCourseListRes = [];

		let classCourseNotStart = [];
		let classCourseStudyIn = [];
		let classCourseActivated = [];

		if(classCourseList.data && classCourseList.data.length){
			classCourseList.data.forEach((element, index) => {
				let classCourse = '';
				let classAssistant = '';
				let classAssistantArray = [];
				
				let classCourseData = {};
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
				classCourseData = {
					"className" : iGlobal.toString(element.name),
					"startTime" : iGlobal.getDate(element.starTime),
					"endTime" : iGlobal.toString(element.endTme),
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
				}
				if(serverTime<element.starTime){
					classCourseData.state = "0";
					let day = (parseInt((element.starTime-serverTime)/(1000*60*60*24))).toString();
					if(day.length == 1){
						day = "00" + day;
					}else if(day.length == 2){
						day = "0" + day;
					}else if(day.length == 3){

					}else{

					}
					let dayArray = day.split('');

					classCourseData.nowToOpeningTime = day;
					classCourseData.nowToOpeningTimeArray = dayArray;

					classCourseNotStart.push(classCourseData);

				}else if(element.starTime<serverTime && serverTime<element.endTme){
					classCourseData.state = "1";
					classCourseStudyIn.push(classCourseData);
				}else if(element.endTme<serverTime){
					classCourseData.state = "2";
					classCourseActivated.push(classCourseData);
				}
			})
		}
		ctx.state.data = {
			classCourseList : {
				"notStarted" : classCourseNotStart,
				"studyIn" : classCourseStudyIn,
				"beoverdue" : classCourseActivated
			}
		};
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}