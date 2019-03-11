const axios = require('axios');
const Request = require('../../../request');

module.exports = async(ctx, next) => {
  // ctx.state.mock = true;
	await axios.all([Request.ajax({
  	server : "courseDetail",
    ctxState : ctx.state,
  	data : {
  	  courseId: ctx.query.courseId
  	}
  }),Request.ajax({
  	server : "actionGetTasksProgress",
  	ctxState : ctx.state,
  	data : {
  		token: ctx.query.token,
  		memberId: ctx.query.memberId,
  		courseId: ctx.query.courseId
  	}
  })]).then(axios.spread(async function (courseDetail, getTasksProgress) {
    
    let isNext = true;
  	let courseDetailData = courseDetail.data;
  	let getTasksProgressData = getTasksProgress.data;
  	if(courseDetailData && courseDetailData.length){
      ctx.state.isCourseDetail = true;
  		ctx.state.courseDetail = courseDetailData[0];
  	}else{
      isNext = false;
      ctx.state.isCourseDetail = false;
  		ctx.state.courseDetail = {
  			subjectId : '',
  			versionId : ''
  		};
  	}
  	if(getTasksProgressData && getTasksProgressData.length){
  		ctx.state.getTasksProgress = getTasksProgressData;
  	}else{
  		ctx.state.getTasksProgress = [];
  	}
  	
  	if(isNext){
      return next();
    }
  }))
}