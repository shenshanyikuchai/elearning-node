const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');
// var courseTimeTotalNum = 0;
// var courseDetailLevel = 0;
var courseDetail = {};
var courseDetailList = [];
var weekIngNum = 0;
function initData(){
	if(courseDetailList && courseDetailList.length){
		courseDetail = {};
		courseDetailList = [];
	}
}
function classCourse(payload){
	// 参数
	// { 
	// 	courseDetail：课程详情, 
	// 	tasksProgress：任务进度,
	// 	memberGetplan：教学计划, 
	// 	courseactivestatus：课程状态 
	// 	examDate：考试时间, 
	// }
	// 初始化数据
	initData();
	courseDetail = payload.courseDetail;
	console.log(courseDetail)
	let courseRenderData = {};
	filterCourseDetail(payload.courseDetail.chapters);
	addTaskProgress(payload.tasksProgress);
	courseRenderData = getChapterListWeekList(payload.memberGetplan);

	// formatCourseDetail(courseRenderData);
	courseRenderData.courseStatus = courseByInFo(payload.courseactivestatus);
	courseRenderData.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	courseRenderData.courseInfo = filterCourseInfo(payload.courseDetail);
	courseRenderData.lastLearn = filterLastLearnChapter(payload.tasksProgress);

	return courseRenderData;
}
function filterCourseDetail(chapters, level, node, oldNode, rootNode) {
	if(level){
		level++;
	}else{
		var level = 1;
	}
	chapters.forEach((element,index) => {

		let rootNode = '';
		let newNode = '';
		if(level>1){
			rootNode = oldNode;
			newNode = node + '-' + index;
		}else{
			newNode = index.toString();
			node = index.toString();
			rootNode = index.toString();
		}
		let chapterTotalTime = 0;
		let videoTime = 0;
		let examTime = 0;
		let knowledgePointTime = 0;
		let openCourseTime = 0;
		if(element.tasks && element.tasks.length && element.children && element.children.length){
			let chapter = element;
			let newTasks = [];
			let completedNum = 0;
			let ongoingNum = 0;
			let notstartedNum = 0;
			element.tasks.forEach(function(element,index){
				element.tasks[index] = {
					...element,
					categoryId : courseDetail.categoryId,
					categoryName : courseDetail.categoryName,
					subjectId : courseDetail.subjectId,
					subjectName : courseDetail.subjectName,
					courseId : courseDetail.courseId,
					courseName : courseDetail.courseName,
					chapterId : chapter.chapterId,
					chapterTitle : chapter.title,
					isFree : chapter.isFree
				};
				if(element.taskType == "video"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.videoTime);
					chapterTotalTime+=(+element.videoTime);
					videoTime+=(+element.videoTime);
				}else if(element.taskType == "exam"){

					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime)*60;
					chapterTotalTime+=(+element.taskTime)*60;
					examTime+=(+element.taskTime);
				}else if(element.taskType == "knowledgePointExercise"){
					newTasks.push(element);
					// courseTimeTotalNum += (120)*60;
					chapterTotalTime+=(120)*60;
					knowledgePointTime+=(+element.taskTime);
				}else if(element.taskType == "openCourse"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime);
					chapterTotalTime+=(+element.taskTime);
					openCourseTime+=(+element.taskTime);
				}
				if(element.state){
					completedNum++;
				}else{
					if(element.progress){
						ongoingNum++;
					}else{
						notstartedNum++;
					}
				}
			})
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : "true",
				'isFree' : element.isFree,
				'title' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : true,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true,

				'tasks' : newTasks,
				'completedNum' : completedNum,
				'ongoingNum' : ongoingNum,
				'notstartedNum' : notstartedNum,
				'chapterTotalTime' : chapterTotalTime,
				'chapterStudyTime' : 0,
				'videoTime' : videoTime,
				'examTime' : examTime,
				'knowledgePointTime' : knowledgePointTime,
				'openCourseTime' : openCourseTime,
				
			})
			
			filterCourseDetail(element.children, level, newNode, node, rootNode);
		}else if(element.tasks && element.tasks.length){
			let newTasks = [];
			let completedNum = 0;
			let ongoingNum = 0;
			let notstartedNum = 0;
			element.tasks.forEach(function(element,index){
				if(element.taskType == "video"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.videoTime);
					chapterTotalTime+=(+element.videoTime);
					videoTime+=(+element.videoTime);
				}else if(element.taskType == "exam"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime)*60;
					chapterTotalTime+=(+element.taskTime)*60;
					examTime+=(+element.taskTime);
				}else if(element.taskType == "knowledgePointExercise"){
					newTasks.push(element);
					// courseTimeTotalNum += (120)*60;
					chapterTotalTime+=(120)*60;
					knowledgePointTime+=(+element.taskTime);
				}else if(element.taskType == "openCourse"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime);
					chapterTotalTime+=(+element.taskTime);
					openCourseTime+=(+element.taskTime);
				}
				if(element.state){
					completedNum++;
				}else{
					if(element.progress){
						ongoingNum++;
					}else{
						notstartedNum++;
					}
				}
			})
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : "false",
				'isFree' : element.isFree,
				'title' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : true,
				'tasks' : newTasks,
				'completedNum' : completedNum,
				'ongoingNum' : ongoingNum,
				'notstartedNum' : notstartedNum,
				'chapterTotalTime' : chapterTotalTime,
				'chapterStudyTime' : 0,
				'videoTime' : videoTime,
				'examTime' : examTime,
				'knowledgePointTime' : knowledgePointTime,
				'openCourseTime' : openCourseTime,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true
			})
		}else if(element.children && element.children.length){
			// courseDetailLevel++;
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : "true",
				'isFree' : element.isFree,
				'title' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : false,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true
			})
			filterCourseDetail(element.children, level, newNode, node, rootNode);
		}
	})
}
function addTaskProgress(taskProgress) {
	if(taskProgress && taskProgress.length){
		courseDetailList.forEach(function(courseElement, courseIndex){
			if(courseElement.isTasks){
				var chapterStudyTime = 0;
				var completedNum = 0;
				var ongoingNum = 0;
				var notstartedNum = 0;
				var taskLength = courseElement.tasks.length;
				var taskItem = 0;
				courseElement.tasks.forEach(function(taskElement, taskIndex){

					var thatTaskData = '';
					taskProgress.forEach(function(taskProgressElement, taskProgressIndex){
						if(taskElement.taskId == taskProgressElement.taskId){
							thatTaskData = taskProgressElement;
						}
					});

					if(thatTaskData){
						var studyTime = thatTaskData.taskStudyTotalTime;
						// if(thatTaskData.taskStudyTimeList && thatTaskData.taskStudyTimeList.length){
						// 	thatTaskData.taskStudyTimeList.forEach(function(element, index){
						// 		studyTime += parseInt(element.studyTime);
						// 	})
						// }
						if(studyTime){
							chapterStudyTime+=studyTime;
							taskElement.studyTime = studyTime;
						}else{
							chapterStudyTime+=0;
							taskElement.studyTime = 0;
						}
						
						if(thatTaskData.state){
							completedNum++;
						}else{
							if(thatTaskData.progress){
								ongoingNum++;
							}
						}
						
						taskElement.progress = thatTaskData.progress;
						taskElement.total = thatTaskData.total;
						taskElement.state = thatTaskData.state;
						taskElement.percentage = iGlobal.getPercentage(thatTaskData);
					}else{
						notstartedNum++;
					}
				});
				courseElement.completedNum = completedNum;
				courseElement.ongoingNum = ongoingNum;
				courseElement.notstartedNum = notstartedNum;
				courseElement.chapterStudyTime = chapterStudyTime;
			}
		})
	}
}
function getChapterListWeekList(memberGetplan){
	if(memberGetplan && memberGetplan.length){
		return filterCourseDetailWeekPlan(courseDetailList, memberGetplan);
	}else{
		return filterCourseDetailPlan(courseDetailList);
	}
}
function filterCourseDetailPlan(courseData){
	return  {
		'weekIngNum' : weekIngNum,
		'planInfo' : [],
		'isCoursePlan' : "false",
		'chapterList' : courseData
	}
}
function filterCourseDetailWeekPlan(courseData, planData){
	let courseDetailWeekList = [];
	let courseDetailLevel = 0;

	let weekTotal = planData.length;
	let weekTotalCompleted = 0;
	let weekTotalOngoing = 0;
	let weekTotalNotstarted = 0;
	let weekTotalBeoverdue = 0;

	let taskTotal = 0;
	let taskTotalCompleted = 0;
	let taskTotalOngoing = 0;
	let taskTotalNotstarted = 0;
	let taskTotalBeoverdue = 0;

	let itemStart = 0;
	let newDate = new Date().getTime();
	let weekStartTime = planData[0].startDate;
	let dayIngNum = 0;
	let dayNoStartNum = 0;
	let dayTime = 24*60*60*1000;

	let weekLiveDate = '';
	if(weekStartTime < newDate){
		dayIngNum = Math.ceil((newDate-weekStartTime)/dayTime)
	}else if(newDate < weekStartTime){
		dayNoStartNum = Math.ceil((weekStartTime-newDate)/dayTime)
	}

	planData.forEach(function(element,index){
		let startIndex = _.findIndex(courseData, (o) => { // 周开始章节节点
			return o.chapterId == element.startCategoryId;
		})
		let endIndex = _.findIndex(courseData, (o) => { // 周结束章节节点
			return o.chapterId == element.endCategoryId;
		})
		// 找不到开始章节或者结束章节
		if(startIndex == -1 || endIndex == -1){
			return courseDetailWeekList = "找不到开始章节或者结束章节";
		}

		let isOpen = 'true';
		let startCategoryId = element.startCategoryId;
		let endCategoryId = element.endCategoryId;
		let addCourseDetailList = [];
		let addcourseDetailWeekList = false;
		let item = courseData;
		let itemLength = item.length;
		let itemEnd = 0;

		let weekTask = [];
		let weekStatus = "";
		let weekTaskTime = 0;
		let weekStudyTime = 0;
		// let weekTaskOngoing = 0;
		let weekDone = 0;
		let weekDoneNum = 0;
		let weekTotal = 0;

		let weekTaskTotal = 0;
		let weekTaskBeoverdue = 0;
		let weekTaskOngoing = 0;
		let weekTaskCompleted = 0;
		let weekTaskNotstarted = 0;


		let videoTotal = 0;
		let videoBeoverdue = 0;
		let videoOngoing = 0;
		let videoCompleted = 0;
		let videoNotstarted = 0;
		let videoTime = 0;
		
		let examTotal = 0;
		let examBeoverdue = 0;
		let examOngoing = 0;
		let examCompleted = 0;
		let examNotstarted = 0;
		let examTime = 0;

		let evaluationStatus = 0;
		let evaluationTime = 0;
		let evaluationId = '';

		let liveStatus = 0;
		let liveTime = '暂无直播';
		let liveStatusText = '';
		let endDataTime = (element.endDate + 24*60*60*1000);
		if(element.startDate < newDate && endDataTime < newDate){
			// weekIngNum = index;
			weekStatus = "beoverdue";
			weekTotalBeoverdue++;
		}else if(element.startDate < newDate && newDate < endDataTime){
			weekIngNum = index;
			weekStatus = "ongoing";
			weekTaskOngoing++;
		}if(newDate < element.startDate && newDate < endDataTime){
			// weekIngNum = index;
			isOpen = "false";
			weekStatus = "notstarted";
			weekTaskNotstarted++;
		}else{
			// weekIngNum = '';
		}
		
		for(var i=startIndex;i<=endIndex;i++){
			weekTotal++;
			var thisItem = item[i];
			thisItem.index = i;
			if(startCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = true;
			}
			if(addcourseDetailWeekList){

				if(thisItem.isTasks){

					weekTaskTime+=thisItem.chapterTotalTime;
					weekStudyTime+=thisItem.chapterStudyTime;
					
					
					// liveTime+=thisItem.openCourseTime;

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
					let newTasks = [];
					thisItem.tasks.forEach((element,index) => {
						element.chapterId = thisItem.chapterId;
						if(element.taskType == "video"){
							videoTime+=element.studyTime ? element.studyTime : 0;
							newTasks.push(element);
							videoTotal++;
							if(element.state){
								videoCompleted++;
							}else{
								if(element.progress){
									videoOngoing++;
								}else{
									videoNotstarted++;
								}
							}
						}else if(element.taskType == "exam"){
							
							if(element.state){
								examCompleted++;
							}else{
								if(element.progress){
									examOngoing++;
								}else{
									examNotstarted++;
								}
							}
							if(element.taskLevel == "practice"){ // 练习
								examTime+=element.studyTime ? element.studyTime : 0;
								examTotal++;
								newTasks.push(element);
							}else if(element.taskLevel == "appraisal"){ // 测评
								evaluationTime+=element.studyTime ? element.studyTime : 0;
								element.isFree = thisItem.isFree;
								weekTask.push(element);
								// thisItem.tasks.splice(index,1);
								evaluationId = element.id;
								evaluationStatus = element.state;
							}else if(element.taskLevel == "midterm"){ // 期中
								evaluationTime+=element.studyTime ? element.studyTime : 0;
								element.isFree = thisItem.isFree;
								weekTask.push(element);
								// thisItem.tasks.splice(index,1);
							}else if(element.taskLevel == "end"){ // 期末
								evaluationTime+=element.studyTime ? element.studyTime : 0;
								element.isFree = thisItem.isFree;
								weekTask.push(element);
								// thisItem.tasks.splice(index,1);
							}else if(element.taskLevel == "core"){ // 核心
								examTime+=element.studyTime ? element.studyTime : 0;
								examTotal++;
								newTasks.push(element);
							}else if(element.taskLevel == "extension"){ // 扩展
								examTime+=element.studyTime ? element.studyTime : 0;
								examTotal++;
								newTasks.push(element);
							}else if(element.taskLevel == "backup"){ // 备份
								examTime+=element.studyTime ? element.studyTime : 0;
								examTotal++;
								newTasks.push(element);
							}
						}else if(element.taskType == "knowledgePointExercise"){
							examTime+=element.studyTime ? element.studyTime : 0;
							// evaluationStatus = 1;
							newTasks.push(element);
						}else if(element.taskType == "openCourse"){
							element.isFree = thisItem.isFree;
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
				}
				
				addCourseDetailList.push(thisItem);
			}
			if(endCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = false;
				itemStart = i;
				itemEnd = i;
				weekTotal = i;
				break;
			}
		}
		if(weekTaskTotal == weekDoneNum && weekStatus !== "notstarted"){
			weekDone = 1;
			weekStatus = "completed";
			weekTotalCompleted++;
		}

		taskTotal += weekTaskTotal;

		let studyTimeTotal = videoTime+examTime+evaluationTime;
		let evaluationTimePercentage = iGlobal.getProgress(evaluationTime,studyTimeTotal);
		let examTimePercentage = iGlobal.getProgress(examTime,studyTimeTotal);
		let videoTimePercentage = iGlobal.getProgress(videoTime,studyTimeTotal);

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

		courseDetailWeekList.push({
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
			'studyTime' : iGlobal.formatSeconds(videoTime+examTime+evaluationTime,'h'),
			'studyTimeFormat' : iGlobal.formatSeconds(videoTime+examTime+evaluationTime,'h'),
			'weekTime' : `${iGlobal.getDate(element.startDate)}-${iGlobal.getDate(element.endDate)}`,
			'startDate' : iGlobal.getDate(element.startDate),
			'endDate' : iGlobal.getDate(element.endDate),

			'taskTotal' : weekTaskTotal,
			'taskCompleted' : weekTaskCompleted,
			'taskOngoing' : weekTaskOngoing,
			'taskBeoverdue' : weekTaskBeoverdue,
			'taskNotstarted' : weekTaskNotstarted,

			'videoTotal' : videoTotal,
			'videoCompleted' : videoCompleted,
			'videoOngoing' : videoOngoing,
			'videoProgress' : iGlobal.getProgress(videoCompleted,videoTotal),
			'videoTime' : videoTime,
			'videoTimeFormat' : iGlobal.formatSeconds(videoTime,'h'),
			'videoTimePercentage' : videoTimePercentage,

			'examTotal' : examTotal,
			'examCompleted' : examCompleted,
			'examOngoing' : examOngoing,
			'examProgress' : iGlobal.getProgress(examCompleted,examTotal),
			'examTime' : examTime,
			'examTimeFormat' : iGlobal.formatSeconds(examTime,'h'),
			'examTimePercentage' : examTimePercentage,

			'evaluationId' : evaluationId,
			'evaluationStatus' : evaluationStatus,
			'evaluationTime' : evaluationTime,
			'evaluationTimeFormat' : iGlobal.formatSeconds(evaluationTime,'h'),
			'evaluationTimePercentage' : evaluationTimePercentage,

			'liveStatus' : liveStatus,
			'liveStatusText' : liveStatusText,
			'liveTime' : liveTime,
			'liveDate' : weekLiveDate
		})
	})

	return  {
		'weekIngNum' : weekIngNum,
		'isCoursePlan' : "true",
		'planInfo' : courseDetailWeekList,
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
			'dayTotal' : weekTotal*7,
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
module.exports = { classCourse }