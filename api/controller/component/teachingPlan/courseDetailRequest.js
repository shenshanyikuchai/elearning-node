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
  }),Request.ajax({
  	server : "getExamDate",
  	ctxState : ctx.state,
  	data : {
  		memberId: ctx.query.memberId
  	}
  })]).then(axios.spread(async function (courseDetail, getTasksProgress, getExamDate) {
    // if(courseDetail.isMock && ctx.query.courseId == "554aa8fa367aad25d49ef902709bd327"){
    //   ctx.state.mock = true;
    //   await Request.ajax({
    //     server : "courseDetail",
    //     mock: '/mock/courseDetail-554aa8fa367aad25d49ef902709bd327.json',
    //     ctxState : ctx.state,
    //     data : {
    //       courseId: ctx.query.courseId
    //     }
    //   }).then((res) => {
    //     ctx.state.mock = false;
    //     courseDetail = res;
    //   })
    // }
		let isNext = true;
		
  	let courseDetailData = courseDetail.data;
  	let getTasksProgressData = getTasksProgress.data;
  	let getExamDateData = getExamDate.data;
  	if(courseDetailData && courseDetailData.length){
      ctx.state.isCourseDetail = true;
  		ctx.state.courseDetail = courseDetailData[0];
  	}else{
      // isNext = false;
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
  	if(getExamDateData && getExamDateData.length){
  		ctx.state.getExamDate = getExamDateData;
  	}else{
  		ctx.state.getExamDate = [];
  	}
  	if(isNext){
      return next();
    }
  }))
}