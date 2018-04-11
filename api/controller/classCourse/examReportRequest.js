const axios = require('axios');
const Request = require('../../request');
const _ = require('lodash');
module.exports = async(ctx, next) => {
	await axios.all([Request.ajax({
  	server : "userExamStatus",
    ctxState : ctx.state,
  	data : {
      member_id: ctx.query.memberId,
      type : 4,
      knowledge_points: ctx.query.knowledgePointId,
      examenNum : ctx.query.examenNum
  	}
  }),Request.ajax({
  	server : "userExerciseStatus",
  	ctxState : ctx.state,
  	data : {
  		knowledge_point_id: ctx.query.knowledgePointId,
      member_id: ctx.query.memberId,
      examenNum : ctx.query.examenNum,
      pageNo : 1,
      pageSize : 20
  	}
  }),Request.ajax({
    server : "getExerciseBaseInfo",
    ctxState : ctx.state,
    data : {
      examenId : ctx.query.knowledgePointId
    }
  })]).then(axios.spread(function (userExamStatus, userExerciseStatus, getExerciseBaseInfo) {
  	let userExamStatusData = userExamStatus.data;
  	let userExerciseStatusData = userExerciseStatus.data;
    let getExerciseBaseInfoData = getExerciseBaseInfo.data;
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
    if(getExerciseBaseInfoData && getExerciseBaseInfoData.length){
      ctx.state.getExerciseBaseInfo = getExerciseBaseInfoData;
      ctx.state.exerciseIds = _.map(getExerciseBaseInfoData, 'id');
    }else{
      ctx.state.getExerciseBaseInfo = {};
    }
  	return next();
  }))
}