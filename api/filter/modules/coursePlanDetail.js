const _ = require('lodash');
const iGlobal = require('../../global');
const constant = require('../../global/constant');
var { resCourseDetail } = require('../../resData/courseDetail');
var globalCourseDetail = {};

// format 
// iGlobal.formatSeconds(studyTime,'h')

function studycenterCoursePlanDetail(payload){
	// 初始化数据
	initData();
	globalCourseDetail = {...globalCourseDetail, ...payload};
	flatCourseDetail({
		chapters : globalCourseDetail.courseDetail.chapters
	})
	let courseWeekPlan = {};
	if(globalCourseDetail.coursePlan && globalCourseDetail.coursePlan.length){
		courseWeekPlan = getStudycenterCourseWeekPlan(globalCourseDetail.courseDetailList, globalCourseDetail.coursePlan);
	}else{
		courseWeekPlan = {
			'isCoursePlan' : "false",
			'planInfo' : [],
			'chapterList' : globalCourseDetail.courseDetailList
		}
	}
	courseWeekPlan.courseStatus = courseByInFo(payload.courseactivestatus);
	courseWeekPlan.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	courseWeekPlan.courseInfo = filterCourseInfo(payload.courseDetail);
	courseWeekPlan.lastLearn = filterLastLearnChapter(payload.tasksProgress);
	return courseWeekPlan;
}

function initData(){ // 初始化数据
	globalCourseDetail = {
		courseDetail : {}, // 课程详情
		tasksProgress : {}, // 任务进度
		coursePlan : {}, // 课程计划
		courseStatus : {}, // 课程状态 
		examDate : {}, // 考试时间
		courseDetailList : [],// 存储 将多层课程结构转换为一层结构 的数据
		weekIngNum : 0 // 当前进行的周
	}
}
function coursePlanDetail(payload){
	// 初始化数据
	initData();
	globalCourseDetail = {...globalCourseDetail, ...payload};
	// filterCourseDetail(payload.courseDetail.chapters);
	// addTaskProgress(payload.tasksProgress);
	// courseRenderData = getChapterListWeekList(payload.memberGetplan);

	// // formatCourseDetail(courseRenderData);
	// courseRenderData.courseStatus = courseByInFo(payload.courseactivestatus);
	// courseRenderData.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	// courseRenderData.courseInfo = filterCourseInfo(payload.courseDetail);
	// courseRenderData.lastLearn = filterLastLearnChapter(payload.tasksProgress);
	flatCourseDetail({
		chapters : globalCourseDetail.courseDetail.chapters
	})
	let courseWeekPlan = {};
	if(globalCourseDetail.coursePlan && globalCourseDetail.coursePlan.length){
		courseWeekPlan = getCourseWeekPlan(globalCourseDetail.courseDetailList, globalCourseDetail.coursePlan);
	}else{
		courseWeekPlan = {
			'isCoursePlan' : "false",
			'planInfo' : [],
			'chapterList' : globalCourseDetail.courseDetailList
		}
	}
	courseWeekPlan.courseStatus = courseByInFo(payload.courseactivestatus);
	courseWeekPlan.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	courseWeekPlan.courseInfo = filterCourseInfo(payload.courseDetail);
	courseWeekPlan.lastLearn = filterLastLearnChapter(payload.tasksProgress);
	return courseWeekPlan;
}
function flatCourseDetail(payload){ // 将多层课程结构转换为一层结构
	payload.level ? payload.level++ : payload.level = 1;
	_.forEach(payload.chapters,(element, index) => {
		payload.rootNode = '';
		payload.newNode = '';

		if(payload.level>1){
			payload.rootNode = payload.oldNode;
			payload.newNode = payload.node + '-' + index;
		}else{
			payload.newNode = index.toString();
			payload.node = index.toString();
			payload.rootNode = index.toString();
		}
		let nodeData = {
			'level' : payload.level, // 层级
			'rootNode' : payload.rootNode, // 根节点
			'parentNode' : payload.node, // 父节点
			'node' : payload.newNode, // 节点
			'isFree' : element.isFree, // 是否免费
			'title' : element.chapterTitle, // 章节标题
			'chapterId' : element.chapterId, // 章节id
			'isChildren' : "true", // 是否有子节点
			'isTasks' : false, // 是否有任务
			// 'checked' : true, // 是否点击
			// 'activeClass' : true, // 是否展开
			// 'showClass' : true // 是否显示
		}
		let nodeDataTasks = {};
		if(element.tasks && element.tasks.length){
			nodeData.isTasks = true;
			nodeDataTasks = flatCourseTasks(element);
		}
		globalCourseDetail.courseDetailList.push({...nodeData, ...nodeDataTasks});
		if(element.children && element.children.length){
			flatCourseDetail({
				chapters : element.children,
				level : payload.level,
				node : payload.newNode,
				oldNode : payload.node,
				rootNode : payload.rootNode
			})
		}
	})
}
function flatCourseTasks(chapter){ // 添加章节任务数据
	let tasks = chapter.tasks;
	_.forEach(tasks, (element, index) => {
		var thisTaskProgress = getTaskProgress(element);
		tasks[index] = {
			...element,
			...thisTaskProgress,
			categoryId : globalCourseDetail.courseDetail.categoryId,
			categoryName : globalCourseDetail.courseDetail.categoryName,
			subjectId : globalCourseDetail.courseDetail.subjectId,
			subjectName : globalCourseDetail.courseDetail.subjectName,
			courseId : globalCourseDetail.courseDetail.courseId,
			courseName : globalCourseDetail.courseDetail.courseName,
			chapterId : chapter.chapterId,
			chapterTitle : chapter.title,
			isFree : chapter.isFree
		};
	})
	return {
		'tasks' : tasks
	}
}
function getExamSummary(examLevel, examSummary){ //试卷个数统计
	if(examSummary[examLevel]){
		examSummary[examLevel]++;
	}else{
		examSummary[examLevel] = 1;
	}
}
function getTaskProgress(taskElement){ // 给任务注入任务进度
	let taskProgress = {
		studyTime : 0, // 学习时长
		state : 0, // 任务状态
		progress : -1, // 任务进度
		total : 0, // 任务总长度
		percentage : 0 // 任务百分比
	}
	let activeTask = _.find(globalCourseDetail.tasksProgress, (o) => {
		return o.taskId == taskElement.taskId;
	})
	if(activeTask){
		taskProgress = {
			studyTime : activeTask.taskStudyTotalTime,
			state : activeTask.state,
			progress : activeTask.progress,
			total : activeTask.total,
			percentage : iGlobal.getPercentage(activeTask).progress
		}
	}
	return taskProgress;
}
function getStudycenterCourseWeekPlan(courseDetail, coursePlan){ // 根据计划划分课程结构
	let courseWeekPlanData = {
		isCoursePlan : "true",
		courseWeekPlan : [], // 课程计划周列表
		courseStatistic : {
			week : {
				'name' : "课程周统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			},
			day : {
				'name' : "课程天统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			},
			task : {
				'name' : "课程任务统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			}
		},
		// taskStatistics : {
		// 	video : {
		// 		'name' : '课程视频统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	video : {
		// 		'name' : '课程试题统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	knowledgePoint : {
		// 		'name' : '课程知识点统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	openCourse : {
		// 		'name' : '课程公开课统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	appraisal : {
		// 		'name' : '课程测评统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	midterm : {
		// 		'name' : '课程期中统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	end : {
		// 		'name' : '课程期末统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	}
		// }
	}

	let weekStartTime = coursePlan[0].startDate;
	let newDate = new Date().getTime();

	courseWeekPlanData.courseStatistic.week.totalNum = coursePlan.length;
	courseWeekPlanData.courseStatistic.day.totalNum = courseWeekPlanData.courseStatistic.week.totalNum*constant.weekDay;

	if(weekStartTime < newDate){
		courseWeekPlanData.courseStatistic.day.ingNum = Math.ceil((newDate-weekStartTime)/constant.dayTime);
	}else if(newDate < weekStartTime){
		courseWeekPlanData.courseStatistic.day.notStarted = Math.ceil((weekStartTime-newDate)/constant.dayTime);
	}

	_.forEach(coursePlan, (element, index) => {
		let startIndex = _.findIndex(courseDetail, (o) => { // 周开始章节节点
			return o.chapterId == element.startCategoryId;
		})
		let endIndex = _.findIndex(courseDetail, (o) => { // 周结束章节节点
			return o.chapterId == element.endCategoryId;
		})
		// 找不到开始章节或者结束章节
		if(startIndex == -1 || endIndex == -1){
			courseWeekPlanData.courseWeekPlan = "找不到开始章节或者结束章节";
			return courseWeekPlanData.courseWeekPlan;
		}
		let weekData = {
			weekPlan : [], // 周计划详情
			weekTask : [], // 周任务
			weekInfo : { // 周基础信息
				'isOpen' : "true", // 周计划是否开启
				'status' : '', // 周状态描述
				'state' : 0, // 周是否完成
			},
			weekStatistic : {
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			weekAllTaskStatistic : {
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			taskStatistic : {
				video : {
					'name' : "周视频统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				exam : {
					'name' : "周试题统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				knowledgePoint : {
					'name' : "周知识点统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				openCourse : {
					'name' : "周公开课统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				appraisal : {
					'name' : "周测评统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				midterm : {
					'name' : "周期中统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				end : {
					'name' : "周期末统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				}
			}
		}
		// let liveStatus = 0;
		// let liveTime = '暂无直播';
		// let liveStatusText = '';

		let weekStartTime = element.startDate;
		let weekEndTime = (element.endDate + constant.dayTime);

		if(weekStartTime < newDate && weekEndTime < newDate){
			weekData.weekInfo.status = "beoverdue";
			weekData.weekStatistic.beoverdue++;
		}else if(weekStartTime < newDate && newDate < weekEndTime){
			weekIngNum = index;
			weekData.weekInfo.status = "ongoing";
			weekData.weekStatistic.onGoing++;
		}if(newDate < weekStartTime && newDate < weekEndTime){
			weekData.weekInfo.isOpen = "false";
			weekData.weekInfo.status = "notstarted";
			weekData.weekStatistic.notStarted++;
		}
		for (let i = startIndex; i <= endIndex; i++) {
			let thisItem = courseDetail[i];
		  if(thisItem.tasks && thisItem.tasks.length){
		  	taskStatistic(weekData, thisItem);
		  }
		  weekData.weekPlan.push(thisItem);
		}
		weekStatistic(weekData);

		if(weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed && weekData.weekInfo.status !== "notstarted"){
			weekData.weekInfo.state = 1;
			weekData.weekInfo.status = "completed";
			weekData.weekStatistic.completed++;
		}

		// let studyTimeTotal = weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime;
		// let evaluationTimePercentage = iGlobal.getProgress(weekEvaluationStudyTime,studyTimeTotal);
		// let examTimePercentage = iGlobal.getProgress(weekExamStudyTime,studyTimeTotal);
		// let videoTimePercentage = iGlobal.getProgress(weekVideoStudyTime,studyTimeTotal);

		// weekLiveDate
		// if(weekTask && weekTask.length){
		// 	weekTask.forEach((weekTaskElement) => {
		// 		if(weekTaskElement.taskType == "openCourse"){
		// 			if(weekTaskElement.openCourseStartTime){
		// 				weekLiveDate = iGlobal.getLocalTime(weekTaskElement.openCourseStartTime);
		// 				liveTime = iGlobal.getDate(weekTaskElement.openCourseStartTime);
		// 			}else{
		// 				weekLiveDate = '暂无直播';
		// 				liveTime = '暂无直播';
		// 			}
					
		// 		}
		// 	})
		// }

		courseWeekPlanData.courseWeekPlan.push(weekData);
		
		weekPlanDetail.push({
			weekPlan : [], // 周计划详情
			weekTask : [], // 周任务
			weekInfo : { // 周基础信息
				'isOpen' : "true", // 周计划是否开启
				'status' : '', // 周状态描述
				'state' : 0, // 周是否完成
			},
			weekStatistic : {
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			weekAllTaskStatistic : {
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			// 'weekTask' : weekTask,
			// 'weekInfo' : weekInfo,
			// 'weekAllTaskStatistic' : weekAllTaskStatistic,
			// 'weekTotalStatistic' : weekTotalStatistic,
			// 'weekVideoStatistic' : weekVideoStatistic,
			// 'weekExamStatistic' : weekExamStatistic,
			// 'weekKnowledgePointStatistic' : weekKnowledgePointStatistic,
			// 'weekOpenCourseStatistic' : weekOpenCourseStatistic,
			// 'list' : weekPlanDetail

			'isOpen' : weekData.weekInfo.isOpen,
			'isFinish' : element.isFinish,
			'isExamDone' : false,
			'list' : addCourseDetailList,
			'status' : weekInfo.status,
			'weekStatus' : weekInfo.status,
			'weekTask' : weekTask,
			'isDone' : weekDone,
			'planId' : element.id,
			'weekName' : element.planTitle,
			'weekProgress' : iGlobal.getProgress(weekTaskCompleted,weekTaskTotal),
			
			'totalTime' : iGlobal.formatSeconds(weekTaskTime,'h'),
			'taskTime' : iGlobal.formatSeconds(weekTaskTime,'h'),
			'studyTime' : iGlobal.formatSeconds(weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime,'h'),
			'studyTimeFormat' : iGlobal.formatSeconds(weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime,'h'),
			'weekTime' : `${iGlobal.getDate(element.startDate)}-${iGlobal.getDate(element.endDate)}`,
			'startDate' : element.startDate,
			'startDateFormat' : iGlobal.getDate(element.startDate),
			'endDate' : element.endDate,
			'endDateFormat' : iGlobal.getDate(element.endDate),

			'taskTotal' : weekTaskTotal,
			'taskCompleted' : weekTaskCompleted,
			'taskOngoing' : weekTaskOngoing,
			'taskBeoverdue' : weekTaskBeoverdue,
			'taskNotstarted' : weekTaskNotstarted,

			'videoTotal' : videoTotal,
			'videoCompleted' : videoCompleted,
			'videoOngoing' : videoOngoing,
			'videoProgress' : iGlobal.getProgress(videoCompleted,videoTotal),
			'videoTime' : weekVideoStudyTime,
			'videoTimeFormat' : iGlobal.formatSeconds(weekVideoStudyTime,'h'),
			'videoTimePercentage' : videoTimePercentage,
			'videoStudyTime' : weekVideoStudyTime,

			'examTotal' : examTotal,
			'examCompleted' : examCompleted,
			'examOngoing' : examOngoing,
			'examProgress' : iGlobal.getProgress(examCompleted,examTotal),
			'examTime' : weekExamStudyTime,
			'examTimeFormat' : iGlobal.formatSeconds(weekExamStudyTime,'h'),
			'examTimePercentage' : examTimePercentage,
			'examStudyTime' : weekExamStudyTime,

			'evaluationId' : evaluationId,
			'evaluationStatus' : evaluationStatus,
			'evaluationTime' : weekEvaluationStudyTime,
			'evaluationTimeFormat' : iGlobal.formatSeconds(weekEvaluationStudyTime,'h'),
			'evaluationTimePercentage' : evaluationTimePercentage,

			'liveStatus' : liveStatus,
			'liveStatusText' : liveStatusText,
			'liveTime' : liveTime,
			'liveDate' : weekLiveDate
		})
		
	})
	courseAllTaskStatistic(courseWeekPlanData);
	// return courseWeekPlanData;
	return  {
		'isCoursePlan' : "true",
		'courseWeekPlan' : courseWeekPlanData.courseWeekPlan,
		"studyInfo" : {
			"studyProgressTotal" : iGlobal.getProgress(courseWeekPlanData.courseStatistic.task.completed,courseWeekPlanData.courseStatistic.task.totalNum)
		},
		'tasksSummary' : {
			'total' : courseWeekPlanData.courseStatistic.task.totalNum,
			'beoverdue' : courseWeekPlanData.courseStatistic.task.beoverdue,
			'completed' : courseWeekPlanData.courseStatistic.task.completed,
			'ongoing' : courseWeekPlanData.courseStatistic.task.onGoing,
			'notstarted' : courseWeekPlanData.courseStatistic.task.notStarted
		},
		'weekIngNum' : courseWeekPlanData.courseStatistic.week.ingNum,
		'weeksSummary' : {
			'dayTotal' : courseWeekPlanData.courseStatistic.day.totalNum,
			'dayIngNum' : courseWeekPlanData.courseStatistic.day.ingNum,
			'dayNoStartNum' : courseWeekPlanData.courseStatistic.day.notStarted,
			'total' : courseWeekPlanData.courseStatistic.week.totalNum,
			'weekIngNum' : courseWeekPlanData.courseStatistic.week.ingNum,
			'beoverdue' : courseWeekPlanData.courseStatistic.week.beoverdue,
			'completed' : courseWeekPlanData.courseStatistic.week.completed,
			'ongoing' : courseWeekPlanData.courseStatistic.week.onGoing,
			'notstarted' : courseWeekPlanData.courseStatistic.week.notStarted
		}
	}
}
function getCourseWeekPlan(courseDetail, coursePlan){ // 根据计划划分课程结构
	let courseWeekPlanData = {
		isCoursePlan : "true",
		courseWeekPlan : [], // 课程计划周列表
		courseStatistic : {
			week : {
				'name' : "课程周统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			},
			day : {
				'name' : "课程天统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			},
			task : {
				'name' : "课程任务统计",
				'totalNum' : 0, // 总数
				'ingNum' : 0, // 正在进行数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0, // 未开始数
			}
		},
		// taskStatistics : {
		// 	video : {
		// 		'name' : '课程视频统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	video : {
		// 		'name' : '课程试题统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	knowledgePoint : {
		// 		'name' : '课程知识点统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	openCourse : {
		// 		'name' : '课程公开课统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	appraisal : {
		// 		'name' : '课程测评统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	midterm : {
		// 		'name' : '课程期中统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	},
		// 	end : {
		// 		'name' : '课程期末统计',
		// 		'totalTime' : 0, // 总时间
		// 		'studyTime' : 0, // 学习时间
		// 		'totalNum' : 0, // 总数
		// 		'beoverdueNum' : 0, // 逾期数
		// 		'completedNum' : 0, // 完成数
		// 		'onGoingNum' : 0, // 进行数
		// 		'notStartedNum' : 0 // 未开始数
		// 	}
		// }
	}

	let weekStartTime = coursePlan[0].startDate;
	let newDate = new Date().getTime();

	courseWeekPlanData.courseStatistic.week.totalNum = coursePlan.length;
	courseWeekPlanData.courseStatistic.day.totalNum = courseWeekPlanData.courseStatistic.week.totalNum*constant.weekDay;

	if(weekStartTime < newDate){
		courseWeekPlanData.courseStatistic.day.ingNum = Math.ceil((newDate-weekStartTime)/constant.dayTime);
	}else if(newDate < weekStartTime){
		courseWeekPlanData.courseStatistic.day.notStarted = Math.ceil((weekStartTime-newDate)/constant.dayTime);
	}

	_.forEach(coursePlan, (element, index) => {
		let startIndex = _.findIndex(courseDetail, (o) => { // 周开始章节节点
			return o.chapterId == element.startCategoryId;
		})
		let endIndex = _.findIndex(courseDetail, (o) => { // 周结束章节节点
			return o.chapterId == element.endCategoryId;
		})
		// 找不到开始章节或者结束章节
		if(startIndex == -1 || endIndex == -1){
			courseWeekPlanData.courseWeekPlan = "找不到开始章节或者结束章节";
			return courseWeekPlanData.courseWeekPlan;
		}
		let weekData = {
			weekPlan : [], // 周计划详情
			weekTask : [], // 周任务
			weekInfo : { // 周基础信息
				'isOpen' : "true", // 周计划是否开启
				'status' : '', // 周状态描述
				'state' : 0, // 周是否完成
			},
			weekStatistic : {
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			weekAllTaskStatistic : {
				'totalTime' : 0, // 总时间
				'studyTime' : 0, // 学习时间
				'totalNum' : 0, // 总数
				'beoverdue' : 0, // 逾期数
				'completed' : 0, // 完成数
				'onGoing' : 0, // 进行数
				'notStarted' : 0 // 未开始数
			},
			taskStatistic : {
				video : {
					'name' : "周视频统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				exam : {
					'name' : "周试题统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				knowledgePoint : {
					'name' : "周知识点统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				openCourse : {
					'name' : "周公开课统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				appraisal : {
					'name' : "周测评统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				midterm : {
					'name' : "周期中统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				},
				end : {
					'name' : "周期末统计",
					'totalTime' : 0, // 总时间
					'studyTime' : 0, // 学习时间
					'totalNum' : 0, // 总数
					'beoverdue' : 0, // 逾期数
					'completed' : 0, // 完成数
					'onGoing' : 0, // 进行数
					'notStarted' : 0 // 未开始数
				}
			}
		}
		// let liveStatus = 0;
		// let liveTime = '暂无直播';
		// let liveStatusText = '';

		let weekStartTime = element.startDate;
		let weekEndTime = (element.endDate + constant.dayTime);

		if(weekStartTime < newDate && weekEndTime < newDate){
			weekData.weekInfo.status = "beoverdue";
			weekData.weekStatistic.beoverdue++;
		}else if(weekStartTime < newDate && newDate < weekEndTime){
			weekIngNum = index;
			weekData.weekInfo.status = "ongoing";
			weekData.weekStatistic.onGoing++;
		}if(newDate < weekStartTime && newDate < weekEndTime){
			weekData.weekInfo.isOpen = "false";
			weekData.weekInfo.status = "notstarted";
			weekData.weekStatistic.notStarted++;
		}
		for (let i = startIndex; i <= endIndex; i++) {
			let thisItem = courseDetail[i];
		  if(thisItem.tasks && thisItem.tasks.length){
		  	taskStatistic(weekData, thisItem);
		  }
		  weekData.weekPlan.push(thisItem);
		}
		weekStatistic(weekData);

		if(weekData.weekAllTaskStatistic.totalNum == weekData.weekAllTaskStatistic.completed && weekData.weekInfo.status !== "notstarted"){
			weekData.weekInfo.state = 1;
			weekData.weekInfo.status = "completed";
			weekData.weekStatistic.completed++;
		}

		// let studyTimeTotal = weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime;
		// let evaluationTimePercentage = iGlobal.getProgress(weekEvaluationStudyTime,studyTimeTotal);
		// let examTimePercentage = iGlobal.getProgress(weekExamStudyTime,studyTimeTotal);
		// let videoTimePercentage = iGlobal.getProgress(weekVideoStudyTime,studyTimeTotal);

		// weekLiveDate
		// if(weekTask && weekTask.length){
		// 	weekTask.forEach((weekTaskElement) => {
		// 		if(weekTaskElement.taskType == "openCourse"){
		// 			if(weekTaskElement.openCourseStartTime){
		// 				weekLiveDate = iGlobal.getLocalTime(weekTaskElement.openCourseStartTime);
		// 				liveTime = iGlobal.getDate(weekTaskElement.openCourseStartTime);
		// 			}else{
		// 				weekLiveDate = '暂无直播';
		// 				liveTime = '暂无直播';
		// 			}
					
		// 		}
		// 	})
		// }

		courseWeekPlanData.courseWeekPlan.push(weekData);
		/*
		weekPlanDetail.push({
			// 'weekTask' : weekTask,
			// 'weekInfo' : weekInfo,
			// 'weekAllTaskStatistic' : weekAllTaskStatistic,
			// 'weekTotalStatistic' : weekTotalStatistic,
			// 'weekVideoStatistic' : weekVideoStatistic,
			// 'weekExamStatistic' : weekExamStatistic,
			// 'weekKnowledgePointStatistic' : weekKnowledgePointStatistic,
			// 'weekOpenCourseStatistic' : weekOpenCourseStatistic,
			// 'list' : weekPlanDetail

			'isOpen' : weekData.weekInfo.isOpen,
			'isFinish' : element.isFinish,
			'isExamDone' : false,
			'list' : addCourseDetailList,
			'status' : weekInfo.status,
			'weekStatus' : weekInfo.status,
			'weekTask' : weekTask,
			'isDone' : weekDone,
			'planId' : element.id,
			'weekName' : element.planTitle,
			'weekProgress' : iGlobal.getProgress(weekTaskCompleted,weekTaskTotal),
			
			'totalTime' : iGlobal.formatSeconds(weekTaskTime,'h'),
			'taskTime' : iGlobal.formatSeconds(weekTaskTime,'h'),
			'studyTime' : iGlobal.formatSeconds(weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime,'h'),
			'studyTimeFormat' : iGlobal.formatSeconds(weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime,'h'),
			'weekTime' : `${iGlobal.getDate(element.startDate)}-${iGlobal.getDate(element.endDate)}`,
			'startDate' : element.startDate,
			'startDateFormat' : iGlobal.getDate(element.startDate),
			'endDate' : element.endDate,
			'endDateFormat' : iGlobal.getDate(element.endDate),

			'taskTotal' : weekTaskTotal,
			'taskCompleted' : weekTaskCompleted,
			'taskOngoing' : weekTaskOngoing,
			'taskBeoverdue' : weekTaskBeoverdue,
			'taskNotstarted' : weekTaskNotstarted,

			'videoTotal' : videoTotal,
			'videoCompleted' : videoCompleted,
			'videoOngoing' : videoOngoing,
			'videoProgress' : iGlobal.getProgress(videoCompleted,videoTotal),
			'videoTime' : weekVideoStudyTime,
			'videoTimeFormat' : iGlobal.formatSeconds(weekVideoStudyTime,'h'),
			'videoTimePercentage' : videoTimePercentage,
			'videoStudyTime' : weekVideoStudyTime,

			'examTotal' : examTotal,
			'examCompleted' : examCompleted,
			'examOngoing' : examOngoing,
			'examProgress' : iGlobal.getProgress(examCompleted,examTotal),
			'examTime' : weekExamStudyTime,
			'examTimeFormat' : iGlobal.formatSeconds(weekExamStudyTime,'h'),
			'examTimePercentage' : examTimePercentage,
			'examStudyTime' : weekExamStudyTime,

			'evaluationId' : evaluationId,
			'evaluationStatus' : evaluationStatus,
			'evaluationTime' : weekEvaluationStudyTime,
			'evaluationTimeFormat' : iGlobal.formatSeconds(weekEvaluationStudyTime,'h'),
			'evaluationTimePercentage' : evaluationTimePercentage,

			'liveStatus' : liveStatus,
			'liveStatusText' : liveStatusText,
			'liveTime' : liveTime,
			'liveDate' : weekLiveDate
		})
		*/
	})
	courseAllTaskStatistic(courseWeekPlanData);
	return courseWeekPlanData;
	return  {
		'isCoursePlan' : "true",
		'planInfo' : courseWeekPlanData.courseWeekPlan,
		"studyInfo" : {
			"studyProgressTotal" : iGlobal.getProgress(taskTotalCompleted,taskTotal)
		},
		'tasksSummary' : {
			'total' : taskTotal,
			'beoverdue' : taskTotalBeoverdue,
			'completed' : taskTotalCompleted,
			'ongoing' : taskTotalOngoing,
			'notstarted' : taskTotalNotstarted
		},
		'weeksSummary' : {
			'dayTotal' : dayTotal,
			'weekIngNum' : weekIngNum,
			'dayIngNum' : dayIngNum,
			'dayNoStartNum' : dayNoStartNum,
			'total' : weekTotal,
			'beoverdue' : weekTotalBeoverdue,
			'completed' : weekTotalCompleted,
			'ongoing' : weekTotalOngoing,
			'notstarted' : weekTotalNotstarted
		}
	}
}
function taskStatistic(weekData, chapterData){
	let newTasks = [];
	chapterData.tasks.forEach((element, index) => {
		let isWeekTask = false;
		let taskType = element.taskType;
		if(taskType == "exam"){
			chapterData.tasks[index].taskTime = parseInt(element.taskTime)*60
			// appraisal:测评,midterm:期中,end:期末,
			// practice:练习,core:核心,extension:扩展,backup:备份
			let taskLevel = element.taskLevel;
			if(taskLevel == "appraisal" || taskLevel == "midterm" || taskLevel == "end"){
				isWeekTask = true;
				taskType = taskLevel;
			}
		}else if(taskType == "openCourse"){
			isWeekTask = true;
			chapterData.tasks[index].openCourseDate = iGlobal.getDate(element.openCourseStartTime);
			chapterData.tasks[index].openCourseText = `${element.title} ${iGlobal.getLocalTime(element.openCourseStartTime)} 开始`;
		}
		if(isWeekTask){
			weekData.weekTask.push(element);
		}else{
			newTasks.push(element);
		}
		setTaskStatistic(weekData, element, taskType);
	})
	chapterData.tasks = newTasks;
}
function setTaskStatistic(weekData, task, taskType){
	let status = weekData.weekInfo.status;
	let weekTask = weekData.taskStatistic[taskType];
	let studyTime = parseInt(task.studyTime);
	let taskTime = parseInt(task.taskTime);

	weekTask.totalNum++;
	weekTask.studyTime += studyTime;
	weekTask.totalTime += taskTime;

	switch(status){
		case "notstarted": // 未开始
			weekTask.notStarted++;
			break;
		case "completed": // 完成
			weekTask.completed++;
			break;
		case "ongoing": // 进行中
		case "beoverdue": // 逾期
			if(task.state){
				weekTask.completed++;
			}else{
				if(task.progress){
					weekTask.onGoing++;
				}else{
					weekTask.notStarted++;
				}
			}
			break;
	}
}

function weekStatistic(weekData){
	weekData.weekAllTaskStatistic = _.reduce(weekData.taskStatistic, function(result, value, key) {
		result.totalTime += value.totalTime;
		result.studyTime += value.studyTime;
		result.totalNum += value.totalNum;
		result.beoverdue += value.beoverdue;
		result.completed += value.completed;
		result.onGoing += value.onGoing;
		result.notStarted += value.notStarted;
	  return result
	},{
		'totalTime' : 0, // 总时间
		'studyTime' : 0, // 学习时间
		'totalNum' : 0, // 总数
		'beoverdue' : 0, // 逾期数
		'completed' : 0, // 完成数
		'onGoing' : 0, // 进行数
		'notStarted' : 0 // 未开始数
	});
}
function courseAllTaskStatistic(courseWeekPlanData){
	courseWeekPlanData.courseStatistic.task = _.reduce(courseWeekPlanData.courseWeekPlan, function(result, value, key) {
		result.totalTime += value.weekAllTaskStatistic.totalTime;
		result.studyTime += value.weekAllTaskStatistic.studyTime;
		result.totalNum += value.weekAllTaskStatistic.totalNum;
		result.beoverdue += value.weekAllTaskStatistic.beoverdue;
		result.completed += value.weekAllTaskStatistic.completed;
		result.onGoing += value.weekAllTaskStatistic.onGoing;
		result.notStarted += value.weekAllTaskStatistic.notStarted;
	  return result
	},{
		'totalTime' : 0, // 总时间
		'studyTime' : 0, // 学习时间
		'totalNum' : 0, // 总数
		'beoverdue' : 0, // 逾期数
		'completed' : 0, // 完成数
		'onGoing' : 0, // 进行数
		'notStarted' : 0 // 未开始数
	});
}


function courseByInFo(coursestatus){
	let lockStatus = false;
	let courseActiveTime = 0;
	let courseExpirationTime = 0;
	let courseActiveState=0;
	let courseActiveStateText = "默认未购买";
	if(coursestatus && coursestatus.length){
		var lockStatusNum = 0;
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].lockStatus == 0){
				lockStatusNum++;
			}
		}
		if(!lockStatusNum){
			lockStatus = true;
		}

		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].isExpiration == "false" && coursestatus[i].activeState == "acitve"){
				courseActiveTime = coursestatus[i].activeTime;
				courseExpirationTime = coursestatus[i].expirationTime;
			}
		}
		var datanow=(new Date().getTime())/1000;//当前时间戳
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime>datanow && courseActiveState<3){
				courseActiveState="3";//已激活未过期
				courseActiveStateText = "已激活未过期";
				break;
			}else if(coursestatus[i].activeState=="init" && courseActiveState<2){
				courseActiveState="2";//未激活
				courseActiveStateText = "未激活";
			}else if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime<datanow && courseActiveState<1){
				courseActiveState="1";//已激活已过期
				courseActiveStateText = "已激活已过期";
			}
		}
		if(courseActiveState && lockStatus){
			courseActiveState="4";//课程已锁定
			courseActiveStateText = "课程已锁定";
		}
		courseActiveState = courseActiveState;
	}else{

	}
	var day = (parseInt((courseExpirationTime-datanow)/(24*60*60)) +1).toString();
	if(day.length == 1){
		day = "00" + day;
	}else if(day.length == 2){
		day = "0" + day;
	}else if(day.length == 3){

	}else{

	}
	let dayArray = day.split('');
	return {
		lockStatus : lockStatus,
		courseActiveTime : iGlobal.getDate(courseActiveTime*1000),
		courseExpirationTime : iGlobal.getDate(courseExpirationTime*1000),
		countDown : day,
		countDownArray : dayArray,
		courseActiveState : courseActiveState,
		courseActiveStateText : courseActiveStateText
	}
}
function filterExamDate(courseId, examDate){
	var data = {};
	var days = -1;
	if(examDate && examDate.length){
		for(var i=0;i<examDate.length;i++){
			if(courseId == examDate[i].id){
				data = examDate[i];
				days = parseInt((new Date().getTime() - data.examinationDate)/(24*60*60*1000));
			}
		}
	}
	if(days<0){
    return "本科目考试时间未确定";
  }else if(days==0){
    return "请留意,本科目<strong>今天</strong>开始考试";
  }else{
    return "距本科目考试还有<strong>"+days+"</strong>天";
  }
}
function filterCourseInfo(courseDetail){
	let courseInfo = {}
	if(courseDetail){
		courseInfo = {
			categoryName : courseDetail.categoryName,
			categoryId : courseDetail.categoryId,
			courseName : courseDetail.courseName,
			courseId : courseDetail.courseId,
			courseImage : constant.host.static + courseDetail.coverPath,
			expirationTime : courseDetail.effectiveDay
		};
		let courseModel = JSON.parse(courseDetail.courseModel);
		if(courseModel && courseModel.length){
			courseInfo.courseModel = courseDetail.courseModel;
			courseInfo.img = constant.host.static + courseDetail.coverPath;
			courseInfo.video = courseDetail.firstVideo;
		}
	}

	return courseInfo;
}
function filterLastLearnChapter(taskProgress){
	let lastLearnChapter = '';
	let isLastLearn = false;
	let title = '';
	let chapterId = '';
	let chapterName = '';
	let taskId = '';
	let taskName = '';
	if(taskProgress && taskProgress.length){
		isLastLearn = true;
		lastLearnChapter =  _.maxBy(taskProgress, 'createDate');
		title = lastLearnChapter.chapterName;
		chapterId = lastLearnChapter.chapterId;
		chapterName = lastLearnChapter.chapterName;
		taskId = lastLearnChapter.taskId;
		taskName = lastLearnChapter.taskName;

	}else{
		isLastLearn = false;
		let index = _.findIndex(courseDetailList, ['isTasks', true]);
		if(index){
			lastLearnChapter = courseDetailList[index];
			title = "开始学习本课程";
			chapterId = lastLearnChapter.chapterId;
			chapterName = lastLearnChapter.chapterName;
			taskId = lastLearnChapter.tasks[0].taskId;
			taskName = lastLearnChapter.tasks[0].title;
		}else{
			title = "暂无课程任务";
			chapterId = "";
			chapterName = "";
			taskId = "";
			taskName = "";
		}
	}
	return {
		isLastLearn : isLastLearn,
		title : title,
		chapterId : chapterId,
		chapterName : chapterName,
		taskId : taskId,
		taskName : taskName
	}
}
function formatCourseDetail(courseRenderData){
	var formatPlanInfo = [];
	if(courseRenderData.planInfo && courseRenderData.planInfo.length){
		_.each(courseRenderData.planInfo, function(weekElement, weekIndex){
			formatPlanInfo.push(weekElement);
			formatPlanInfo[weekIndex].newList = [];
			_.each(weekElement.list, function(listElement, listIndex){
				let thisElement = '';
				let level = listElement.level;
				let node = listElement.node;
				let nodeArray = node.split('-');
				if(level == 1){
					formatPlanInfo[weekIndex].newList.push(listElement);
					formatPlanInfo[weekIndex].newList[0].children = [];
				}else if(level == 2){
					formatPlanInfo[weekIndex].newList[0].children.push(listElement);
					formatPlanInfo[weekIndex].newList[0].children[+nodeArray[1]].children = [];
				}else if(level == 3){
					formatPlanInfo[weekIndex].newList[0].children[+nodeArray[1]].children.push(listElement)
				}
				
			})
		})
	}
}
module.exports = { coursePlanDetail,studycenterCoursePlanDetail }