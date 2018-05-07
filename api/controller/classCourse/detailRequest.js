const axios = require('axios');
const Request = require('../../request');

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
  }),Request.ajax({
  	server : "getExamDate",
  	ctxState : ctx.state,
  	data : {
  		memberId: ctx.query.memberId
  	}
  })]).then(axios.spread(function (courseDetail, getTasksProgress, getExamDate) {
  	let courseDetailData = courseDetail.data;
  	let getTasksProgressData = getTasksProgress.data;
  	let getExamDateData = getExamDate.data;
  	if(courseDetailData && courseDetailData.length){
  		ctx.state.courseDetail = courseDetailData[0];
  	}else{
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
  	if(getExamDateData && getExamDateData.length){
  		ctx.state.getExamDate = getExamDateData;
  	}else{
  		ctx.state.getExamDate = [];
  	}
  	return next();
  }))
}