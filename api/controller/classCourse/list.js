const Request = require('../../request');
const iGlobal = require('../../global');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.token){
		await next();
		let classCourseList = ctx.state.classCourseList;
		let serverTime = parseInt(classCourseList['server-time']);
		let classCourseListRes = [];

		let classCourseNotStart = [];
		let classCourseStudyIn = [];
		let classCourseActivated = [];
		let querySource = ctx.query.source;
		if(classCourseList.data && classCourseList.data.length){
			classCourseList.data.forEach((element, index) => {
				let source = parseInt(element.dataSource);
				let isAdd = true;
				if(source == 2 && querySource != "pc"){
					isAdd = false;
				}
				if(isAdd){
					let classCourse = [];
					let classAssistant = '';
					let classAssistantArray = [];
					
					let classCourseData = {};
					let classCoverPath = '';
					let formatTimeToDay = iGlobal.formatTimeToDay(element.starTime, element.endTme, serverTime);
					if(element.classAssistant && element.classAssistant.length){
						classAssistant = element.classAssistant;
					}
					if(element.classCourse && element.classCourse.length){
						classCoverPath = element.classCourse[0].coverPath;
						element.classCourse.forEach((item,index)=>{
							classCourse.push({
								// "courseCategoryId" : iGlobal.toString(item.courseCategoryId), 0
								"courseCategoryId" : item.subjectId,
								"subjectId" : item.subjectId,
								"courseId" : iGlobal.toString(item.courseId),
								"courseName" : iGlobal.toString(item.courseName),
								"createTime" : iGlobal.toString(item.createTime),
								"lecturerName" : iGlobal.toString(item.teacherName),
								"lecturerId" : iGlobal.toString(item.teacherId),
								"versionId" : iGlobal.toString(item.versionId),
								"planId" : iGlobal.toString(item.planId),
								"assistant" : []
							})
							if(classAssistant && classAssistant.length){
								classAssistant.forEach((itemAssistant) => {
									// classAssistantArray.push(item.teacherName)
									if(itemAssistant.classCourseId == item.courseId){
										classCourse[index].assistant.push({
											teacherId : itemAssistant.teacherId,
											teacherName : itemAssistant.teacherName
										})
									}
								})
							}
						})

					}
					
					
					classCourseData = {
						"dataSource": source,
						"className" : iGlobal.toString(element.name),
						"classId" : iGlobal.toString(element.id),
						"startTime" : iGlobal.getDate(element.starTime),
						"endTime" : iGlobal.getDate(element.endTme),
						"nowToOpeningTime" : formatTimeToDay.day,
						"nowToOpeningTimeArray" : formatTimeToDay.dayArray,
						"headmasterName" : iGlobal.toString(element.classTeacherName),
						"headmasterId" : iGlobal.toString(element.classTeacherId),
						"QRCode" : iGlobal.toString(element.qrCodeUrl),
						"coverPath" : classCoverPath,
						"classCourse" : classCourse,
						
						// "serverTime" : iGlobal.toString(serverTime)
					}
					
					if(serverTime<element.starTime){
						classCourseData.state = "0";
						// classCourseNotStart.push(classCourseData);

						classCourseStudyIn.push(classCourseData);
					}else if(element.starTime<serverTime && serverTime<element.endTme){
						classCourseData.state = "1";
						classCourseStudyIn.push(classCourseData);
					}else if(element.endTme<serverTime){
						classCourseData.state = "2";
						classCourseActivated.push(classCourseData);
					}
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