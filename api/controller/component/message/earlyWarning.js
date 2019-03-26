
module.exports = async(ctx, next) => {
	let isRequest = true;
	for(let i = ctx.state.requestData.classIndex;i<ctx.state.requestData.classIdLength;i++){
		await ZBG.Request.ajax({
		  server : 'bbslist',
		  ctxState : ctx.state,
		  data : {
	  		token:ctx.query.token,
	  		memberId:ctx.query.memberId,
	  		classId:ctx.state.requestData.classIdArr[i],
	  		pageNo:ctx.state.requestData.pageNo,
	  		pageSize:ctx.state.requestData.pageSize,
	  		self:0,
	  		type:3,
	  		time:24,
	  		ordertype:1,
	  		
	  		// subjectId:,
	  		// keyWords:,
	  		// courseId:,
	  		// solve:,
	  		// taskType:,
	  		// chapterId:
	  	}
		}).then((res) => {
			
			if(res.state == "success"){
				if(res.data && res.data.length){
					ctx.state.requestData.data.push(...res.data);
					if(ctx.state.requestData.data.legnth >= ctx.state.requestData.pageSize){
						isRequest = false;
					}
					ctx.state.requestData.totalCount = res.totalCount;
					ctx.state.requestData.classIndex = i;
				}else{

				}
				// return next();
			}else{
				isRequest = false;
			}
		})
		if(isRequest){
			
		}else{
			break;
		}
	}
	let ctxData = [];
	if(ctx.state.requestData.data.length >= ctx.state.requestData.pageSize){
		ctxData = ctx.state.requestData.data.splice(0,ctx.state.requestData.pageSize);
	}else{
		ctxData = ctx.state.requestData.data;
	}
	ctx.state.earlyWarning = {
		pageNo: ctx.state.requestData.pageNo,
		pageSize: ctx.state.requestData.pageSize,
		data : ctxData
	};
	if(ctx.state.isNew){
		ZBG.earlyWarning.push(ctx.state.requestData)
	}
	
  return next();
}