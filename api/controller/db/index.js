module.exports = async (ctx, next) => {
	// let data = await ctx.db.get('user').find({}, {sort: {name: 1}})
	if(ctx.query.pageNo && ctx.query.pageSize){
		await next();
		ctx.body = await ZBG.DB.getLogs(ctx);
	}else{
		ctx.state.response = ZBG.COMMON.response.noparameter;
	}
}