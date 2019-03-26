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
	await axios.all([Request.ajax({
		server : "getTeacherClass",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token,
			type: type
		}
	}),Request.ajax({
		server : "getTeacherLiveCourselist",
		ctxState : ctx.state,
		data : {
			teacherId : ctx.query.memberId
		}
	})]).then(axios.spread(async (teacherClassData, livelistData) => {
		let teacherClass = _.uniqBy(teacherClassData.data, 'id');
		for(let elementClass of teacherClass){
			await Request.ajax({
	    	server : "getClassCourse",
	    	ctxState : ctx.state,
	    	data : {
	    		classId : elementClass.id
	    	}
	    }).then(async (res) => {
	    	elementClass.courseList = res.data;
	    	for(let elementCourse of elementClass.courseList){
	    		await Request.ajax({
	    			server : "courseBaseInfo",
	    			ctxState : ctx.state,
	    			data : {
	    				idType: 0,
	    				courseId : elementCourse.courseId
	    			}
	    		}).then((res) => {
	    			elementCourse.courseName = res.data[0].courseName;
	    			elementCourse.coverPath = res.data[0].coverPath;
	    			elementCourse.categoryId = res.data[0].categoryId;
	    			elementCourse.subjectId = res.data[0].subjectId;
	    		})
	    		// await Request.ajax({
	    		//   server : 'memberGetplan',
	    		//   ctxState : ctx.state,
	    		//   data : {
	    		//     token: ctx.query.token,
	    		//     courseCategoryId: elementCourse.courseCategoryId,
	    		//     courseId: elementCourse.courseId
	    		//   }
	    		// }).then(async (res) => {
	    		// 	elementCourse.planList = res.data;
	    		// })
	    	}
	    	ctx.state.mock = false;
	    })
		}
		ctx.state.teacherClass = teacherClass;
		
		if(livelistData && livelistData.data){
			ctx.state.liveList = livelistData.data;
		}else{
			ctx.state.liveList = {};
		}
		
		return next();
	}));
	// await Request.ajax({
	// 	server : "getTeacherClass",
	// 	ctxState : ctx.state,
	// 	data : {
	// 		token: ctx.query.token,
	// 		type: type
	// 	}
	// }).then(async (res) => {

	// 	let teacherClass = _.uniqBy(res.data, 'id');
	// 	for(let elementClass of teacherClass){
	// 		await Request.ajax({
	//     	server : "getClassCourse",
	//     	ctxState : ctx.state,
	//     	data : {
	//     		classId : elementClass.id
	//     	}
	//     }).then(async (res) => {
	//     	elementClass.courseList = res.data;
	//     	// for(let elementCourse of res.data){
	//     	// 	ctx.state.mock = true;
	//     	// 	await Request.ajax({
	//     	// 	  server : 'memberGetplan',
	//     	// 	  ctxState : ctx.state,
	//     	// 	  data : {
	//     	// 	    token: ctx.query.token,
	//     	// 	    courseCategoryId: elementCourse.courseCategoryId,
	//     	// 	    courseId: elementCourse.courseId
	//     	// 	  }
	//     	// 	}).then(async (res) => {
	//     	// 		elementCourse.planList = res.data;
	//     	// 	})
	//     	// }
	//     	// ctx.state.mock = false;
	//     })
	// 	}
	// 	ctx.state.teacherClass = teacherClass;
	// 	return next();
	// })
}