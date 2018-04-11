const axios = require('axios');
const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async(ctx, next) => {
	let hostName = '';
	if(process.env.NODE_ENV == "demo"){
		hostName = COMMON.host.demoName;
	}else{
		hostName = COMMON.host.name;
	}
	console.log(`${hostName}/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds?exerciseIds=${ctx.state.exerciseIds.toString()}`)
	await axios.get(`${hostName}/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds`, {
    params: {
      exerciseIds: ctx.state.exerciseIds.toString()
    }
  }).then((res) => {
    ctx.state.knowledges = res.data;
    return next();
  }).catch(function (error) {
    
  });
	// await Request.ajax({
	//   server : 'getKnowledgePointInfoByExerciseIds',
	//   ctxState : ctx.state,
	//   data : {
 //  		exerciseIds: ctx.state.exerciseIds
 //  	}
	// }).then((res) => {
	//   console.log(JSON.stringify(res))
	//   ctx.state.knowledges = res.data;
	//   return next();
	// })
}