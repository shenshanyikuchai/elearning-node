const axios = require('axios');
const Request = require('../../request');
const Filter = require('../../filter');

module.exports = async(ctx, next) => {
	await axios.all([Request.ajax({
    server: "messageListNoRead",
    ctxState: ctx.state,
    data: {
      token: ctx.query.token,
      isRead: "0",
      pageNo: 1,
      pageSize: 20
    }
  }),Request.ajax({
    server: "getappdownloadinfo",
    ctxState: ctx.state,
    data: {
      appId:'aPhoneCourse'
    }
  }),Request.ajax({
    server: "getappdownloadinfo",
    ctxState: ctx.state,
    data: {
      appId:'aPadCourse'
    }
  })]).then(axios.spread(function(messageListUnRead, aPhoneCourse, aPadCourse) {

  	let messageListUnReadData = messageListUnRead.data;
  	if(messageListUnReadData && messageListUnReadData.length){
  	  ctx.state.messageListUnRead = messageListUnReadData[0];
  	  ctx.state.messageListUnReadTotalCount = messageListUnRead.totalCount;
  	}else{
  	  ctx.state.messageListUnRead = [];
  	  ctx.state.messageListUnReadTotalCount = 0;
  	}

  	if(aPhoneCourse){
  		ctx.state.aPhoneCourse = aPhoneCourse;
  	}else{
  		ctx.state.aPhoneCourse = '';
  	}
  	if(aPadCourse){
  		ctx.state.aPadCourse = aPadCourse;
  	}else{
  		ctx.state.aPadCourse = '';
  	}
  	ctx.state.data = Filter.header({
  		messageListUnRead : ctx.state.messageListUnRead,
  		messageListUnReadTotalCount : ctx.state.messageListUnReadTotalCount,
  		aPhoneCourse : ctx.state.aPhoneCourse,
  		aPadCourse : ctx.state.aPadCourse
  	})
  	// ctx.state.data = Filter.header({
  	// 	messageListUnRead : ctx.state.messageListUnRead,
  	// 	tasksProgress : ctx.state.getTasksProgress,
  	// 	txamDate : ctx.state.getExamDate,
  	// 	memberGetplan : ctx.state.memberGetplan,
  	// 	courseactivestatus : ctx.state.courseactivestatus
  	// });
  	return next();

  }));
}