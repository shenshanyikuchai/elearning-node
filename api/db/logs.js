function logs(ctx){
	const dbLogs = ctx.dbs.get('logs');
	
	dbLogs.insert({
		createTime : ctx.state.newTime, // 创建时间
		endTime: new Date().getTime(), // 结束时间
		URL : ctx.URL, // URL
		query : ctx.query,  // 获取到的是url这样传递的数据，http://xxx/1.php?wo='chen'&age='123'
		params : ctx.params,  // 获取到的是以路由 router.get('/:name') 形式   ,http://xxx/123
		requestBody : ctx.request.body, // 后台获取客户端post发来的数据
		userAgent : ctx.userAgent, // UA
		fail : ZBG.iGlobal.filterFail(ctx.state.fail), // 错误信息
	},(err, doc) => {
	  // if (err) throw err;
	  
	})
}
module.exports = logs;