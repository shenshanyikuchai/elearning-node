module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		if(ctx.state.isCourseDetail){
<<<<<<< HEAD
			let ezCoursePlanDetail = ctx.Filter.ezCoursePlanDetail({
=======
			ctx.state.data = ctx.Filter.ezCoursePlanDetail({
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
				UAType : ctx.state.UAType,
				courseDetail : ctx.state.courseDetail,
				tasksProgress : ctx.state.getTasksProgress,
				examDate : ctx.state.getExamDate,
				coursePlan : ctx.state.memberGetplan,
				courseactivestatus : ctx.state.courseactivestatus,
				getCourseArrange : ctx.state.getCourseArrange
			})
<<<<<<< HEAD
			
			ZBG.Request.ajax({
				server : 'studyPlanProgressSave',
				ctxState : ctx.state,
				data : {
					token: ctx.query.token,
					planStatusInfo: JSON.stringify(ezCoursePlanDetail.weekStatus)
				}
			}).then((res) => {
				
			})
			ctx.state.data = ezCoursePlanDetail
=======
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
		}
	}else{
		ctx.state.response = ctx.constant.response.noparameter;
	}
}