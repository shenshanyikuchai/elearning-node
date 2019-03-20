/*
*  保存帖子
*/

module.exports = async(ctx, next) => {
	await ZBG.Request.ajax({
		server: 'bbssave',
		ctxState: ctx.state,
		data: ctx.request.body
	}).then(async(res) => {
		if (res.state == "success" && ctx.request.body.subjectId) {
			ctx.state.courseId = ctx.request.body.courseId;
			ctx.state.chapterId = ctx.request.body.chapterId;
			ctx.state.memberId = ctx.request.body.memberId;
			ctx.state.postId = ctx.request.body.postId;
			ctx.state.title = ctx.request.body.title;
			ctx.state.content = ctx.request.body.content;

			if(ctx.state.postId){
				return next();
			}else{
				await ZBG.Request.ajax({
				  server : 'bbslist',
				  ctxState : ctx.state,
				  data : {
			  		token: ctx.request.body.token,
			  		subjectId: ctx.request.body.subjectId,
			  		self: 1,
			  		ordertype: 1,
			  		pageNo: 1,
			  		pageSize: 1,
			  		type: 3,
			  		taskType: ctx.request.body.taskType,
			  		solve: ctx.request.body.solve,
			  		keyWords: ctx.request.body.keyWords
			  	}
				}).then((res) => {
					if(res.state == "success" && res.data.length){
						ctx.state.postId = res.data[0].id;
						ctx.state.nikeName = res.data[0].nikeName;
						return next();
					}
				})
			}
		} else {
			ctx.state.data = res;
		}
	})
}