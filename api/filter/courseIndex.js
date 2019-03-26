const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

var courseDetailList = [];
// var courseTimeTotalNum = 0;
// var courseDetailLevel = 0;

function courseIndex(payload){
	// courseDetail, tasksProgress, examDate, memberGetplan, courseactivestatus
	let courseRenderData = {};
	filterCourseDetail(payload.courseDetail.chapters);
	addTaskProgress(payload.tasksProgress);

	courseRenderData = getChapterListWeekList(payload.memberGetplan)
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
		if(element.tasks && element.tasks.length){
			let newTasks = [];
			let completedNum = 0;
			let ongoingNum = 0;
			let notstartedNum = 0;
			element.tasks.forEach(function(element,index){
				if(element.taskType == "video"){
					newTasks.push(element)
					// courseTimeTotalNum += (+element.videoTime);
					chapterTotalTime += (+element.videoTime);
				}else if(element.taskType == "exam"){
					newTasks.push(element)
					// courseTimeTotalNum += (+element.taskTime)*60;
					chapterTotalTime += (+element.taskTime)*60;
				}else if(element.taskType == "knowledgePointExercise"){
					newTasks.push(element)
					// courseTimeTotalNum += (120)*60;
					chapterTotalTime += (120)*60;
				}else if(element.taskType == "openCourse"){
					newTasks.push(element)
					// courseTimeTotalNum += (+element.taskTime);
					chapterTotalTime += (+element.taskTime);
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
				'isChildren' : false,
				'isFree' : element.isFree,
				'chapterTitle' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : true,
				'tasks' : newTasks,
				'completedNum' : completedNum,
				'ongoingNum' : ongoingNum,
				'notstartedNum' : notstartedNum,
				'chapterTotalTime' : chapterTotalTime,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true
			})
		}
		if(element.children && element.children.length){
			// courseDetailLevel++;
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : true,
				'isFree' : element.isFree,
				'chapterTitle' : element.chapterTitle,
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

						var studyTime = 0;
						if(thatTaskData.taskStudyTimeList && thatTaskData.taskStudyTimeList.length){
							thatTaskData.taskStudyTimeList.forEach(function(element, index){
								studyTime += parseInt(element.studyTime);
							})
						}

						chapterStudyTime+=studyTime;
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
						taskElement.percentage = iGlobal.getPercentage(thatTaskData.progress,thatTaskData.total);
					}else{
						notstartedNum++;
					}
				})
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
		return filterCourseDetailWeekPlan(courseDetailList,memberGetplan);
	}else{
		return filterCourseDetailPlan(courseDetailList);
	}
}
function filterCourseDetailPlan(courseData){
	return  {
		'isCoursePlan' : "false",
		'chapterList' : courseData
	}
}
function filterCourseDetailWeekPlan(courseData, planData){

	var courseDetailWeekList = [];
	var courseDetailLevel = 0;
	var weekTotalBeoverdue = 0;
	var taskTotalCompleted = 0;
	var taskTotalOngoing = 0;
	var taskTotalNotstarted = 0;
	var taskTotal = 0;
	var taskTotalBeoverdue = 0;

	var itemStart = 0;
	var newDate = new Date().getTime();
	planData.forEach(function(element,index){
		var startCategoryId = element.startCategoryId;
		var endCategoryId = element.endCategoryId;
		var addCourseDetailList = [];
		var addcourseDetailWeekList = false;
		var item = courseData;
		var itemLength = item.length;
		var itemEnd = 0;
		var tasksNum = 0;

		var weekStatus = "";
		var weekTaskTime = 0;
		var weekStudyTime = 0;
		var weekTaskOngoing = 0;
		var weekDone = 0;
		var weekDoneNum = 0;
		var weekTotal = 0;

		var weekTaskBeoverdue = 0;
		var weekTaskOngoing = 0;
		var weekTaskCompleted = 0;
		var weekTaskNotstarted = 0;
		if(element.startDate<newDate && element.endDate<newDate){
			weekStatus = "beoverdue";
			weekTotalBeoverdue++;
		}else if(element.startDate<newDate && newDate<element.endDate){
			weekStatus = "ongoing";
		}if(newDate<element.startDate && newDate<element.endDate){
			weekStatus = "notstarted";
		}
		
		for(var i=itemStart;i<itemLength;i++){
			weekTotal++;
			var thisItem = item[i];
			thisItem.index = i;
			if(startCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = true;
			}
			if(addcourseDetailWeekList){

				if(thisItem.isTasks){
					weekTaskTime += thisItem.chapterTotalTime;
					weekStudyTime += thisItem.chapterStudyTime;
					var taskLength = thisItem.tasks.length;
					tasksNum+=taskLength;
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
							taskTotalNotstarted+=taskLength
							break;
					}
				}
				addCourseDetailList.push(thisItem)
			}
			if(endCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = false;
				itemStart = i;
				itemEnd = i;
				weekTotal = i;
				break;
			}
		}
		if(tasksNum == weekDoneNum && weekStatus !== "notstarted"){
			weekDone = 1;
			weekStatus = "completed";
		}

		taskTotal += tasksNum;
		courseDetailWeekList.push({
			'planId' : element.id,
			'title' : element.planTitle,
			'startDate' : iGlobal.getDate(element.startDate),
			'endDate' : iGlobal.getDate(element.endDate),
			'isFinish' : element.isFinish,
			'list' : addCourseDetailList,
			'tasksNum' : tasksNum,
			'weekStatus' : weekStatus,
			'weekTaskTime' : weekTaskTime,
			'weekStudyTime' : weekStudyTime,
			'weekIsFinish' : weekDone,
			'weekTaskCompleted' : weekTaskCompleted,
			'weekTaskOngoing' : weekTaskOngoing,
			'weekTaskBeoverdue' : weekTaskBeoverdue,
			'weekTaskNotstarted' : weekTaskNotstarted
		})
	})
	return  {
		'isCoursePlan' : "true",
		'chapterListWeekList' : courseDetailWeekList,
		'taskTotalSummary' : {
			'total' : taskTotal,
			'beoverdue' : taskTotalBeoverdue,
			'completed' : taskTotalCompleted,
			'ongoing' : taskTotalOngoing,
			'notstarted' : taskTotalNotstarted
		},
		'weekTotalSummary' : {
			'beoverdue' : weekTotalBeoverdue
		}
	}
}
function courseByInFo(coursestatus){
	let lockStatus = "false";
	let courseActiveTime = 0;
	let courseExpirationTime = 0;
	let courseActiveState=0;
	let courseActiveStateInfo = "默认未购买";
	if(coursestatus && coursestatus.length){
		var lockStatusNum = 0;
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].lockStatus == 0){
				lockStatusNum++;
			}
		}
		if(!lockStatusNum){
			lockStatus = "true";
		}

		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].isExpiration == "false" && coursestatus[i].activeState == "acitve"){
				courseActiveTime = iGlobal.getDate(coursestatus[i].activeTime*1000);
				courseExpirationTime = iGlobal.getDate(coursestatus[i].expirationTime*1000);
			}
		}
		var datanow=(new Date().getTime())/1000;//当前时间戳
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime>datanow && courseActiveState<3){
				courseActiveState="3";//已激活未过期
				courseActiveStateInfo = "已激活未过期";
				break;
			}else if(coursestatus[i].activeState=="init" && courseActiveState<2){
				courseActiveState="2";//未激活
				courseActiveStateInfo = "未激活";
			}else if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime<datanow && courseActiveState<1){
				courseActiveState="1";//已激活已过期
				courseActiveStateInfo = "已激活已过期";
			}
			
		}
			
		if(courseActiveState && lockStatus){
			courseActiveState="4";//课程已锁定
			courseActiveStateInfo = "课程已锁定";
		}
		courseActiveState = courseActiveState;
	}else{

	}
	
	return {
		lockStatus : lockStatus,
		courseActiveTime : courseActiveTime,
		courseExpirationTime : courseExpirationTime,
		courseActiveState : courseActiveState,
		courseActiveStateInfo : courseActiveStateInfo
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
	let courseInfo = "";
	let courseModel = JSON.parse(courseDetail.courseModel);
	if(courseModel && courseModel.length){
		courseInfo = {
			courseModel : courseDetail.courseModel,
			img : constant.host.static + courseDetail.coverPath,
			video : courseDetail.firstVideo
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
module.exports = courseIndex