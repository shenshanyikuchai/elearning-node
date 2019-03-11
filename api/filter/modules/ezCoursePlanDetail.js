const _ = require('lodash');
const iGlobal = require('../../global');
const constant = require('../../global/constant');
var {
	resCourseDetail
} = require('../../resData/courseDetail');
var globalCourseDetail = {};

function initData() { // 初始化数据
	globalCourseDetail = {
		courseDetail: {}, // 课程详情
		tasksProgress: {}, // 任务进度
		coursePlan: {}, // 课程计划
		courseStatus: {}, // 课程状态 
		examDate: {}, // 考试时间
		courseDetailList: [], // 存储 将多层课程结构转换为一层结构 的数据
		courseDetailListBack: [],
		weekIngNum: 0, // 当前进行的周
		// 返回的数据
		courseInfo: {}, // 课程基本信息
		courseStatistic: {}, // 课程统计
		courseStatus: {}, // 课程状态
		courseWeekPlan: [], // 课程周计划
		courseLastLearn: {}, // 课程最后学习章节

	}
}

function ezCoursePlanDetail(payload) {
	console.log(payload)
	// debugger;
	initData();
	globalCourseDetail = { 
		...globalCourseDetail,
		...payload
	};
	flatCourseDetail({
		chapters: globalCourseDetail.courseDetail.chapters
	})
	globalCourseDetail.lastLearn = filterLastLearnChapter(globalCourseDetail.courseDetailListBack, payload.tasksProgress);
	for(let index in globalCourseDetail.coursePlan){
		if (globalCourseDetail.coursePlan[index] && globalCourseDetail.coursePlan[index].length) {
			let newCoursePlan = filterCoursePlan(globalCourseDetail.coursePlan[index]);
			let courseWeekPlan = getCourseWeekPlan(globalCourseDetail.courseDetailList, newCoursePlan);
			globalCourseDetail = {
				...globalCourseDetail,
				...courseWeekPlan
			}
			// globalCourseDetail.courseWeekPlan = courseWeekPlan.courseWeekPlan;
			// globalCourseDetail.courseStatistic = courseWeekPlan.courseStatistic;
		}
	}
	

	globalCourseDetail.courseStatus = courseByInFo(payload.courseactivestatus);
	globalCourseDetail.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	globalCourseDetail.courseInfo = filterCourseInfo(payload.courseDetail);
	globalCourseDetail.getCourseArrange = payload.getCourseArrange;
	let renderData = getRenderData();
	globalCourseDetail = {};
	return renderData;
}

function getRenderData() {
	return {
		// "courseStatistic": globalCourseDetail.courseStatistic,
		// "courseWeekPlan" : globalCourseDetail.courseWeekPlan,
		"isCoursePlan": globalCourseDetail.isCoursePlan,
		"planInfo": globalCourseDetail.planInfo,
		"studyInfo": globalCourseDetail.studyInfo,
		"tasksSummary": globalCourseDetail.tasksSummary,
		"weeksSummary": globalCourseDetail.weeksSummary,

		"courseInfo": globalCourseDetail.courseInfo,
		"courseStatus": globalCourseDetail.courseStatus,
		"courseLastLearn": globalCourseDetail.lastLearn,
		"getCourseArrange": globalCourseDetail.getCourseArrange
	}
}

function flatCourseDetail(payload) { // 将多层课程结构转换为一层结构 （递归）
	payload.level ? payload.level++ : payload.level = 1;

	payload.chapters.forEach((element, index) => {
		payload.rootNode = '';
		payload.newNode = '';

		switch (payload.level) {
			case 3:
				payload.rootNode = payload.oldNode;
				payload.newNode = payload.node + '-' + index;
				payload.orderList = (payload.orderList + 1);
				break;
			case 2:
				payload.rootNode = payload.oldNode;
				payload.newNode = payload.node + '-' + index;
				payload.orderList = (payload.node * 10000) + ((index + 1) * 100);
				break;
			case 1:
				payload.newNode = index.toString();
				payload.node = index.toString();
				payload.rootNode = index.toString();
				payload.orderList = index * 10000;
				break;
		}

		let nodeData = {
			level: payload.level, // 层级1，2，3
			rootNode: payload.rootNode, // 根节点0，1，2
			parentNode: payload.node, // 父节点0，1，2，0-0，0-1，0-2
			node: payload.newNode, // 节点0，1，2，0-0，0-1，0-2，0-0-0，0-1-2
			orderList: payload.orderList,
			isFree: element.isFree, // 是否免费
			title: element.chapterTitle, // 章节标题
			chapterId: element.chapterId, // 章节id
			// 'isChildren' : "true", // 是否有子节点
			// 'isTasks' : false, // 是否有任务
		}
		let nodeDataTasks = {};
		let isChildren = "false";
		let isTasks = false;

		if (element.tasks && element.tasks.length) {

			isTasks = true;

			nodeDataTasks = flatCourseTasks(element);

		}
		if (element.children && element.children.length) {
			isChildren = "true";
		}
		globalCourseDetail.courseDetailList.push({
			isChildren: isChildren,
			isTasks: isTasks,
			...nodeData,
			...nodeDataTasks
		});
		globalCourseDetail.courseDetailListBack.push({
			isChildren: isChildren,
			isTasks: isTasks,
			...nodeData,
			...nodeDataTasks
		});
		if (isChildren == "true") {
			flatCourseDetail({
				chapters: element.children,
				level: payload.level,
				node: payload.newNode,
				oldNode: payload.node,
				rootNode: payload.rootNode,
				orderList: payload.orderList,
			})
		}
	})
}

function flatCourseTasks(chapter) { // 添加章节任务数据
	
	let tasks = chapter.tasks;
	let newTasks = [];
	for (let task of tasks) {
		let thisTaskProgress = getTaskProgress(task);
		let newTask = {
			id : task.id, // 试卷id
			taskId : task.taskId, // 任务id
			title : task.title, // 任务名称
			taskType : task.taskType, // 任务类型
			taskLevel : task.taskLevel, // 任务等级
			orderTask : task.orderTask, // 任务排序
			express : task.express, // 扩展字段/是否显示解析
			taskTime : task.taskTime, // 任务时间
		}
		switch(task.taskType){
			case "video":
				newTask = Object.assign(newTask, {
					attachmentPath : task.attachmentPath, // 视频讲义
					videoSiteId : task.videoSiteId, // 视频站点id
					videoCcid : task.videoCcid, // 视频站点id
				})
				break;
			case "exam":
				newTask = Object.assign(newTask, {
					examScord : task.examScord, // 试卷及格率
					endDate : task.endDate, // 试卷结束时间
				})
				break;
			case "openCourse":
				newTask = Object.assign(newTask, {
					openCourseStartTime : task.openCourseStartTime,
					openCourseCourseStatus : task.openCourseCourseStatus,
					openCourseSiteId : task.openCourseSiteId,
					openCourseCcid : task.openCourseCcid,
					openCourseCertificate : task.openCourseCertificate,
					openCourseBackgroundImage : task.openCourseBackgroundImage,
					openCourseContent : task.openCourseContent,
					openCourseLiveType : task.openCourseLiveType,
					openCourseCertificateId : task.openCourseCertificateId,
					openCourseSubjectId : task.openCourseSubjectId,
					openCourseEndTime : task.openCourseEndTime,
					openCourseAdminId : task.openCourseAdminId,
					openCourseLiveRoomId : task.openCourseLiveRoomId,
					openCourseLiveRoomPassword : task.openCourseLiveRoomPassword,
					openCourseLiveManageId : task.openCourseLiveManageId,
				})
				break;
		}
		
		if(globalCourseDetail.UAType == "mobile"){
			newTask = Object.assign(newTask, {
				apiKey: task.apiKey,
				categoryId: globalCourseDetail.courseDetail.categoryId,
				categoryName: globalCourseDetail.courseDetail.categoryName,
				subjectId: globalCourseDetail.courseDetail.subjectId,
				subjectName: globalCourseDetail.courseDetail.subjectName,
				courseId: globalCourseDetail.courseDetail.courseId,
				courseName: globalCourseDetail.courseDetail.courseName,
				chapterId: chapter.chapterId,
				chapterTitle: chapter.chapterTitle,
			})
		}
		newTasks.push({
			...newTask,
			...thisTaskProgress,
			isFree: chapter.isFree
		})
	}
	return {
		'tasks': newTasks
	}
}

function getTaskProgress(taskElement) { // 给任务注入任务进度
	let taskProgress = {
		studyTime: 0, // 学习时长
		state: 0, // 任务状态
		progress: -1, // 任务进度
		total: 0, // 任务总长度
		percentage: 0 // 任务百分比
	}
	let activeTask = _.find(globalCourseDetail.tasksProgress, (o) => {
		return o.taskId == taskElement.taskId;
	})

	if (activeTask) {
		taskProgress = {
			studyTime: activeTask.taskStudyTotalTime,
			state: activeTask.state,
			progress: activeTask.progress,
			total: activeTask.total,
			percentage: iGlobal.getProgress(activeTask.progress, activeTask.total)
		}
	}
	return taskProgress;
}

function filterCoursePlan(coursePlan){
	let newCoursePlan = [];
	for(let index in coursePlan){
		
		let item = coursePlan[index];
		if(item.startCategoryId != "none" && item.endCategoryId != "none"){
			item.index = index;
			// newCoursePlan.push(item)
			newCoursePlan.push({
				index: index,
				startCategoryId: item.start_category_id,
				endCategoryId: item.end_category_id,
				startDate: new Date(item.start_time).getTime(),
				endDate: new Date(item.end_time).getTime(),
				id: item.study_plan_extend_id,
				planTitle: item.title,
				isFinish: 0
			})
		}else{

		}
	}
	return newCoursePlan;
}

function getCourseWeekPlan(courseDetail, coursePlan) { // 根据计划划分课程结构
	let orderListArray = [];
	let courseWeekPlanData = {
		isCoursePlan: "true",
		courseWeekPlan: [], // 课程计划周列表
		courseWeekPlanRenderData: [],
		courseStatistic: {
			week: {
				'name': "周统计",
				'totalNum': 0, // 总数
				'ingNum': 0, // 正在进行数
				'beoverdue': 0, // 逾期数
				'completed': 0, // 完成数
				'onGoing': 0, // 进行数
				'notStarted': 0, // 未开始数
			},
			day: {
				'name': "天统计",
				'totalNum': 0, // 总数
				'ingNum': 0, // 正在进行数
			},
			task: {
				'name': "任务统计",
				'studyTime': 0, // 学习时间
				'totalTime': 0, // 总时间
				'totalNum': 0, // 总数

				'completed': 0, // 完成数
				'onGoing': 0, // 进行数
				'notStarted': 0, // 未开始数

				'videoTime': 0, // 视频时间
				'videoNum': 0, // 视频数
				'liveNum': 0, // 直播数
				'linkNum': 0, // 外链数
				'homeworkNum': 0, // 作业数
				'appraisalNum': 0, //测评数
				'midtermNum': 0, //期中数
				'endNum': 0 // 期末数
			}
		},
	}

	let weekStartTime = coursePlan[0].startDate; // 计划开始时间
	let newDate = new Date().getTime(); // 现在时间
	let newDateSecond = newDate/1000;
	let coursePlanWeekNum = coursePlan.length; // 学习计划周数
	courseWeekPlanData.courseStatistic.week.totalNum = coursePlanWeekNum;
	courseWeekPlanData.courseStatistic.day.totalNum = coursePlanWeekNum * constant.weekDay;

	var isPrevWeekDone = true;

	if (weekStartTime < newDate) {
		courseWeekPlanData.courseStatistic.day.ingNum = Math.ceil((newDate - weekStartTime) / constant.dayTime);
	} else if (newDate < weekStartTime) {
		courseWeekPlanData.courseStatistic.day.notStarted = Math.ceil((weekStartTime - newDate) / constant.dayTime);
	}
	// let weekIndex = 0;

	// courseWeekPlanData.courseStatistic.week.ingNum = Math.ceil(courseWeekPlanData.courseStatistic.day.ingNum / 7);
	
	for (let index in coursePlan) {
		// weekIndex++;
		let element = coursePlan[index];

		let weekStatistic = {
			'totalTime': 0, // 总时间
			'studyTime': 0, // 总学习时间
			'totalNum': 0, // 总数
			'completed': 0, // 完成数
			'onGoing': 0, // 进行数
			'notStarted': 0 // 未开始数
		}
		let weekData = {
			weekPlan: [], // 周计划详情
			weekTask: [], // 周任务
			weekLive:[], // 周直播
			weekAppraisal: [], // 周测评
			appraisalIdList: [],
			weekInfo: { // 周基础信息
				'isOpen': true, // 周计划是否开启
				'isFinish': 0, // 周任务是否完成
				'status': '', // 周状态描述
				'isLock': true
			},
			weekAllTaskStatistic: {
				...weekStatistic
			},
			taskTypeStatistic: {
				video: {
					// 'name': "周视频统计",
					...weekStatistic
				},
				exam: {
					// 'name': "周试题统计",
					...weekStatistic
				},
				knowledgePoint: {
					// 'name': "周知识点统计",
					...weekStatistic
				},
				openCourse: {
					// 'name': "周直播统计",
					...weekStatistic
				},
				link: {
					// 'name': "周外链统计",
					...weekStatistic
				},
				appraisal: {
					// 'name': "周测评统计",
					...weekStatistic
				},
				midterm: {
					// 'name': "周期中统计",
					...weekStatistic
				},
				end: {
					// 'name': "周期末统计",
					...weekStatistic
				}
			}
		}


		// _.forEach(coursePlan, (element, index) => {
		let startIndex = _.findIndex(courseDetail, (o) => { // 周开始章节节点
			return o.chapterId == element.startCategoryId;
		})
		let endIndex = _.findIndex(courseDetail, (o) => { // 周结束章节节点
			return o.chapterId == element.endCategoryId;
		})


		// 找不到开始章节或者结束章节
		if (startIndex == -1 || endIndex == -1) {
			// "找不到开始章节" "找不到结束章节"
			courseWeekPlanData.courseWeekPlan.push({});
			courseWeekPlanData.courseWeekPlanRenderData.push({
				'list': [],
				'weekTask': [],
				'weekLive': [],
				'weekAppraisal': [],
				'appraisalIdList': "",
				'weekAllTaskStatistic': {
					completed: 0,
					notStarted: 0,
					onGoing: 0,
					studyTime: 0,
					totalNum: 0,
					totalTime: 0
				},
				'weekTaskStatistic': {
					appraisal : {
						completed : 0,
						totalNum : 0
					},
					openCourse: {
						completed : 0,
						totalNum : 0
					}
				},

				'isOpen': false,
				'isFinish': 0,
				'status': "null",
				'weekStatus': "null",
				'weekName': "本周暂无学习任务",
				'weekProgress': 0,
				'totalTime': 0,
				'totalTimeFormat': "0s",
				'taskTime': 0,
				'taskTimeFormat': "0s",
				'studyTime': 0,
				'studyTimeFormat': "0s",
				'weekTime': "",
				'startDate': 0,
				'startDateFormat': "0s",
				'endDate': 0,
				'endDateFormat': "0s",

				'taskTotal': 0,
				'taskCompleted': 0,
				'taskOngoing': 0,
				'taskNotstarted': 0,

				'videoTotal': 0,
				'videoCompleted': 0,
				'videoOngoing': 0,
				'videoTime': 0,
				'videoTimeFormat': "0s",
				'videoStudyTime': 0,
				'videoStudyTimeFormat': "0s",
				'videoProgress': 0,
				'videoTimeProgress': 0,
				'videoTimePercentage': 0,

				'examTotal': 0,
				'examCompleted': 0,
				'examOngoing': 0,
				'examProgress': 0,
				'examTime': 0,
				'examTimeFormat': "0s",
				'examStudyTime': 0,
				'examTimePercentage': 0,

				'isEvaluation': false,
				'evaluationId': "",
				'evaluationStatus': 0,
				'evaluationTime': 0,
				'evaluationTimeFormat': "0s",
				'evaluationTimePercentage': 0,

				'isLive': false,
				'liveStatus': 2,
				'liveStatusText': "",
				'liveTime': "",
				'liveDate': "",
				"liveDateLast": ""
			});
			// return false;
			continue;
		}
		

		// let weekStartTime = element.startDate; // 周开始时间
		// let weekEndTime = (element.endDate + constant.dayTime); // 周结束时间
		let weekStartTime = element.startDate; // 周开始时间
		let weekEndTime = (element.endDate + constant.dayTime); // 周结束时间
		if(parseInt(index)){
			weekStartTime = coursePlan[index-1].endDate + constant.dayTime;
			weekEndTime = (element.endDate + constant.dayTime);
		}
		if (weekStartTime < newDate && weekEndTime < newDate) {
			weekData.weekInfo.status = "beoverdue";
			weekData.weekInfo.isLock = false;
		} else if (weekStartTime < newDate && newDate < weekEndTime) {
			courseWeekPlanData.courseStatistic.week.ingNum = index;
			weekData.weekInfo.status = "ongoing";
			weekData.weekInfo.isLock = false;
		}
		if (newDate < weekStartTime && newDate < weekEndTime) {
			weekData.weekInfo.isOpen = false;
			weekData.weekInfo.status = "notstarted";
		}


		for (let i = startIndex; i <= endIndex; i++) {
			let thisItem = courseDetail[i];


			// orderListArray.push(((index + 1) * 1000000) + thisItem.orderList)
			thisItem.orderList = ((index + 1) * 1000000) + thisItem.orderList;
			thisItem.progress = 0;
			if (thisItem.tasks && thisItem.tasks.length) {
				taskStatistic(weekData, thisItem);
			}
			weekData.weekPlan.push(thisItem);
		}
		setWeekStatistic(weekData);

		// 上一周任务是否完成
		if(isPrevWeekDone){
			switch(weekData.weekInfo.status){
				case "notstarted":
				case "ongoing":
					if (weekData.weekAllTaskStatistic.onGoing) {
						isPrevWeekDone = false;
						weekData.weekInfo.isFinish = 0;
						weekData.weekInfo.status = "ongoing";
						weekData.weekInfo.isLock = false;
					}
					if (weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed) {
						isPrevWeekDone = true;
						weekData.weekInfo.isFinish = 1;
						weekData.weekInfo.status = "completed";
						weekData.weekInfo.isLock = false;
					}
					break;
				case "beoverdue":
					if (weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed) {
						isPrevWeekDone = true;
						weekData.weekInfo.isFinish = 1;
						weekData.weekInfo.status = "completed";
						weekData.weekInfo.isLock = false;
					}
					break;
			}
		}else{
			isPrevWeekDone = false;
			switch(weekData.weekInfo.status){
				case "notstarted":
					break;
				case "ongoing":
					if (weekData.weekAllTaskStatistic.onGoing) {
						isPrevWeekDone = false;
						weekData.weekInfo.isFinish = 0;
						weekData.weekInfo.status = "ongoing";
						weekData.weekInfo.isLock = false;
					}
					if (weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed) {
						isPrevWeekDone = true;
						weekData.weekInfo.isFinish = 1;
						weekData.weekInfo.status = "completed";
						weekData.weekInfo.isLock = false;
					}
					break;
				case "beoverdue":
					if (weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed) {
						isPrevWeekDone = true;
						weekData.weekInfo.isFinish = 1;
						weekData.weekInfo.status = "completed";
						weekData.weekInfo.isLock = false;
					}
					break;
			}
		}
		
		
 
		// 本周最近一次的直播
		
		let liveDateLast = '暂无直播';
		for(let element of weekData.weekLive){
			if(element.openCourseStartTime >= newDateSecond){
				liveDateLast = element.openCourseDate;
				break;
			}
		}


		// weekTask
		let isLive = false;
		let liveStatus = 0;
		let liveTime = '暂无直播';
		let liveDate = '暂无直播';
		let liveStatusText = '暂无直播';
		let isEvaluation = false;
		let evaluationId = '';
		let evaluationStatus = 0;

		if (weekData.weekTask && weekData.weekTask.length) {
			weekData.weekTask.forEach((weekTaskElement) => {
				if (weekTaskElement.taskType == "openCourse") {
					isLive = true;
					if (weekTaskElement.openCourseStartTime) {
						liveDate = iGlobal.getLocalTime(weekTaskElement.openCourseStartTime);
						liveTime = iGlobal.getDate(weekTaskElement.openCourseStartTime);
						if (weekTaskElement.state) {
							liveStatus = 1;
							liveStatusText = "直播已完成";
						} else {
							liveStatus = 2;
							if (weekTaskElement.progress) {
								liveStatusText = "直播未完成";
							} else {
								liveStatusText = "直播未开始";
							}
						}
					}

				} else if (weekTaskElement.taskType == "exam" && weekTaskElement.taskLevel == "appraisal") {
					isEvaluation = true;
					evaluationId = weekTaskElement.id;
					if (weekTaskElement.state) {
						evaluationStatus = 1;
					} else {
						evaluationStatus = 2;
					}
				}
			})
		}
		if (weekData.weekLive && weekData.weekLive.length) {
			// weekData.weekLiveStatistic
			weekData.weekLive.forEach((weekTaskElement) => {
				if (weekTaskElement.openCourseStartTime) {
					weekTaskElement.liveDate = iGlobal.getLocalTime(weekTaskElement.openCourseStartTime);
					weekTaskElement.liveTime = iGlobal.getDate(weekTaskElement.openCourseStartTime);
					if (weekTaskElement.state) {
						weekTaskElement.liveStatus = 1;
						weekTaskElement.liveStatusText = "直播已完成";
					} else {
						weekTaskElement.liveStatus = 2;
						if (weekTaskElement.progress) {
							weekTaskElement.liveStatusText = "直播未完成";
						} else {
							weekTaskElement.liveStatusText = "直播未开始";
						}
					}
				}
			});
		}
		// appraisalIdList
		if (weekData.weekAppraisal && weekData.weekAppraisal.length) {
			// weekData.weekLiveStatistic
			weekData.weekAppraisal.forEach((weekTaskElement) => {
				weekData.appraisalIdList.push(weekTaskElement.id);
			});
		}

		let weekTaskTotalTime = weekData.taskTypeStatistic.video.totalTime + weekData.taskTypeStatistic.appraisal.totalTime + weekData.taskTypeStatistic.exam.totalTime;
		let weekTaskStudyTime = weekData.taskTypeStatistic.video.studyTime + weekData.taskTypeStatistic.appraisal.studyTime + weekData.taskTypeStatistic.exam.studyTime;
		courseWeekPlanData.courseWeekPlan.push(weekData);
		
		let weekTitleArray = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九", "四十", "四十一", "四十二", "四十三", "四十四", "四十五", "四十六", "四十七", "四十八", "四十九", "五十", "五十一", "五十二", "五十三", "五十四", "五十五", "五十六", "五十七", "五十八", "五十九", "六十", "六十一", "六十二", "六十三", "六十四", "六十五", "六十六", "六十七", "六十八", "六十九", "七十", "七十一", "七十二", "七十三", "七十四", "七十五", "七十六", "七十七", "七十八", "七十九", "八十", "八十一", "八十二", "八十三", "八十四", "八十五", "八十六", "八十七", "八十八", "八十九", "九十", "九十一", "九十二", "九十三", "九十四", "九十五", "九十六", "九十七", "九十八", "九十九"]
		courseWeekPlanData.courseWeekPlanRenderData.push({
			'list': weekData.weekPlan,
			'weekId': element.id,
			'weekTask': weekData.weekTask,
			'weekLive': weekData.weekLive,
			'weekAppraisal': weekData.weekAppraisal,
			'appraisalIdList': weekData.appraisalIdList.toString(),
			'weekAllTaskStatistic': weekData.weekAllTaskStatistic,
			'weekTaskStatistic': weekData.taskTypeStatistic,

			'isOpen': weekData.weekInfo.isOpen,
			'isFinish': weekData.weekInfo.isFinish,
			'status': weekData.weekInfo.status,
			'weekStatus': weekData.weekInfo.status,
			'weekName': element.planTitle,
			'weekTitle': `第${weekTitleArray[index]}周`,
			// 'weekTitle': `第${weekTitleArray[element.index]}周`,
			'weekProgress': iGlobal.getProgress(weekData.weekAllTaskStatistic.completed, weekData.weekAllTaskStatistic.totalNum),
			'totalTime': weekTaskTotalTime,
			'totalTimeFormat': iGlobal.formatSeconds(weekTaskTotalTime, 'h'),
			'taskTime': weekTaskTotalTime,
			'taskTimeFormat': iGlobal.formatSeconds(weekTaskTotalTime, 'h'),
			'studyTime': weekData.weekAllTaskStatistic.studyTime,
			'studyTimeFormat': iGlobal.formatSeconds(weekData.weekAllTaskStatistic.studyTime, 'h'),
			'weekTime': `${iGlobal.getDate(element.startDate)}-${iGlobal.getDate(element.endDate)}`,
			'startDate': element.startDate,
			'startDateFormat': iGlobal.getDate(element.startDate),
			'endDate': element.endDate,
			'endDateFormat': iGlobal.getDate(element.endDate),

			'taskTotal': weekData.weekAllTaskStatistic.totalNum,
			'taskCompleted': weekData.weekAllTaskStatistic.completed,
			'taskOngoing': weekData.weekAllTaskStatistic.onGoing,
			'taskNotstarted': weekData.weekAllTaskStatistic.notStarted,

			'videoTotal': weekData.taskTypeStatistic.video.totalNum,
			'videoCompleted': weekData.taskTypeStatistic.video.completed,
			'videoOngoing': weekData.taskTypeStatistic.video.onGoing,
			'videoTime': weekData.taskTypeStatistic.video.totalTime,
			'videoTimeFormat': iGlobal.formatSeconds(weekData.taskTypeStatistic.video.studyTime, 'h'),
			'videoStudyTime': weekData.taskTypeStatistic.video.studyTime,
			'videoStudyTimeFormat': iGlobal.formatSeconds(weekData.taskTypeStatistic.video.studyTime, 'h'),
			'videoProgress': iGlobal.getProgress(weekData.taskTypeStatistic.video.completed, weekData.taskTypeStatistic.video.totalNum),
			'videoTimeProgress': iGlobal.getProgress(weekData.taskTypeStatistic.video.studyTime, weekData.taskTypeStatistic.video.totalTime),
			'videoTimePercentage': iGlobal.getProgress(weekData.taskTypeStatistic.video.studyTime, weekTaskStudyTime),

			'examTotal': weekData.taskTypeStatistic.exam.totalNum,
			'examCompleted': weekData.taskTypeStatistic.exam.completed,
			'examOngoing': weekData.taskTypeStatistic.exam.onGoing,
			'examProgress': iGlobal.getProgress(weekData.taskTypeStatistic.exam.completed, weekData.taskTypeStatistic.exam.totalNum),
			'examTime': weekData.taskTypeStatistic.exam.totalTime,
			'examTimeFormat': iGlobal.formatSeconds(weekData.taskTypeStatistic.exam.studyTime, 'h'),
			'examStudyTime': weekData.taskTypeStatistic.exam.studyTime,
			'examTimePercentage': iGlobal.getProgress(weekData.taskTypeStatistic.exam.studyTime, weekTaskStudyTime),

			'isEvaluation': isEvaluation,
			'evaluationId': evaluationId,
			'evaluationStatus': evaluationStatus,
			'evaluationTime': weekData.taskTypeStatistic.appraisal.totalTime,
			'evaluationTimeFormat': iGlobal.formatSeconds(weekData.taskTypeStatistic.appraisal.studyTime, 'h'),
			'evaluationTimePercentage': iGlobal.getProgress(weekData.taskTypeStatistic.appraisal.studyTime, weekTaskStudyTime),
			'isLock': weekData.weekInfo.isLock,
			'isLive': isLive,
			'liveStatus': liveStatus,
			'liveStatusText': liveStatusText,
			'liveTime': liveTime,
			'liveDate': liveDate,
			"liveDateLast": liveDateLast
		});
		// })
		
	}
	courseWeekStatistic(courseWeekPlanData);
	courseAllTaskStatistic(courseWeekPlanData);
	// return courseWeekPlanData;
	return {
		'isCoursePlan': "true",
		'planInfo': courseWeekPlanData.courseWeekPlanRenderData,
		'weekIngNum': courseWeekPlanData.courseStatistic.week.ingNum,
		"studyInfo": {
			"studyProgressTotal": iGlobal.getProgress(courseWeekPlanData.courseStatistic.task.completed, courseWeekPlanData.courseStatistic.task.totalNum)
		},
		'tasksSummary': {
			'total': courseWeekPlanData.courseStatistic.task.totalNum,
			'completed': courseWeekPlanData.courseStatistic.task.completed,
			'ongoing': courseWeekPlanData.courseStatistic.task.onGoing,
			'notstarted': courseWeekPlanData.courseStatistic.task.notStarted,
			'videoTime': courseWeekPlanData.courseStatistic.task.videoTime,
			'videoTimeFormat': iGlobal.formatSeconds(courseWeekPlanData.courseStatistic.task.videoTime, 'h'),
			'videoNum': courseWeekPlanData.courseStatistic.task.videoNum,
			'liveNum': courseWeekPlanData.courseStatistic.task.liveNum,
			'linkNum': courseWeekPlanData.courseStatistic.task.linkNum,
			'totalNum': courseWeekPlanData.courseStatistic.task.totalNum,
			'homeworkNum': courseWeekPlanData.courseStatistic.task.homeworkNum,
			'appraisalNum': courseWeekPlanData.courseStatistic.task.appraisalNum,
			'midtermNum': courseWeekPlanData.courseStatistic.task.midtermNum,
			'endNum': courseWeekPlanData.courseStatistic.task.endNum
		},
		'weeksSummary': {
			'dayTotal': courseWeekPlanData.courseStatistic.day.totalNum,
			'dayIngNum': courseWeekPlanData.courseStatistic.day.ingNum,
			'dayNoStartNum': courseWeekPlanData.courseStatistic.task.notStarted,
			'total': courseWeekPlanData.courseStatistic.week.totalNum,
			'weekIngNum': courseWeekPlanData.courseStatistic.week.ingNum,
			'beoverdue': courseWeekPlanData.courseStatistic.week.beoverdue,
			'completed': courseWeekPlanData.courseStatistic.week.completed,
			'ongoing': courseWeekPlanData.courseStatistic.week.onGoing,
			'notstarted': courseWeekPlanData.courseStatistic.week.notStarted
		}
	}
}


function taskStatistic(weekData, chapterData) {
	let newTasks = [];
	let chapterStudyTime = 0;
	let chapterTotalTime = 0;
	let chapterProgress = 0;
	let tasksTotalProgress = 0;

	chapterData.tasks.forEach((element, index) => {
		let isWeekTask = false;
		let taskType = element.taskType;
		if (taskType == "exam") {
			chapterData.tasks[index].taskTime = parseInt(element.taskTime) * 60
			// appraisal:测评,midterm:期中,end:期末,task:作业
			// practice:练习,core:核心,extension:扩展,backup:备份

			let taskLevel = element.taskLevel;
			if (taskLevel == "appraisal" || taskLevel == "midterm" || taskLevel == "end" || taskLevel == "task") {
				isWeekTask = true;
				taskType = taskLevel;
				// 一周多测评
				weekData.weekAppraisal.push(element);
			}
		} else if (taskType == "openCourse") {
			isWeekTask = true;
			chapterData.tasks[index].openCourseDate = iGlobal.getDate(element.openCourseStartTime);
			chapterData.tasks[index].openCourseText = `${element.title} ${iGlobal.getLocalTime(element.openCourseStartTime)} 开始`;
			// 一周多直播
			weekData.weekLive.push(element);
		}
		if (isWeekTask) {
			weekData.weekTask.push(element);

		} else {

			let studyTime = parseInt(element.studyTime);
			if (studyTime) {
				chapterStudyTime += studyTime;
			}
			let taskTime = parseInt(element.taskTime);
			if (taskTime) {
				chapterTotalTime += taskTime;
			}

			newTasks.push(element);
		}
		setTaskStatistic(weekData, element, taskType);
	})
	tasksTotalProgress = _.reduce(newTasks, function(result, value, key) {
		let percentage = 0;

		if (value.state) {
			percentage = 100;
		} else {
			if (value.percentage >= 90) {
				percentage = 100;
			} else if (0 < value.percentage && value.percentage < 90) {
				percentage = value.percentage;
			}
		}

		result.percentage += percentage;
		return result;
	}, {
		'percentage': 0
	}).percentage;

	let tasksLength = newTasks.length ? newTasks.length : 0;
	// console.log(tasksTotalProgress+";;"+tasksLength+':::'+Math.round(tasksTotalProgress / tasksLength))
	// 章节学习进度
	chapterData.progress = Math.round(tasksTotalProgress / tasksLength) || 0;
	chapterData.chapterStudyTime = chapterStudyTime;
	chapterData.chapterTotalTime = chapterTotalTime;
	// chapterData.studyProgress = iGlobal.getProgress(chapterStudyTime, chapterTotalTime);

	// chapterData.oldTasks = chapterData.tasks;
	chapterData.tasks = newTasks;
}

function setTaskStatistic(weekData, task, taskType) {
	let weekTask = weekData.taskTypeStatistic[taskType];
	if (weekTask) {
		let studyTime = parseInt(task.studyTime);
		let taskTime = parseInt(task.taskTime);
		weekTask.totalNum++;
		weekTask.studyTime += studyTime;
		weekTask.totalTime += taskTime;
		if (task.state) {
			weekTask.completed++;
		} else {
			if (task.progress) {
				weekTask.onGoing++;
			} else {
				weekTask.notStarted++;
			}
		}
	}
}

function setWeekStatistic(weekData) {
	weekData.weekAllTaskStatistic = _.reduce(weekData.taskTypeStatistic, function(result, value, key) {
		result.totalTime += value.totalTime;
		result.studyTime += value.studyTime;
		result.totalNum += value.totalNum;
		result.completed += value.completed;
		result.onGoing += value.onGoing;
		result.notStarted += value.notStarted;
		return result
	}, {
		'totalTime': 0, // 总时间
		'studyTime': 0, // 学习时间
		'totalNum': 0, // 总数
		'completed': 0, // 完成数
		'onGoing': 0, // 进行数
		'notStarted': 0 // 未开始数
	});
}

function courseWeekStatistic(courseWeekPlanData) {
	courseWeekPlanData.courseWeekPlan.forEach((element, index) => {
		if (element.weekInfo && element.weekInfo.status) {
			switch (element.weekInfo.status) {
				case "notstarted": // 未开始
					courseWeekPlanData.courseStatistic.week.notStarted++;
					break;
				case "completed": // 完成
					courseWeekPlanData.courseStatistic.week.completed++;
					break;
				case "ongoing": // 进行中
					courseWeekPlanData.courseStatistic.week.onGoing++;
					break;
				case "beoverdue": // 逾期
					courseWeekPlanData.courseStatistic.week.beoverdue++;
					break;
			}
		} else {

		}

	})
}

function courseAllTaskStatistic(courseWeekPlanData) {
	courseWeekPlanData.courseStatistic.task = _.reduce(courseWeekPlanData.courseWeekPlan, function(result, value, key) {
		if (value.weekAllTaskStatistic && value.weekAllTaskStatistic.totalTime) {
			if (value.weekAllTaskStatistic.totalTime) {
				result.totalTime += value.weekAllTaskStatistic.totalTime;
			}
			if (value.weekAllTaskStatistic.studyTime) {
				result.studyTime += value.weekAllTaskStatistic.studyTime;
			}
			if (value.weekAllTaskStatistic.totalNum) {
				result.totalNum += value.weekAllTaskStatistic.totalNum;
			}
			if (value.weekAllTaskStatistic.completed) {
				result.completed += value.weekAllTaskStatistic.completed;
			}
			if (value.weekAllTaskStatistic.onGoing) {
				result.onGoing += value.weekAllTaskStatistic.onGoing;
			}
			if (value.weekAllTaskStatistic.notStarted) {
				result.notStarted += value.weekAllTaskStatistic.notStarted;
			}
		}
		if (value.taskTypeStatistic) {
			if (value.taskTypeStatistic.video) {
				result.videoTime += value.taskTypeStatistic.video.totalTime;
			}
			if (value.taskTypeStatistic.video) {
				result.videoNum += value.taskTypeStatistic.video.totalNum;
			}
			if (value.taskTypeStatistic.openCourse) {
				result.liveNum += value.taskTypeStatistic.openCourse.totalNum;
			}
			if (value.taskTypeStatistic.link) {
				result.linkNum += value.taskTypeStatistic.link.totalNum;
			}
			if (value.taskTypeStatistic.exam) {
				result.homeworkNum += value.taskTypeStatistic.exam.totalNum;
			}
			if (value.taskTypeStatistic.appraisal) {
				result.appraisalNum += value.taskTypeStatistic.appraisal.totalNum;
			}
			if (value.taskTypeStatistic.midterm) {
				result.midtermNum += value.taskTypeStatistic.midterm.totalNum;
			}
			if (value.taskTypeStatistic.end) {
				result.endNum += value.taskTypeStatistic.end.totalNum;
			}
		}

		return result;
	}, {
		'name': "任务统计", // 所有任务统计
		'totalTime': 0, // 总时间
		'studyTime': 0, // 学习时间
		'totalNum': 0, // 总数
		'completed': 0, // 完成数
		'onGoing': 0, // 进行数
		'notStarted': 0, // 未开始数

		'videoTime': 0,
		'videoNum': 0,
		'liveNum': 0,
		'linkNum': 0,
		'homeworkNum': 0,
		'appraisalNum': 0,
		'midtermNum': 0,
		'endNum': 0
	});
}

function getExamSummary(examLevel, examSummary) { //试卷个数统计
	if (examSummary[examLevel]) {
		examSummary[examLevel]++;
	} else {
		examSummary[examLevel] = 1;
	}
}

function courseByInFo(coursestatus) {
	let lockStatus = false;
	let courseActiveTime = 0;
	let courseExpirationTime = 0;
	let courseActiveState = 0;
	let courseActiveStateText = "默认未购买";
	if (coursestatus && coursestatus.length) {
		var lockStatusNum = 0;
		for (var i = 0; i < coursestatus.length; i++) {
			if (coursestatus[i].lockStatus == 0) {
				lockStatusNum++;
			}
		}
		if (!lockStatusNum) {
			lockStatus = true;
		}

		for (var i = 0; i < coursestatus.length; i++) {
			if (coursestatus[i].isExpiration == "false" && coursestatus[i].activeState == "acitve") {
				courseActiveTime = coursestatus[i].activeTime;
				courseExpirationTime = coursestatus[i].expirationTime;
			}
		}
		var datanow = (new Date().getTime()) / 1000; //当前时间戳
		for (var i = 0; i < coursestatus.length; i++) {
			if (coursestatus[i].activeState == "acitve" && coursestatus[i].expirationTime > datanow && courseActiveState < 3) {
				courseActiveState = "3"; //已激活未过期
				courseActiveStateText = "已激活未过期";
				break;
			} else if (coursestatus[i].activeState == "init" && courseActiveState < 2) {
				courseActiveState = "2"; //未激活
				courseActiveStateText = "未激活";
			} else if (coursestatus[i].activeState == "acitve" && coursestatus[i].expirationTime < datanow && courseActiveState < 1) {
				courseActiveState = "1"; //已激活已过期
				courseActiveStateText = "已激活已过期";
			}
		}
		if (courseActiveState && lockStatus) {
			courseActiveState = "4"; //课程已锁定
			courseActiveStateText = "课程已锁定";
		}
		courseActiveState = courseActiveState;
	} else {

	}
	var day = (parseInt((courseExpirationTime - datanow) / (24 * 60 * 60)) + 1).toString();
	if (day.length == 1) {
		day = "00" + day;
	} else if (day.length == 2) {
		day = "0" + day;
	} else if (day.length == 3) {

	} else {

	}
	let dayArray = day.split('');
	return {
		lockStatus: lockStatus,
		courseActiveTime: iGlobal.getDate(courseActiveTime * 1000),
		courseExpirationTime: iGlobal.getDate(courseExpirationTime * 1000),
		countDown: day,
		countDownArray: dayArray,
		courseActiveState: courseActiveState,
		courseActiveStateText: courseActiveStateText
	}
}

function filterExamDate(courseId, examDate) {
	var data = {};
	var days = -1;
	if (examDate && examDate.length) {
		for (var i = 0; i < examDate.length; i++) {
			if (courseId == examDate[i].id) {
				data = examDate[i];
				days = parseInt((new Date().getTime() - data.examinationDate) / (24 * 60 * 60 * 1000));
			}
		}
	}
	if (days < 0) {
		return "本科目考试时间未确定";
	} else if (days == 0) {
		return "请留意,本科目<strong>今天</strong>开始考试";
	} else {
		return "距本科目考试还有<strong>" + days + "</strong>天";
	}
}

function filterCourseInfo(courseDetail) {
	let courseInfo = {}
	if (courseDetail) {
		let availability = courseDetail.availability;
		if (availability) {
			availability = iGlobal.entities(courseDetail.availability)
		} else {
			availability = "暂无课程通知"
		}
		courseInfo = {
			categoryName: courseDetail.categoryName,
			categoryId: courseDetail.categoryId,
			subjectName: courseDetail.subjectName,
			subjectId: courseDetail.subjectId,
			courseName: courseDetail.courseName,
			courseId: courseDetail.courseId,
			courseImage: constant.host.static + courseDetail.coverPath,
			expirationTime: courseDetail.effectiveDay,
			availability: availability,
			versionId: courseDetail.versionId
		};
		// let courseModel = JSON.parse(courseDetail.courseModel);
		// if (courseModel && courseModel.length) {
		// 	courseInfo.courseModel = courseDetail.courseModel;
		// 	courseInfo.img = constant.host.static + courseDetail.coverPath;
		// 	courseInfo.video = courseDetail.firstVideo;
		// }
	}

	return courseInfo;
}

function filterLastLearnChapter(courseDetailList, taskProgress) {
	let lastLearnChapter = '';
	let isLastLearn = false;
	let title = '暂无课程任务';
	let chapterId = '';
	let chapterName = '';
	let taskId = '';
	let taskName = '';
	let chapterList = [];
	let taskType = '';
	let thisChapterTask = '';
	let progress = -1;
	if (taskProgress && taskProgress.length) {
		isLastLearn = true;
		lastLearnChapter = _.maxBy(taskProgress, 'createDate');
		title = lastLearnChapter.chapterName;
		chapterId = lastLearnChapter.chapterId;
		chapterName = lastLearnChapter.chapterName;
		taskId = lastLearnChapter.taskId;
		taskName = lastLearnChapter.taskName;
		progress = lastLearnChapter.progress;
		chapterList = _.find(courseDetailList, (o) => {
			return o.chapterId == lastLearnChapter.chapterId;
		})
		if(chapterList && chapterList.tasks && chapterList.tasks.length){
			thisChapterTask = _.find(chapterList.tasks, (o) => {
				return o.taskId == lastLearnChapter.taskId;
			})
			if (thisChapterTask) {
				taskType = thisChapterTask.taskType ? thisChapterTask.taskType : '';
			}
		}
	}
	if (!thisChapterTask) {
		isLastLearn = false;
		let index = _.findIndex(courseDetailList, ['isTasks', true]);
		if (index > 0) {
			lastLearnChapter = courseDetailList[index];
			title = "开始学习本课程";
			chapterId = lastLearnChapter.chapterId;
			chapterName = lastLearnChapter.chapterName;
			taskId = lastLearnChapter.tasks[0].taskId;
			taskName = lastLearnChapter.tasks[0].title;
			progress = 0;
			chapterList = lastLearnChapter;
			taskType = lastLearnChapter.tasks[0].taskType
		}
	}
	return {
		isLastLearn: isLastLearn,
		title: title,
		chapterId: chapterId,
		chapterName: chapterName,
		taskId: taskId,
		taskName: taskName,
		progress: progress,
		chapterList: chapterList.tasks,
		taskType: taskType
	}
}

function getCoursePlanDetailType(ctx){
	let type = "mobile";
	// console.log(ctx.userAgent)
	// console.log(ctx.host)
	if(ctx.userAgent.isDesktop){
		switch(ctx.host){
			case "localhost:3080":
			case "localhost:3030":
			case "elearningdev.zbgedu.com":
			case "elearningdemo.zbgedu.com":
			case "elearning.zbgedu.com":
				type = "element";
				break;
			case "localhost:3000":
			case "tmdev.zbgedu.com":
			case "tmdemo.zbgedu.com":
			case "tm.zbgedu.com":
				type = "tm";
				break;
		}
	}
	return type;
}

module.exports = {
	ezCoursePlanDetail,
	getCoursePlanDetailType
}