const iGlobal = require('../../global');
const constant = require('../../global/constant');
const Filter = require('../../filter');

module.exports = async(ctx, next) => {
	if(ctx.query.memberId && ctx.query.knowledgePointId && ctx.query.examenNum){
		await next();
		ctx.state.data = Filter.examReport({
			exam : ctx.state.userExamStatus,
			exercise : ctx.state.userExerciseStatus,
			baseInfo : ctx.state.getExerciseBaseInfo,
			knowledge : ctx.state.knowledges
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}