/*
*  回复帖子
*/

module.exports = async(ctx, next) => {
	console.log(ctx.request.body)
	await ZBG.Request.ajax({
		server: 'bbsreply',
		ctxState: ctx.state,
		data: ctx.request.body
	}).then(async(res) => {
		if (res.state == "success") {
			ctx.state.memberId = ctx.request.body.memberId;
			// if(ctx.state.postId){
			// 	return next();
			// }else{
				await ZBG.Request.ajax({
				  server : 'bbslist_myJoin',
				  ctxState : ctx.state,
				  data : {
			  		token: ctx.request.body.token,
			  		type: 3,
			  		subjectId: '',
			  		keyWords: '',
			  		ordertype: 1,
			  		pageNo: 1,
			  		pageSize: 1,
			  		taskType: '',
			  		solve: '',
			  	}
				}).then((res) => {
					
					if(res.state == "success" && res.data.length){
						let bbslist_myJoin = res.data[0];
						ctx.state.nikeName = bbslist_myJoin.nikeName;
						ctx.state.postId = bbslist_myJoin.id;

						ctx.state.courseId = bbslist_myJoin.courseId;
						ctx.state.chapterId = bbslist_myJoin.chapterId;
						
						ctx.state.postId = bbslist_myJoin.id;
						ctx.state.title = bbslist_myJoin.title;
						ctx.state.content = bbslist_myJoin.content;

						return next();
					}
				})
			// }
		} else {
			ctx.state.data = res;
		}
	})
}