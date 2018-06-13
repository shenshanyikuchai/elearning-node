const _ = require('lodash');
const iGlobal = require('../../global');
const constant = require('../../global/constant');
var {
	resCourseDetail
} = require('../../resData/courseDetail');
var globalCourseDetail = {};

// format 
// iGlobal.formatSeconds(studyTime,'h')

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

function coursePlanDetail(payload) {
	initData();
	globalCourseDetail = { ...globalCourseDetail,
		...payload
	};
	flatCourseDetail({
		chapters: globalCourseDetail.courseDetail.chapters
	})
	globalCourseDetail.lastLearn = filterLastLearnChapter(globalCourseDetail.courseDetailListBack, payload.tasksProgress);

	if (globalCourseDetail.coursePlan && globalCourseDetail.coursePlan.length) {
		let courseWeekPlan = getCourseWeekPlan(globalCourseDetail.courseDetailList, globalCourseDetail.coursePlan);
		globalCourseDetail = { ...globalCourseDetail,
			...courseWeekPlan
		}
		// globalCourseDetail.courseWeekPlan = courseWeekPlan.courseWeekPlan;
		// globalCourseDetail.courseStatistic = courseWeekPlan.courseStatistic;
	}

	globalCourseDetail.courseStatus = courseByInFo(payload.courseactivestatus);
	globalCourseDetail.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	globalCourseDetail.courseInfo = filterCourseInfo(payload.courseDetail);


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

	}
}

function flatCourseDetail(payload) { // 将多层课程结构转换为一层结构
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

		// if (payload.level > 1) {
		// 	payload.rootNode = payload.oldNode;
		// 	payload.newNode = payload.node + '-' + index;
		// 	payload.item = payload.item + index.toString();

		// 	payload.orderList = (payload.orderList) + index;

		// } else {
		// 	payload.newNode = index.toString();
		// 	payload.node = index.toString();
		// 	payload.rootNode = index.toString();
		// 	payload.orderList = index * 100;
		// 	payload.item = index.toString();
		// }
		let nodeData = {
			level: payload.level, // 层级
			rootNode: payload.rootNode, // 根节点
			parentNode: payload.node, // 父节点
			node: payload.newNode, // 节点
			orderList: payload.orderList,
			isFree: element.isFree, // 是否免费
			title: element.chapterTitle, // 章节标题
			chapterId: element.chapterId, // 章节id
			// 'isChildren' : "true", // 是否有子节点
			// 'isTasks' : false, // 是否有任务
			// 'checked' : true, // 是否点击
			// 'activeClass' : true, // 是否展开
			// 'showClass' : true // 是否显示
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
		newTasks.push({
			...task,
			...thisTaskProgress,
			categoryId: globalCourseDetail.courseDetail.categoryId,
			categoryName: globalCourseDetail.courseDetail.categoryName,
			subjectId: globalCourseDetail.courseDetail.subjectId,
			subjectName: globalCourseDetail.courseDetail.subjectName,
			courseId: globalCourseDetail.courseDetail.courseId,
			courseName: globalCourseDetail.courseDetail.courseName,
			chapterId: chapter.chapterId,
			chapterTitle: chapter.chapterTitle,
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
		// let total = 0;
		// if (taskElement.taskType == "video") {
		// 	total = parseInt(taskElement.videoTime);
		// } else if (taskElement.taskType == "exam") {
		// 	total = parseInt(taskElement.totalCount);
		// } else if (taskElement.taskType == "knowledgePointExercise") {
		// 	total = parseInt(taskElement.totalCount);
		// }
		taskProgress = {
			studyTime: activeTask.taskStudyTotalTime,
			state: activeTask.state,
			progress: activeTask.progress,
			total: activeTask.total,
			percentage: iGlobal.getProgress(activeTask.progress, taskElement.taskTime)
		}
	}
	return taskProgress;
}

function getCourseWeekPlan(courseDetail, coursePlan) { // 根据计划划分课程结构
	// let statistic = {
	// 	'totalNum' : 0, // 总数
	// 	'ingNum' : 0, // 正在进行数
	// 	'beoverdue' : 0, // 逾期数
	// 	'completed' : 0, // 完成数
	// 	'onGoing' : 0, // 进行数
	// 	'notStarted' : 0, // 未开始数
	// }
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
		/*
		taskStatistics : {
			video : {
				'name' : '课程视频统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			video : {
				'name' : '课程试题统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			knowledgePoint : {
				'name' : '课程知识点统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			openCourse : {
				'name' : '课程公开课统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			appraisal : {
				'name' : '课程测评统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			midterm : {
				'name' : '课程期中统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			},
			end : {
				'name' : '课程期末统计',
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdueNum' : 0, // 逾期数
				'completedNum' : 0, // 完成数
				'onGoingNum' : 0, // 进行数
				'notStartedNum' : 0 // 未开始数
			}
		}
		*/
	}

	let weekStartTime = coursePlan[0].startDate; // 计划开始时间
	let newDate = new Date().getTime(); // 现在时间
	let coursePlanWeekNum = coursePlan.length; // 学习计划周数
	courseWeekPlanData.courseStatistic.week.totalNum = coursePlanWeekNum;
	courseWeekPlanData.courseStatistic.day.totalNum = coursePlanWeekNum * constant.weekDay;

	if (weekStartTime < newDate) {
		courseWeekPlanData.courseStatistic.day.ingNum = Math.ceil((newDate - weekStartTime) / constant.dayTime);
	} else if (newDate < weekStartTime) {
		courseWeekPlanData.courseStatistic.day.notStarted = Math.ceil((weekStartTime - newDate) / constant.dayTime);
	}

	_.forEach(coursePlan, (element, index) => {
		let startIndex = _.findIndex(courseDetail, (o) => { // 周开始章节节点
			return o.chapterId == element.startCategoryId;
		})
		let endIndex = _.findIndex(courseDetail, (o) => { // 周结束章节节点
			return o.chapterId == element.endCategoryId;
		})
		// 找不到开始章节或者结束章节
		if (startIndex == -1) {
			courseWeekPlanData.courseWeekPlan.push("找不到开始章节");
			return false;
		}
		if (endIndex == -1) {
			courseWeekPlanData.courseWeekPlan.push("找不到结束章节");
			return false;
		}
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
			weekInfo: { // 周基础信息
				'isOpen': "true", // 周计划是否开启
				'isFinish': 0, // 周任务是否完成
				'status': '', // 周状态描述
			},
			weekAllTaskStatistic: {
				...weekStatistic
			},
			taskTypeStatistic: {
				video: {
					'name': "周视频统计",
					...weekStatistic
				},
				exam: {
					'name': "周试题统计",
					...weekStatistic
				},
				knowledgePoint: {
					'name': "周知识点统计",
					...weekStatistic
				},
				openCourse: {
					'name': "周公开课统计",
					...weekStatistic
				},
				link: {
					'name': "周外链统计",
					...weekStatistic
				},
				appraisal: {
					'name': "周测评统计",
					...weekStatistic
				},
				midterm: {
					'name': "周期中统计",
					...weekStatistic
				},
				end: {
					'name': "周期末统计",
					...weekStatistic
				}
			}
		}


		let weekStartTime = element.startDate; // 周开始时间
		let weekEndTime = (element.endDate + constant.dayTime); // 周结束时间
		if (weekStartTime < newDate && weekEndTime < newDate) {
			weekData.weekInfo.status = "beoverdue";
		} else if (weekStartTime < newDate && newDate < weekEndTime) {
			courseWeekPlanData.courseStatistic.week.ingNum = index;
			weekData.weekInfo.status = "ongoing";
		}
		if (newDate < weekStartTime && newDate < weekEndTime) {
			weekData.weekInfo.isOpen = "false";
			weekData.weekInfo.status = "notstarted";
		}


		for (let i = startIndex; i <= endIndex; i++) {
			let thisItem = courseDetail[i];


			// orderListArray.push(((index + 1) * 1000000) + thisItem.orderList)
			thisItem.orderList = ((index + 1) * 1000000) + thisItem.orderList;
			if (thisItem.tasks && thisItem.tasks.length) {
				taskStatistic(weekData, thisItem);
			}
			weekData.weekPlan.push(thisItem);
		}
		setWeekStatistic(weekData);

		if (weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed && weekData.weekInfo.status !== "notstarted") {
			weekData.weekInfo.isFinish = 1;
			weekData.weekInfo.status = "completed";
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
		let weekTaskTotalTime = weekData.taskTypeStatistic.video.totalTime + weekData.taskTypeStatistic.appraisal.totalTime + weekData.taskTypeStatistic.exam.totalTime;
		let weekTaskStudyTime = weekData.taskTypeStatistic.video.studyTime + weekData.taskTypeStatistic.appraisal.studyTime + weekData.taskTypeStatistic.exam.studyTime;
		courseWeekPlanData.courseWeekPlan.push(weekData);
		courseWeekPlanData.courseWeekPlanRenderData.push({
			'list': weekData.weekPlan,
			'weekTask': weekData.weekTask,
			'isOpen': weekData.weekInfo.isOpen,
			'isFinish': weekData.weekInfo.isFinish,
			'status': weekData.weekInfo.status,
			'weekStatus': weekData.weekInfo.status,
			'weekName': element.planTitle,
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

			'isLive': isLive,
			'liveStatus': liveStatus,
			'liveStatusText': liveStatusText,
			'liveTime': liveTime,
			'liveDate': liveDate
		});
	})
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
			// appraisal:测评,midterm:期中,end:期末,
			// practice:练习,core:核心,extension:扩展,backup:备份
			let taskLevel = element.taskLevel;
			if (taskLevel == "appraisal" || taskLevel == "midterm" || taskLevel == "end") {
				isWeekTask = true;
				taskType = taskLevel;
			}
		} else if (taskType == "openCourse") {
			isWeekTask = true;
			chapterData.tasks[index].openCourseDate = iGlobal.getDate(element.openCourseStartTime);
			chapterData.tasks[index].openCourseText = `${element.title} ${iGlobal.getLocalTime(element.openCourseStartTime)} 开始`;
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
			if (value.progress >= 90) {
				percentage = 100;
			} else if (0 < value.progress && value.progress < 90) {
				percentage = value.percentage;
			}
		}

		result.percentage += percentage;
		return result;
	}, {
		'percentage': 0
	}).percentage;

	let tasksLength = newTasks.length ? newTasks.length : 0;
	chapterData.progress = Math.round(tasksTotalProgress / tasksLength);

	chapterData.chapterStudyTime = chapterStudyTime;
	chapterData.chapterTotalTime = chapterTotalTime;
	// chapterData.studyProgress = iGlobal.getProgress(chapterStudyTime, chapterTotalTime);

	chapterData.oldTasks = chapterData.tasks;
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
	})
}

function courseAllTaskStatistic(courseWeekPlanData) {
	courseWeekPlanData.courseStatistic.task = _.reduce(courseWeekPlanData.courseWeekPlan, function(result, value, key) {
		result.totalTime += value.weekAllTaskStatistic.totalTime;
		result.studyTime += value.weekAllTaskStatistic.studyTime;
		result.totalNum += value.weekAllTaskStatistic.totalNum;
		result.completed += value.weekAllTaskStatistic.completed;
		result.onGoing += value.weekAllTaskStatistic.onGoing;
		result.notStarted += value.weekAllTaskStatistic.notStarted;

		result.videoTime += value.taskTypeStatistic.video.totalTime;
		result.videoNum += value.taskTypeStatistic.video.totalNum;
		result.liveNum += value.taskTypeStatistic.openCourse.totalNum;
		result.linkNum += value.taskTypeStatistic.link.totalNum;
		result.homeworkNum += value.taskTypeStatistic.exam.totalNum;
		result.appraisalNum += value.taskTypeStatistic.appraisal.totalNum;
		result.midtermNum += value.taskTypeStatistic.midterm.totalNum;
		result.endNum += value.taskTypeStatistic.end.totalNum;
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
			availability: availability
		};
		let courseModel = JSON.parse(courseDetail.courseModel);
		if (courseModel && courseModel.length) {
			courseInfo.courseModel = courseDetail.courseModel;
			courseInfo.img = constant.host.static + courseDetail.coverPath;
			courseInfo.video = courseDetail.firstVideo;
		}
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
		thisChapterTask = _.find(chapterList.tasks, (o) => {
			return o.taskId == lastLearnChapter.taskId;
		})
		if (thisChapterTask) {
			taskType = thisChapterTask.taskType ? thisChapterTask.taskType : '';
		}

	}
	if (!thisChapterTask) {
		isLastLearn = false;
		let index = _.findIndex(courseDetailList, ['isTasks', true]);
		if (index) {
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


module.exports = {
	coursePlanDetail
}