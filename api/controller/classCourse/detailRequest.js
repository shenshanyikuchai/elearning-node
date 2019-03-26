const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
<<<<<<< HEAD
  // ctx.state.mock = true;
=======
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
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
<<<<<<< HEAD
    if(typeof courseDetail == "string"){
      try{
        courseDetail = JSON.parse(courseDetail);
      }catch(err){
        console.log(err)
      }
      

    }
    let isNext = true;
=======
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
  	let courseDetailData = courseDetail.data;
  	let getTasksProgressData = getTasksProgress.data;
  	let getExamDateData = getExamDate.data;
  	if(courseDetailData && courseDetailData.length){
  		ctx.state.courseDetail = courseDetailData[0];
  	}else{
<<<<<<< HEAD
      isNext = false;
=======
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
  		ctx.state.courseDetail = {
  			subjectId : '',
  			versionId : ''
  		};
  	}
  	if(getTasksProgressData && getTasksProgressData.length){
  		ctx.state.getTasksProgress = getTasksProgressData;
  	}else{
<<<<<<< HEAD

=======
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
  		ctx.state.getTasksProgress = [];
  	}
  	if(getExamDateData && getExamDateData.length){
  		ctx.state.getExamDate = getExamDateData;
  	}else{
  		ctx.state.getExamDate = [];
  	}
<<<<<<< HEAD
    if(isNext){
      return next();
    }
  	
=======
  	return next();
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
  }))
}