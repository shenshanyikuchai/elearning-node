const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
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
  }),Request.ajax({
	  server : 'memberGetplan',
	  ctxState : ctx.state,
	  data : {
	    token: ctx.query.token,
	    courseCategoryId: ctx.query.courseCategoryId,
	    courseId: ctx.query.courseId
	  }
	})]).then(axios.spread(function (courseDetail, getTasksProgress, getExamDate, memberGetplan) {
		console.log(memberGetplan)
  	let courseDetailData = courseDetail.data;
  	let getTasksProgressData = getTasksProgress.data;
  	let getExamDateData = getExamDate.data;
  	let memberGetplanData = memberGetplan.data;
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
  	if(memberGetplanData && memberGetplanData.length){
  		ctx.state.memberGetplan = memberGetplanData;
  	}else{
  		ctx.state.memberGetplan = [];
  	}
  	return next();
  }))
}