const axios = require('axios');
const Request = require('../../request');
module.exports =  async(ctx, next) => {
  await axios.all([Request.ajax({
    server : "getExamDate",
    ctxState : ctx.state,
    data : {
      memberId: ctx.query.memberId
    }
  }),Request.ajax({
    server : "slideList",
    ctxState : ctx.state,
    data : {
      "tag": "0",
      "valid": "true",
      "count": "4"
    }
  }),Request.ajax({
    server : "learningcourse",
    ctxState : ctx.state,
    data : {
      token: ctx.query.token,
      pageNo: 1,
      pageSize: 999
    }
  })]).then(axios.spread(function (getExamDate, slideList, learningcourse) {
    let getExamDateData = getExamDate.data;
    let slideListData = slideList.data;
    let learningcourseData = learningcourse.data;
    
    if(getExamDateData && getExamDateData.length){
      ctx.state.getExamDate = getExamDateData;
    }else{
      ctx.state.getExamDate = [];
    }
    if(slideListData && slideListData.length){
      ctx.state.slideList = slideListData;
    }else{
      ctx.state.slideList = [];
    }
    let courseIds = [];
    if(learningcourseData && learningcourseData.courselist && learningcourseData.courselist.length){
      ctx.state.learningcourse = learningcourseData.courselist;
      let learningcourse = learningcourseData.courselist;
      let learningcourseLength = learningcourse.length;
      
      for(var i=0;i<learningcourseLength;i++){
        courseIds.push(learningcourse[i].courseId);
      }
      ctx.state.courseIds = courseIds.toString();
    }else{
      ctx.state.learningcourse = [];
    }
    if(courseIds && courseIds.length){
      return next();
    }
    
  }));
}