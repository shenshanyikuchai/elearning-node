const iGlobal = require('../../global');
const constant = require('../../global/constant');
const Filter = require('../../filter');

module.exports = async(ctx, next) => {
	ctx.state.mock = true;
	if(ctx.query.memberId && ctx.query.knowledgePointId && ctx.query.examenNum){
		await next();
		ctx.state.data = Filter.examReport({
			userExamStatus : ctx.state.userExamStatus,
			userExerciseStatus : ctx.state.userExerciseStatus
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}