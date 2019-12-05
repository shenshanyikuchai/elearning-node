module.exports = async (ctx, next) => {
	await ZBG.Request.ajax({
		server: 'learningcourse',
		ctxState: ctx.state,
		data: {
			techType: ctx.query.type || 'onlinecourse',
			token: ctx.query.token,
			pageNo: 0,
			pageSize: 999
		}
	}).then(async (res) => {
		if(res.data && res.data.courselist && res.data.courselist.length){
			ctx.state.learningcourse = res.data.courselist;
			return next();
		}
	})
	
}