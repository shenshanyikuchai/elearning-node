const iGlobal = require('../../global');
const constant = require('../../global/constant');
module.exports = async (ctx, next) => {
	if(ctx.query.token && ctx.query.memberId){
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
		if(ctxState.learningcourse && ctxState.learningcourse.length){
			learningcourse = ctxState.learningcourse;
			isLearningCourse = "1";
			if(ctxState.getCourseProgress && ctxState.getCourseProgress.length){
				getCourseProgress = ctxState.getCourseProgress;
				isCourseProgress = "1";
			}else{
				newRecentCourses = {
	    		"title" : "开始学习",
	    		"link" : [{
	    			"name" : "在学课程",
	    			"url" : `${constant.host.actionHostName}/mobileCourseStudyIn?token=${ctx.query.token}&memberId=${ctx.query.memberId}`,
	    			"relations" : "nextPage"
	    		}]
	    	}
			}
		}else{
			newRecentCourses = {
    		"title" : "开始新课程",
    		"link" : [{
    			"name" : "未激活课程",
    			"url" : `${constant.host.actionHostName}/mobileCourseNotActivated?token=${ctx.query.token}&memberId=${ctx.query.memberId}`,
    			"relations" : "nextPage"
    		}]
    	}
		}
		

		if(learningcourse.length && getCourseProgress.length){
			for(let i=0;i<learningcourse.length;i++){
				courseArr.push(learningcourse[i].courseId);
			}
			if(courseArr && courseArr.length){
				let newLastProgress = {
					RecentCourse : []
				};
				for(let i=0;i<learningcourse.length;i++){
					for(let j=0;j<getCourseProgress.length;j++){
						if(learningcourse[i].courseId == getCourseProgress[j].courseId && newLastProgress.RecentCourse.courseId != getCourseProgress[j].courseId){
							let addRecentCourse = true;
							if(newLastProgress.RecentCourse && newLastProgress.RecentCourse.length){
								for(let k = 0;k<newLastProgress.RecentCourse.length;k++){
									
									if(newLastProgress.RecentCourse[k].courseId == getCourseProgress[j].courseId){
										addRecentCourse = false;
									}
									
								}
							}
		          if(addRecentCourse){
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

		    if(recentCourses.length>4){
		    	recentCourses = recentCourses.slice(0,4)
		    }
		    
		    for(let i=0;i<recentCourses.length;i++){
		    	for (let j = 0;j<ctx.state.getExamDate.length;j++) {
		    		if(recentCourses[i].subjectID == ctx.state.getExamDate[j].categoryId){
		    			recentCourses[i].examinationDate = ctx.state.getExamDate[j].examinationDate
		    		}
		    	}

		    	let courseName = "";
		    	if(recentCourses[i].courseName){
		    		courseName = recentCourses[i].courseName;
		    	}
		    	let courseId = "";
		    	if(recentCourses[i].courseId){
		    		courseId = recentCourses[i].courseId;
		    	}
		    	let versionId = "";
		    	if(recentCourses[i].versionId){
		    		versionId = (recentCourses[i].versionId).toString();
		    	}
		    	let courseBkImage = "";
		    	if(recentCourses[i].courseBkImage){
		    		courseBkImage = (constant.host.static+recentCourses[i].courseBkImage).toString();
		    	}
		    	let examinationDate = "";
		    	if(recentCourses[i].examinationDate){
		    		examinationDate = iGlobal.getDate(recentCourses[i].examinationDate);
		    	}
		    	let expirationTime = "";
		    	if(recentCourses[i].expirationTime){
		    		expirationTime = iGlobal.getDate(recentCourses[i].expirationTime);
		    	}
		    	
		    	let percentages = iGlobal.getPercentage({
		    		"progress" : recentCourses[i].courseProgress,
		    		"total" : recentCourses[i].taskTotal,
		    		"lastPorgress" : recentCourses[i].progress
		    	})
		    	
		    	
		    	newRecentCourses.push({
		    		"courseName" : courseName,// 课程名称
		    		"courseId" : courseId,// 课程id
		    		"versionId" : versionId,// 课程版本id
		    		"courseBkImage" : courseBkImage,// 课程背景
		    		"examinationDate" : examinationDate,// 考试时间
		    		"expirationTime" : expirationTime,//课程到期
		    		"taskProgress" : percentages.progress.toString(),// 任务进度
		    		"taskTotal" : percentages.total.toString(),// 任务总数
		    		"taskPercentage" : percentages.percentage.toString(),// 任务百分比
		    		"link" : [{
		    			"name" : "课程首页",
		    			"url" : `${constant.host.actionHostName}/courseIndex?token=${ctx.query.token}&memberId=${ctx.query.memberId}&courseId=${courseId}`,
		    			"relations" : "nextPage"
		    		}]
		    	})

		    }
			}
		}
		if(ctxState.slideList){
			slideList = ctxState.slideList;
		}
		if(slideList.length){
			for(let i=0;i<slideList.length;i++){
				activityList.push({
					url : slideList[i].url,
					imagePath : constant.host.static+slideList[i].imagePath,
					title : slideList[i].title
				})
			}
		}

		let loginTimeago = '';
		if(ctxState.getLoginLog && ctxState.getLoginLog.length){
			loginTimeago = ctxState.getLoginLog[0] ? iGlobal.timeago(ctxState.getLoginLog[0].loginTime/1000) : "第一次登录";
		}

		let mycount = {
			"nodeNum" : "0",
			"acNum" : "0"
		};
		if(ctxState.mycount){
			mycount.nodeNum = ctxState.mycount.nodeNum;
			mycount.nodeNum = ctxState.mycount.questionNum + ctxState.mycount.discuss;
		}

		let messageUnRead = {};
		if(ctxState.messageListNoRead && ctxState.messageListNoRead.length){
			let data = ctxState.messageListNoRead[0];
			let type = 0;
			if(data.msgType == "1" && data.title == "意见反馈"){
				type = 2;
			}else if(data.msgType == "1" && data.title != "意见反馈"){
				type = 1;
			}else if(data.msgType == "0"){
				type = 3;
			}

			messageUnRead = {
				"messageType" : "1",
				"title" : data.title,
				"content" : iGlobal.entities(data.content),
				"sender" : data.sender,
				"sentTime" :iGlobal.timeago(data.sentTime),
				"isNoReadNum" : ctxState.messageListNoReadTotalCount.toString()
			}
		}

		
		ctx.state.data = {
			recentCourses : newRecentCourses,
			isLearningCourse : isLearningCourse,
			activityList : activityList,
			isCourseProgress : isCourseProgress,
			loginTimeago : loginTimeago,
			messageListNoRead : messageUnRead,
			mycount : mycount
		}
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}