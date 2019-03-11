const iGlobal = require('../../global');
const constant = require('../../global/constant');
module.exports = async (ctx, next) => {
	if (ctx.query.token && ctx.query.memberId) {
		await next();
		let ctxState = ctx.state;
		let learningcourse = [];
		let isLearningCourse = "0";
		let getCourseProgress = [];
		let isCourseProgress = "0";
		let courseArr = [];
		let recentCourses = [];
		let slideList = [];
		let activityList = [];
		let newRecentCourses = [];
		let isClassCourse = "0";
		if (ctxState.learningcourse && ctxState.learningcourse.length) {
			learningcourse = ctxState.learningcourse;
			isLearningCourse = "1";
			if (ctxState.getCourseProgress && ctxState.getCourseProgress.length) {
				getCourseProgress = ctxState.getCourseProgress;
				isCourseProgress = "1";
			} else {
				newRecentCourses = [];
			}
		} else {
			newRecentCourses = [];
		}


		if (learningcourse.length && getCourseProgress.length) {
			for (let i = 0; i < learningcourse.length; i++) {
				courseArr.push(learningcourse[i].courseId);
			}
			if (courseArr && courseArr.length) {
				let newLastProgress = {
					RecentCourse: []
				};
				for (let i = 0; i < learningcourse.length; i++) {
					for (let j = 0; j < getCourseProgress.length; j++) {
						if (learningcourse[i].courseId == getCourseProgress[j].courseId && newLastProgress.RecentCourse.courseId != getCourseProgress[j].courseId) {
							let addRecentCourse = true;
							if (newLastProgress.RecentCourse && newLastProgress.RecentCourse.length) {
								for (let k = 0; k < newLastProgress.RecentCourse.length; k++) {

									if (newLastProgress.RecentCourse[k].courseId == getCourseProgress[j].courseId) {
										addRecentCourse = false;
									}

								}
							}
							if (addRecentCourse) {
								learningcourse[i].courseProgress = getCourseProgress[j].courseProgress;
								learningcourse[i].createDate = getCourseProgress[j].createDate;

								learningcourse[i].chapterId = getCourseProgress[j].chapterId;
								learningcourse[i].chapterName = getCourseProgress[j].chapterName;
								learningcourse[i].progress = getCourseProgress[j].progress;
								learningcourse[i].taskId = getCourseProgress[j].taskId;
								learningcourse[i].taskName = getCourseProgress[j].taskName;

								newLastProgress.RecentCourse.push(learningcourse[i])


							}
						}
					}
				}
				recentCourses = newLastProgress.RecentCourse;
				let i = 0,
					len = recentCourses.length,
					j, d;
				for (i = 0; i < len; i++) {
					for (j = 0; j < len; j++) {
						if (parseInt(recentCourses[i].createDate) > parseInt(recentCourses[j].createDate)) {
							d = recentCourses[j];
							recentCourses[j] = recentCourses[i];
							recentCourses[i] = d;
						}
					}
				}

				if (recentCourses.length > 4) {
					recentCourses = recentCourses.slice(0, 4)
				}

				for (let i = 0; i < recentCourses.length; i++) {
					for (let j = 0; j < ctx.state.getExamDate.length; j++) {
						if (recentCourses[i].subjectID == ctx.state.getExamDate[j].categoryId) {
							recentCourses[i].examinationDate = ctx.state.getExamDate[j].examinationDate
						}
					}

					let courseName = "";
					if (recentCourses[i].courseName) {
						courseName = recentCourses[i].courseName;
					}
					let courseId = "";
					if (recentCourses[i].courseId) {
						courseId = recentCourses[i].courseId;
					}
					let versionId = "";
					if (recentCourses[i].versionId) {
						versionId = (recentCourses[i].versionId).toString();
					}
					let courseBkImage = "";
					if (recentCourses[i].courseBkImage) {
						courseBkImage = (constant.host.static + recentCourses[i].courseBkImage).toString();
					}
					let examinationDate = "";
					if (recentCourses[i].examinationDate) {
						examinationDate = iGlobal.getDate(recentCourses[i].examinationDate);
					}
					let expirationTime = "";
					if (recentCourses[i].expirationTime) {
						expirationTime = iGlobal.getDate(recentCourses[i].expirationTime);
					}

					let percentages = iGlobal.getPercentage({
						"progress": recentCourses[i].courseProgress,
						"total": recentCourses[i].taskTotal,
						"lastPorgress": recentCourses[i].progress
					})


					newRecentCourses.push({
						"courseName": courseName, // 课程名称
						"courseId": courseId, // 课程id
						"versionId": versionId, // 课程版本id
						"courseBkImage": courseBkImage, // 课程背景
						"examinationDate": examinationDate, // 考试时间
						"expirationTime": expirationTime, //课程到期
						"taskProgress": percentages.progress.toString(), // 任务进度
						"taskTotal": percentages.total.toString(), // 任务总数
						"taskPercentage": percentages.percentage.toString(), // 任务百分比
						"link": [{
							"name": "课程首页",
							"url": `${constant.host.actionHostName}/courseIndex?token=${ctx.query.token}&memberId=${ctx.query.memberId}&courseId=${courseId}`,
							"relations": "nextPage"
						}]
					})

				}
			}
		}
		if (ctxState.slideList) {
			slideList = ctxState.slideList;
		}
		if (slideList.length) {
			for (let i = 0; i < slideList.length; i++) {
				activityList.push({
					url: slideList[i].url,
					imagePath: constant.host.static + slideList[i].imagePath,
					title: slideList[i].title
				})
			}
		}

		let classCourseList = ctx.state.classCourseList;
		
		let classCourseListRes = [];

		let classCourseNotStart = [];
		let classCourseStudyIn = [];
		let classCourseActivated = [];
		if (classCourseList && classCourseList.data && classCourseList.data.length) {
			let serverTime = parseInt(classCourseList['server-time']);
			classCourseList.data.forEach((element, index) => {
				let classCourse = [];
				let classAssistant = '';
				let classAssistantArray = [];

				let classCourseData = {};
				let classCoverPath = '';
				let formatTimeToDay = iGlobal.formatTimeToDay(element.starTime, element.endTme, serverTime);
				if (element.classAssistant && element.classAssistant.length) {
					classAssistant = element.classAssistant;
				}

				if (element.classCourse && element.classCourse.length) {
					classCoverPath = element.classCourse[0].coverPath;
					element.classCourse.forEach((item, index) => {
						classCourse.push({
							"courseCategoryId": iGlobal.toString(item.courseCategoryId),
							"courseId": iGlobal.toString(item.courseId),
							"courseName": iGlobal.toString(item.courseName),
							"createTime": iGlobal.toString(item.createTime),
							"lecturerName": iGlobal.toString(item.teacherName),
							"lecturerId": iGlobal.toString(item.teacherId),
							"versionId": iGlobal.toString(item.versionId),
							"planId": iGlobal.toString(item.planId),
							"assistant": []
						})
						if (classAssistant && classAssistant.length) {
							classAssistant.forEach((itemAssistant) => {
								// classAssistantArray.push(item.teacherName)
								if(itemAssistant.classCourseId == item.courseId){
									classCourse[index].assistant.push({
										teacherId: itemAssistant.teacherId,
										teacherName: itemAssistant.teacherName
									})
								}
							})
						}
					})

				}


				classCourseData = {
					"className": iGlobal.toString(element.name),
					"classId": iGlobal.toString(element.id),
					"startTime": iGlobal.getDate(element.starTime),
					"endTime": iGlobal.getDate(element.endTme),
					"nowToOpeningTime": formatTimeToDay.day,
					"nowToOpeningTimeArray": formatTimeToDay.dayArray,
					"headmasterName": iGlobal.toString(element.classTeacherName),
					"headmasterId": iGlobal.toString(element.classTeacherId),
					"QRCode": iGlobal.toString(element.qrCodeUrl),
					"coverPath": classCoverPath,
					"classCourse": classCourse,

					// "serverTime" : iGlobal.toString(serverTime)
				}

				if (serverTime < element.starTime) {
					// console.log("未开始")
					isClassCourse = "1";
					classCourseData.state = "0";
					// classCourseNotStart.push(classCourseData);
					classCourseStudyIn.push(classCourseData);
				} else if (element.starTime < serverTime && serverTime < element.endTme) {
					// console.log("进行中")
					isClassCourse = "1";
					classCourseData.state = "1";
					classCourseStudyIn.push(classCourseData);
				} else if (element.endTme < serverTime) {
					// console.log("已过期")
					classCourseData.state = "2";
					classCourseActivated.push(classCourseData);
				}
			})
		}

		ctx.state.data = {
			recentCourses: newRecentCourses,
			isLearningCourse: isLearningCourse,
			activityList: activityList,
			isCourseProgress: isCourseProgress,
			isClassCourse: isClassCourse,
			classCourseList: {
				"notStarted": classCourseNotStart,
				"studyIn": classCourseStudyIn,
				"beoverdue": classCourseActivated
			}
		}
	} else {
		ctx.state.response = constant.response.noparameter;
	}
}