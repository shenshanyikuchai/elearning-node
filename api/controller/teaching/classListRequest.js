const axios = require('axios');
const Request = require('../../request');
const constant = require('../../global/constant');
const _ = require('lodash');

module.exports = async(ctx, next) => {
	let type = "";
	constant.userLevel.forEach((element, index) => {
		if(element.id == ctx.query.userLevel){
			type = element.type;
		}
	})
	await Request.ajax({
		server : "getTeacherClass",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token,
			type: type
		}
	}).then(async (res) => {

		let teacherClass = _.uniqBy(res.data, 'id');
		for(let elementClass of teacherClass){
			await Request.ajax({
	    	server : "getClassCourse",
	    	ctxState : ctx.state,
	    	data : {
	    		classId : elementClass.id
	    	}
	    }).then(async (res) => {
	    	elementClass.courseList = res.data;
	    	// for(let elementCourse of res.data){
	    	// 	ctx.state.mock = true;
	    	// 	await Request.ajax({
	    	// 	  server : 'memberGetplan',
	    	// 	  ctxState : ctx.state,
	    	// 	  data : {
	    	// 	    token: ctx.query.token,
	    	// 	    courseCategoryId: elementCourse.courseCategoryId,
	    	// 	    courseId: elementCourse.courseId
	    	// 	  }
	    	// 	}).then(async (res) => {
	    	// 		elementCourse.planList = res.data;
	    	// 	})
	    	// }
	    	// ctx.state.mock = false;
	    })
		}
		ctx.state.teacherClass = teacherClass;
		return next();
	})
}