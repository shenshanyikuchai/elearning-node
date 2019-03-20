const axios = require('axios');
const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async(ctx, next) => {
	let hostName = '';
	if (process.env.NODE_ENV == "dev"){
		hostName = COMMON.host.apiDev;
	}else if(process.env.NODE_ENV == "demo"){
		hostName = COMMON.host.apiDemo;
	}else{
		hostName = COMMON.host.api;
	}
	
	let exerciseIds = "";
	if(ctx.state.exerciseIds){
		exerciseIds = ctx.state.exerciseIds.toString()
	}
	console.log(`${hostName}/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds?exerciseIds=${exerciseIds}`)
	await axios.post(`${hostName}/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds`, {
			params: {
				exerciseIds: exerciseIds
			}
		}).then((res) => {
				ctx.state.knowledges = res.data;
    return next();
  }).catch(function (error) {
    
  });
<<<<<<< HEAD
=======
 
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
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
}