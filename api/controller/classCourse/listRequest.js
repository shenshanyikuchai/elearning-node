const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
		server : "classCourseList",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token
		}
	}).then(async (res) => {

		let classCourseList = res;
		for(let elementClassCourse of classCourseList.data){
			if(elementClassCourse.classCourse.length){
				for (let courseElement of elementClassCourse.classCourse) {
			    ctx.state.mock = false;
			    await Request.ajax({
			    	server : "courseBaseInfo",
			    	ctxState : ctx.state,
			    	data : {
			    		idType: 0,
			    		courseId : courseElement.courseId
			    	}
			    }).then((res) => {
			    	courseElement.courseName = res.data[0].courseName;
			    })
			  }
			}
		}
		
		ctx.state.classCourseList = classCourseList;
		return next();
	})
}