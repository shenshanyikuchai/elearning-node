
module.exports = async(ctx, next) => {
	await ZBG.Request.ajax({
	  server : 'bbslist',
	  ctxState : ctx.state,
	  data : {
  		token: ctx.state.bbssaveData.token,
  		subjectId: ctx.state.bbssaveData.subjectId,
  		self: 1,
  		ordertype: 1,
  		pageNo: 1,
  		pageSize: 1,
  		type: 3,
  		taskType: ctx.state.bbssaveData.taskType,
  		solve: ctx.state.bbssaveData.solve,
  		keyWords: ctx.state.bbssaveData.keyWords
  	}
	}).then((res) => {
		if(res.state == "success" && res.data && res.data.length){
			ctx.state.bbssaveData.postId = res.data[0].id
			return next();
		}
	})
  
}