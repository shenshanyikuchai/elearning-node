/*
*  教师帖子列表
*/

module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.classId){
		let classIdArr = ctx.query.classId.split(',');
		ctx.state.isNew = true;
		ctx.state.isNext = true;
		ctx.state.isData = true;
		ctx.state.requestData = {
			...ctx.query,
			classIdArr: classIdArr,
			classIdLength: classIdArr.length,
			classIndex: 0,
			classIdActive: classIdArr[0],
			tiem: "",
			pageNo: 1,
			pageSize: 20,
			totalCount: 0,
			data:[]
		}
		if(parseInt(ctx.query.isFirst)){
			if(ZBG.earlyWarning && ZBG.earlyWarning.length){
				for(let element of ZBG.earlyWarning){
					if(element.memberId == ctx.query.memberId){
						if(element.token == ctx.query.token && element.classId == ctx.query.classId){
							ctx.state.isNew = false;
							if((element.pageNo*element.pageSize) >= element.totalCount){
								ctx.state.isNext = false;
							}
							element.pageNo++;
							ctx.state.requestData = element;
							break;
						}else{

						}
					}
				}
			}
		}else{
			ZBG.earlyWarning = []
		}
		if(ctx.state.isNext){
			await next();
			ctx.state.data = ctx.state.earlyWarning;
		}else{
			ctx.state.data = {
				"totalCount":ctx.state.requestData.totalCount,
				"pageNo":ctx.state.requestData.pageNo,
				"pageSize":ctx.state.requestData.pageSize,
				"data":[],
				"state":"success",
				"msg":""
			}
		}
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}