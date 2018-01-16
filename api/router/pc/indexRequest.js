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
  }),Request.ajax({
    server : "getLoginLog",
    ctxState : ctx.state,
    data : {
      memberid: ctx.query.memberId,
      pageNo: 1,
      pageSize: 1
    }
  }),Request.ajax({
    server : "messageListNoRead",
    ctxState : ctx.state,
    data : {
      token: ctx.query.token,
      isRead : "0",
      pageNo: 1,
      pageSize: 20
    }
  }),Request.ajax({
    server : "mycount",
    ctxState : ctx.state,
    data : {
      token: ctx.query.token
    }
  })]).then(axios.spread(function (getExamDate, slideList, learningcourse, getLoginLog, messageListNoRead, mycount) {
    let getExamDateData = getExamDate.data;
    let slideListData = slideList.data;
    let learningcourseData = learningcourse.data;
    let getLoginLogData = getLoginLog.data;
    let messageListNoReadData = messageListNoRead.data;
    let mycountData = mycount.data;
    
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
    if(learningcourseData && learningcourseData.courselist && learningcourseData.courselist.length){
      ctx.state.learningcourse = learningcourseData.courselist;

      let learningcourse = learningcourseData.courselist;
      let learningcourseLength = learningcourse.length;
      let courseIds = [];
      for(var i=0;i<learningcourseLength;i++){
        courseIds.push(learningcourse[i].courseId);
      }
      ctx.state.courseIds = courseIds.toString();
    }else{
      ctx.state.learningcourse = [];
    }

    if(getLoginLogData && getLoginLogData.length){
      ctx.state.getLoginLog = getLoginLogData;
    }else{
      ctx.state.getLoginLog = [];
    }

    if(messageListNoReadData.data && messageListNoReadData.data.length){
      ctx.state.messageListNoRead = messageListNoReadData.data;
      ctx.state.messageListNoReadTotalCount = messageListNoReadData.totalCount;
    }else{
      ctx.state.messageListNoRead = [];
      ctx.state.messageListNoReadTotalCount = 0;
    }
    if(mycountData && mycountData.nodeNum){
      ctx.state.mycount = mycountData;
    }else{
      ctx.state.mycount = [];
    }
    return next();
  }));
}