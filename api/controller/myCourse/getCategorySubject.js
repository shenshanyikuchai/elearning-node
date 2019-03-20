
module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.token){
		await next();
		ctx.state.data = ZBG.Filter.getCategorySubject({
			classCourseList: ctx.state.classCourseList,
			learningcourse: ctx.state.learningcourse
		})

	}else{
		ctx.state.response = ZBG.constant.response.noparameter;
	}
}