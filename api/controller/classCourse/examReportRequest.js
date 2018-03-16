const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
	ctx.state.mock = true;
	await axios.all([Request.ajax({
  	server : "userExamStatus",
    ctxState : ctx.state,
  	data : {
  	  member_id: ctx.query.memberId,
  		knowledge_point_id: ctx.query.knowledgePointId,
  		examenNum : ctx.query.examenNum
  	}
  }),Request.ajax({
  	server : "userExerciseStatus",
  	ctxState : ctx.state,
  	data : {
  		member_id: ctx.query.memberId,
  		knowledge_point_id: ctx.query.knowledgePointId,
  		examenNum : ctx.query.examenNum
  	}
  })]).then(axios.spread(function (userExamStatus, userExerciseStatus) {
  	let userExamStatusData = userExamStatus.data;
  	let userExerciseStatusData = userExerciseStatus.data;
  	if(userExamStatusData && userExamStatusData.length){
  		ctx.state.userExamStatus = userExamStatusData[0];
  	}else{
  		ctx.state.userExamStatus = {};
  	}
  	if(userExerciseStatusData && userExerciseStatusData.length){
  		ctx.state.userExerciseStatus = userExerciseStatusData;
  	}else{
  		ctx.state.userExerciseStatus = {};
  	}
  	return next();
  }))
}