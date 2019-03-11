const iGlobal = require('../../../global');
const constant = require('../../../global/constant');
const Filter = require('../../../filter');

module.exports = async (ctx, next) => {
	
	if (ctx.query.courseId) {
		await next();
		if(ctx.state.exerciseIdList && ctx.state.exerciseIdList.chapters){
			ctx.state.data = Filter.exerciseIdList({
				exerciseIdList: ctx.state.exerciseIdList
			})
		}else{
			ctx.state.data = {}
		}
		
	} else {
		ctx.state.response = constant.response.noparameter;
	}
}