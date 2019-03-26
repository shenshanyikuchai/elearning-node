module.exports = async(ctx, next) => {
	await ZBG.Request.ajax({
		server : "classCourseList",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token
		}
	}).then(async (res) => {

		let classCourseList = res;
		if(classCourseList.data && classCourseList.data.length){
			for(let elementClassCourse of classCourseList.data){
				if(elementClassCourse.classCourse && elementClassCourse.classCourse.length){
					for (let courseElement of elementClassCourse.classCourse) {
				    await ZBG.Request.ajax({
				    	server : "courseBaseInfo",
				    	ctxState : ctx.state,
				    	data : {
				    		idType: 0,
				    		courseId : courseElement.courseId
				    	}
				    }).then((res) => {
				    	if(res.data && res.data.length){
				    		let resData = res.data[0];
  				    	courseElement.categoryId = resData.categoryId;
  				    	courseElement.categoryName = resData.categoryName;
  		    			courseElement.subjectId = resData.subjectId;
				    		courseElement.subjectName = resData.subjectName;

  				    	courseElement.courseName = resData.courseName;
  				    	courseElement.coverPath = resData.coverPath;
				    	}
				    	
				    })
				  }
				}
			}
		}
		ctx.state.classCourseList = classCourseList;
		return next();
	})
}