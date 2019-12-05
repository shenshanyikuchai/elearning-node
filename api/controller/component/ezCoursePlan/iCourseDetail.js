module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		if(ctx.state.isCourseDetail){
			let ezCoursePlanDetail = ctx.Filter.iEzCoursePlanDetail({
				UAType : ctx.state.UAType,
				courseDetail : ctx.state.courseDetail,
				tasksProgress : ctx.state.getTasksProgress,
				examDate : ctx.state.getExamDate,
				coursePlan : ctx.state.memberGetplan,
				courseactivestatus : ctx.state.courseactivestatus,
				getCourseArrange : ctx.state.getCourseArrange
			})
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
		}
	}else{
		ctx.state.response = ctx.constant.response.noparameter;
	}
}