const Request = require('../../request');
const axios = require('axios');
module.exports = async(ctx, next) => {
	console.log(ctx.state.exerciseIds.toString())
	await axios.get('http://192.168.10.112:8083/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds', {
    params: {
      exerciseIds: ctx.state.exerciseIds.toString()
    }
  }).then((res) => {
    ctx.state.knowledges = res.data;
    return next();
  }).catch(function (error) {
    console.log(error);
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