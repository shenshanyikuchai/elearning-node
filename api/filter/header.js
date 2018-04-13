const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

function header(payload){
	// messageListUnRead messageListUnReadTotalCount aPhoneCourse aPadCourse
	let headerRender = {};
	headerRender.messageUnRead = [];
	if(payload.messageListUnRead.data && payload.messageListUnRead.data.length){
		headerRender.messageUnRead = filterUnRead(payload.messageListUnRead);
	}
	if(payload.aPhoneCourse){
		headerRender.aPhoneCourseUrl = `${constant.host.static}${payload.aPhoneCourse.appUrl}`;
	}
	
	if(payload.aPadCourse){
		headerRender.aPadCourseUrl = `${constant.host.static}${payload.aPadCourse.appUrl}`;
	}
	return headerRender; 
}
function filterUnRead(message){
	console.log(message)
	let messageType = 0;
	let title = message.title;
	let content = iGlobal.entities(message.content);
	let sender = message.sender;
	let sentTime = iGlobal.getDate(message.sentTime);
	if(message.msgType == "1" && title == "意见反馈"){
		messageType = 2;
	}else if(message.msgType == "1" && title != "意见反馈"){
		messageType = 1;
	}else if(message.msgType == "0"){
		messageType = 3;
	}
	return {
		messageType : messageType,
		title : title,
		content : content,
		sender : sender,
		sentTime : sentTime
	}
}
module.exports = header;