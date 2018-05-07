const _ = require('lodash');
const iGlobal = require('../../global');
const constant = require('../../global/constant');
var { resCourseDetail } = require('../../resData/courseDetail');
var globalCourseDetail = {};
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
	// console.log(resCourseDetail)
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
	console.log(courseWeekPlan);
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
	// return payload.flatCourseDetail;
}
function flatCourseTasks(chapter){ // 添加章节任务数据
	let tasks = chapter.tasks;
	// let totalSummary = videoSummary = examSummary = knowledgePointSummary = openCourseSummary = {
	// 	totalTime : 0,
	// 	studyTime : 0,
	// 	totalNum : 0,
	// 	completedNum : 0,
	// 	ongoingNum : 0,
	// 	notstartedNum : 0
	// }
	// let examTypeSummary = {};
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
			isFree : chapter.isFree
		};
		// studyTime += thisTaskProgress.studyTime;
		// tasksTotalNum++;
		// switch(element.taskType){
		// 	case "video":
		// 		videoNum++;
		// 		totalTime += parseInt(element.videoTime);
		// 		videoTime += parseInt(element.videoTime);
		// 		videoStudyTime += parseInt(thisTaskProgress.studyTime);
		// 		if(thisTaskProgress.state){
		// 			videoCompletedNum++;
		// 		}else{
		// 			if(thisTaskProgress.progress){
		// 				videoOngoingNum++;
		// 			}else{
		// 				videoNotstartedNum++;
		// 			}
		// 		}
		// 		break;
		// 	case "exam":
		// 		// examNum++;
		// 		// totalTime+=parseInt(element.taskTime)*60;
		// 		// examTime+=parseInt(element.taskTime)*60;
		// 		if(element.taskLevel == "appraisal" || element.taskLevel == "midterm" || element.taskLevel == "end"){ // 测评，期中，期末
		// 			// isFree
		// 			tasks[index].isFree = chapter.isFree;
		// 			// evaluationStudyTime += parseInt(thisTaskProgress.studyTime);
		// 		}else{
		// 			examStudyTime += parseInt(thisTaskProgress.studyTime);
		// 		}
				
		// 		getExamSummary(element.taskLevel, examSummary);
		// 		if(thisTaskProgress.state){
		// 			examCompletedNum++;
		// 		}else{
		// 			if(thisTaskProgress.progress){
		// 				examOngoingNum++;
		// 			}else{
		// 				examNotstartedNum++;
		// 			}
		// 		}
		// 		break;
		// 	case "knowledgePointExercise":
		// 		knowledgePointNum++;
		// 		totalTime+=(120)*60;
		// 		knowledgePointTime+=parseInt(element.taskTime);
		// 		knowledgePointStudyTime += parseInt(thisTaskProgress.studyTime);
		// 		if(thisTaskProgress.state){
		// 			knowledgePointCompletedNum++;
		// 		}else{
		// 			if(thisTaskProgress.progress){
		// 				knowledgePointOngoingNum++;
		// 			}else{
		// 				knowledgePointNotstartedNum++;
		// 			}
		// 		}
		// 		break;
		// 	case "openCourse":
		// 		openCourseNum++;
		// 		totalTime+=parseInt(element.taskTime);
		// 		openCourseTime+=parseInt(element.taskTime);
		// 		openCourseStudyTime += parseInt(thisTaskProgress.studyTime);
		// 		if(thisTaskProgress.state){
		// 			openCourseCompletedNum++;
		// 		}else{
		// 			if(thisTaskProgress.progress){
		// 				openCourseOngoingNum++;
		// 			}else{
		// 				openCourseNotstartedNum++;
		// 			}
		// 		}
		// 		break;
		// }
	})
	return {
		'tasks' : tasks,
		// 'totalSummary' : totalSummary,
		// 'videoSummary' : videoSummary,
		// 'examSummary' : examSummary,
		// 'knowledgePointSummary' : knowledgePointSummary,
		// 'openCourseSummary' : openCourseSummary,


		// 'completedNum' : completedNum,
		// 'ongoingNum' : ongoingNum,
		// 'notstartedNum' : notstartedNum,

		// 'videoCompletedNum' : videoCompletedNum,
		// 'videoOngoingNum' : videoOngoingNum,
		// 'videoNotstartedNum' : videoNotstartedNum,

		// 'examCompletedNum' : examCompletedNum,
		// 'examOngoingNum' : examOngoingNum,
		// 'examNotstartedNum' : examNotstartedNum,

		// 'knowledgePointCompletedNum' : knowledgePointCompletedNum,
		// 'knowledgePointOngoingNum' : knowledgePointOngoingNum,
		// 'knowledgePointNotstartedNum' : knowledgePointNotstartedNum,

		// 'openCourseCompletedNum' : openCourseCompletedNum,
		// 'openCourseOngoingNum' : openCourseOngoingNum,
		// 'openCourseNotstartedNum' : openCourseNotstartedNum,

		// 'totalTime' : totalTime,
		// 'totalTimeFormat' : iGlobal.formatSeconds(totalTime,'h'),
		// 'videoStudyTime' : videoStudyTime,
		// 'examStudyTime' : examStudyTime,
		// 'knowledgePointStudyTime' : knowledgePointStudyTime,
		// 'openCourseStudyTime' : openCourseStudyTime,
		// 'studyTime' : studyTime,
		// 'studyTimeFormat' : iGlobal.formatSeconds(studyTime,'h'),
		// 'videoTime' : videoTime,
		// 'videoTimeFormat' : iGlobal.formatSeconds(videoTime,'h'),
		// 'examTime' : examTime,
		// 'examTimeFormat' : iGlobal.formatSeconds(examTime,'h'),
		// 'evaluationStudyTime' : evaluationStudyTime,
		// 'knowledgePointTime' : knowledgePointTime,
		// 'knowledgePointTimeFormat' : iGlobal.formatSeconds(knowledgePointTime,'h'),
		// 'openCourseTime' : openCourseTime,
		// 'openCourseTimeFormat' : iGlobal.formatSeconds(openCourseTime,'h'),

		// 'tasksTotalNum' : tasksTotalNum,
		// 'examSummary' : examSummary,
		// 'videoNum' : videoNum,
		// 'examNum' : examNum,
		// 'knowledgePointNum' : knowledgePointNum,
		// 'openCourseNum' : openCourseNum
	}
}
function getExamSummary(examLevel, examSummary){ //试卷个数统计
	if(examSummary[examLevel]){
		examSummary[examLevel]++;
	}else{
		examSummary[examLevel] = 1;
	}
	// switch(examLevel){
	// 	case "practice": // 练习
	// 		break;
	// 	case "appraisal": // 测评
	// 		break;
	// 	case "midterm": // 期中
	// 		break;
	// 	case "end": // 期末
	// 		break;
	// 	case "core": // 核心
	// 		break;
	// 	case "extension": // 扩展
	// 		break;
	// 	case "backup": // 备份
	// 		break;
	// }
}
function getTaskProgress(taskElement){ // 给任务注入任务进度
	let studyTime = 0;
	let completedNum = 0;
	let ongoingNum = 0;
	let notstartedNum = 0;
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

function getCourseWeekPlan(courseDetail, coursePlan){ // 根据计划划分课程结构
	// Statistics
	let coursePlanWeekList = []; // 课程计划周列表

	// 周统计 天统计 任务统计
	let weekStatistic = dayStatistic = taskStatistic = {
		'totalNum' : 0, // 总数
		'ingNum' : 0, // 正在进行数
		'beoverdueNum' : 0, // 逾期数
		'completedNum' : 0, // 完成数
		'onGoingNum' : 0, // 进行数
		'notStartedNum' : 0, // 未开始数
	}
	

	let courseTotalStatistic = courseVideoStatistic = courseExamStatistic = courseKnowledgePointStatistic = courseOpenCourseStatistic = {
		'totalTime' : 0, // 总时间
		'studyTime' : 0, // 学习时间
		'totalNum' : 0, // 总数
		'beoverdueNum' : 0, // 逾期数
		'completedNum' : 0, // 完成数
		'onGoingNum' : 0, // 进行数
		'notStartedNum' : 0 // 未开始数
	}


	let newDate = new Date().getTime();
	let weekStartTime = coursePlan[0].startDate;

	let weekLiveDate = '';

	weekStatistic.totalNum = coursePlan.length;
	dayStatistic.totalNum = weekStatistic.totalNum*constant.weekDay;

	if(weekStartTime < newDate){
		dayStatistic.dayIngNum = Math.ceil((newDate-weekStartTime)/constant.dayTime)
	}else if(newDate < weekStartTime){
		dayStatistic.dayNoStartNum = Math.ceil((weekStartTime-newDate)/constant.dayTime)
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
			return false;
		}

		let addCourseDetailList = []; // 周计划详情
		let weekTask = []; // 周任务
		let weekInfo = {
			'isOpen' : true, // 周计划是否开启
			'status' : '', // 周状态
			'state' : '', // 周是否完成
		}
		let weekTotalStatistic = weekVideoStatistic = weekExamStatistic = weekKnowledgePointStatistic = weekOpenCourseStatistic = {
			'totalTime' : 0, // 总时间
			'studyTime' : 0, // 学习时间
			'totalNum' : 0, // 总数
			'beoverdueNum' : 0, // 逾期数
			'completedNum' : 0, // 完成数
			'onGoingNum' : 0, // 进行数
			'notStartedNum' : 0 // 未开始数
		}

		let liveStatus = 0;
		let liveTime = '暂无直播';
		let liveStatusText = '';

		let weekStartTime = element.startDate;
		let weekEndTime = (element.endDate + constant.dayTime);

		if(weekStartTime < newDate && weekEndTime < newDate){
			weekStatus = "beoverdue";
			weekTotalStatistic.beoverdueNum++;
		}else if(weekStartTime < newDate && newDate < weekEndTime){
			weekIngNum = index;
			weekStatus = "ongoing";
			weekTotalStatistic.onGoingNum++;
		}if(newDate < weekStartTime && newDate < weekEndTime){
			isOpen = "false";
			weekStatus = "notstarted";
			weekTotalStatistic.notStartedNum++;
		}

		
		for (let i = startIndex; i <= endIndex; i++) {
			let thisItem = courseDetail[i];
		  if(thisItem.isTasks){
		  	
		  	weekTaskTime+=thisItem.totalTime;
		  	weekStudyTime+=thisItem.studyTime;
		  	weekVideoStudyTime += thisItem.videoStudyTime;
		  	weekExamStudyTime += thisItem.examStudyTime;
		  	weekKnowledgePointStudyTime += thisItem.knowledgePointStudyTime;
		  	weekOpenCourseStudyTime += thisItem.openCourseStudyTime;
		  	weekEvaluationStudyTime += thisItem.evaluationStudyTime;

		  	videoTotal+=thisItem.videoNum;
		  	videoCompleted+=thisItem.videoCompletedNum;
		  	videoOngoing+=thisItem.videoOngoingNum;
		  	videoNotstarted+=thisItem.videoNotstartedNum;

		  	examTotal+=thisItem.examNum;
		  	examCompleted+=thisItem.examCompletedNum;
		  	examOngoing+=thisItem.examOngoingNum;
		  	examNotstarted+=thisItem.examNotstartedNum;
		  	// liveTime+=thisItem.openCourseTime;
		  	
		  	let newTasks = [];
		  	thisItem.tasks.forEach((element,index) => {
		  		if(element.taskType == "video"){
		  			newTasks.push(element);
		  		}else if(element.taskType == "exam"){

		  			if(element.taskLevel == "practice"){ // 练习
		  				newTasks.push(element);
		  			}else if(element.taskLevel == "appraisal"){ // 测评
		  				weekTask.push(element);
		  			}else if(element.taskLevel == "midterm"){ // 期中
		  				weekTask.push(element);
		  			}else if(element.taskLevel == "end"){ // 期末
		  				weekTask.push(element);
		  			}else if(element.taskLevel == "core"){ // 核心
		  				newTasks.push(element);
		  			}else if(element.taskLevel == "extension"){ // 扩展
		  				newTasks.push(element);
		  			}else if(element.taskLevel == "backup"){ // 备份
		  				newTasks.push(element);
		  			}
		  		}else if(element.taskType == "knowledgePointExercise"){
		  			newTasks.push(element);
		  		}else if(element.taskType == "openCourse"){
		  			weekTask.push(element);
		  			// thisItem.tasks.splice(index,1);
		  			element.openCourseDate = iGlobal.getDate(element.openCourseStartTime);
		  			element.openCourseText = `${element.title} ${iGlobal.getLocalTime(element.openCourseStartTime)} 开始`;
		  			liveStatus = element.state;
		  			if(element.state){
		  				liveStatusText = "已完成"
		  			}else{
		  				if(element.progress){
		  					liveStatusText = "进行中";
		  				}else{
		  					liveStatusText = "未开始";
		  				}
		  			}
		  		}
		  	})
		  	thisItem.tasks = newTasks;

		  	let taskLength = thisItem.tasks.length;
		  	weekTaskTotal+=taskLength;

		  	switch(weekStatus){
		  		case "completed":
		  			taskTotalCompleted+=taskLength;
		  			break;
		  		case "beoverdue":
		  			// taskTotalBeoverdue+=taskLength;
		  			for(var j=0;j<taskLength;j++){
		  				if(thisItem.tasks[j].state){
		  					weekDoneNum++;
		  					taskTotalCompleted++;
		  					weekTaskCompleted++;
		  				}else{

		  					if(thisItem.tasks[j].progress){
		  						taskTotalOngoing++;
		  						weekTaskOngoing++;
		  					}else{
		  						taskTotalBeoverdue++;
		  						weekTaskBeoverdue++;
		  						// taskTotalNotstarted++;
		  					}
		  				}
		  			}
		  			break;
		  		case "ongoing":
		  			for(var j=0;j<taskLength;j++){
		  				if(thisItem.tasks[j].state){
		  					weekDoneNum++;
		  					taskTotalCompleted++;
		  					weekTaskCompleted++;
		  				}else{
		  					if(thisItem.tasks[j].progress){
		  						taskTotalOngoing++;
		  						weekTaskOngoing++;
		  					}else{
		  						taskTotalNotstarted++;
		  						weekTaskNotstarted++;
		  					}
		  				}
		  			}
		  			break;
		  		case "notstarted":
		  			taskTotalNotstarted+=taskLength;
		  			break;
		  	}
		  }
		  
		  addCourseDetailList.push(thisItem);
		}
		if(weekTaskTotal == weekDoneNum && weekStatus !== "notstarted"){
			weekDone = 1;
			weekStatus = "completed";
			weekTotalCompleted++;
		}

		taskTotal += weekTaskTotal;

		// let studyTimeTotal = weekVideoStudyTime+weekExamStudyTime+weekEvaluationStudyTime;
		// let evaluationTimePercentage = iGlobal.getProgress(weekEvaluationStudyTime,studyTimeTotal);
		// let examTimePercentage = iGlobal.getProgress(weekExamStudyTime,studyTimeTotal);
		// let videoTimePercentage = iGlobal.getProgress(weekVideoStudyTime,studyTimeTotal);

		// weekLiveDate
		if(weekTask && weekTask.length){
			weekTask.forEach((weekTaskElement) => {
				if(weekTaskElement.taskType == "openCourse"){
					if(weekTaskElement.openCourseStartTime){
						weekLiveDate = iGlobal.getLocalTime(weekTaskElement.openCourseStartTime);
						liveTime = iGlobal.getDate(weekTaskElement.openCourseStartTime);
					}else{
						weekLiveDate = '暂无直播';
						liveTime = '暂无直播';
					}
					
				}
			})
		}

		coursePlanWeekList.push({
			'isOpen' : isOpen,
			'isFinish' : element.isFinish,
			'isExamDone' : false,
			'list' : addCourseDetailList,
			'status' : weekStatus,
			'weekStatus' : weekStatus,
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

	return  {
		'weekStatistic' : weekStatistic,
		'dayStatistic' : dayStatistic,
		'taskStatistic' : taskStatistic,
		'isCoursePlan' : "true",
		'planInfo' : coursePlanWeekList,
		// "studyInfo" : {
		// 	"studyProgressTotal" : iGlobal.getProgress(taskTotalCompleted,taskTotal)
		// },
		// 'tasksSummary' : {
		// 	'total' : taskTotal,
		// 	'beoverdue' : taskTotalBeoverdue,
		// 	'completed' : taskTotalCompleted,
		// 	'ongoing' : taskTotalOngoing,
		// 	'notstarted' : taskTotalNotstarted
		// },
		// 'weeksSummary' : {
		// 	'dayTotal' : dayTotal,
		// 	'weekIngNum' : weekIngNum,
		// 	'dayIngNum' : dayIngNum,
		// 	'dayNoStartNum' : dayNoStartNum,
		// 	'total' : weekTotal,
		// 	'beoverdue' : weekTotalBeoverdue,
		// 	'completed' : weekTotalCompleted,
		// 	'ongoing' : weekTotalOngoing,
		// 	'notstarted' : weekTotalNotstarted
		// }
	}
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
module.exports = { coursePlanDetail }