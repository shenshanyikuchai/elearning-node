const iGlobal = require('../../global');

module.exports = async (ctx, next) => {
	await next();
	let ctxState = ctx.state;
	let learningcourse = [];
	let isLearningCurse = "0";
	let getCourseProgress = [];
	let isCourseProgress = "0";
	let courseArr = [];
	let recentCourses = [];
	let slideList = [];
	let activityList = [];
	if(ctxState.learningcourse){
		learningcourse = ctxState.learningcourse;
		isLearningCurse = "1";
	}
	if(ctxState.getCourseProgress){
		getCourseProgress = ctxState.getCourseProgress;
		isCourseProgress = "1";
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

	            let courseName = "";
	            if(learningcourse[j].courseName){
	            	courseName = learningcourse[j].courseName;
	            }
	            let courseId = "";
	            if(learningcourse[j].courseId){
	            	courseId = learningcourse[j].courseId;
	            }
	            let versionId = "";
	            if(learningcourse[j].versionId){
	            	versionId = (learningcourse[j].versionId).toString();
	            }
	            let courseBkImage = "";
	            if(learningcourse[j].courseBkImage){
	            	courseBkImage = ('http://exstatic.zbgedu.com'+learningcourse[j].courseBkImage).toString();
	            }
	            let examinationDate = "";
	            if(learningcourse[j].examinationDate){
	            	examinationDate = iGlobal.getDate(learningcourse[i].examinationDate);
	            }
	            let expirationTime = "";
	            if(learningcourse[j].expirationTime){
	            	expirationTime = iGlobal.getDate(learningcourse[i].expirationTime);
	            }
	            
	            let percentages = iGlobal.getPercentage({
	            	"progress" : learningcourse[j].courseProgress,
	            	"total" : learningcourse[j].taskTotal,
	            	"lastPorgress" : learningcourse[j].progress
	            })
	            
	            
	            newLastProgress.RecentCourse.push({
	            	"courseName" : courseName,// 课程名称
	            	"courseId" : courseId,// 课程id
	            	"versionId" : versionId,// 课程版本id
	            	"courseBkImage" : courseBkImage,// 课程背景
	            	"examinationDate" : examinationDate,// 考试时间
	            	"expirationTime" : expirationTime,//课程到期
	            	"taskProgress" : percentages.progress.toString(),// 任务进度
	            	"taskTotal" : percentages.total.toString(),// 任务总数
	            	"taskPercentage" : percentages.percentage.toString()// 任务百分比
	            })
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
				imagePath : 'http://exstatic.zbgedu.com'+slideList[i].imagePath,
				title : slideList[i].title
			})
		}
	}
	ctx.state.response = {
		recentCourses : recentCourses,
		isLearningCurse : isLearningCurse,
		activityList : activityList,
		isCourseProgress : isCourseProgress
	}
}