const axios = require('axios');
const Request = require('../../request');
const constant = require('../../global/constant');
const Filter = require('../../filter');
const COMMON = require('../../global/constant');
const iGlobal = require('../../global');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.memberId && ctx.query.token){
		// await Request.ajax({
	 //  	server : "applyrestudylist",
	 //    ctxState : ctx.state,
	 //  	data : {
	 //  	  memberId: '8a22ecb55f758dff015fa4f5c41007a3'
	 //  	}
	 //  }).then((res) => {
	 //     console.log(res)
	 //   }).catch((error) =>{
	 //     console.log(error)
	 //   });
		// let hostName = '';
		// if(process.env.NODE_ENV == "demo"){
		// 	hostName = COMMON.host.demoName;
		// }else{
		// 	hostName = COMMON.host.name;
		// }
	 // 	await axios.get(`${hostName}/api/business/learning/applyrestudylist`, {
	 //     params: {
	 //       memberId: '8a22ecb55f758dff015fa4f5c41007a3'
	 //     }
	 //   }).then((res) => {
	 //     console.log(res)
	 //   }).catch((error) =>{
	 //     console.log(error)
	 //   });

		await axios.all([Request.ajax({
	  	server : "expirationcourse",
	    ctxState : ctx.state,
	  	data : {
	  	  token : ctx.query.token,
	  		pageNo : 0,
	  		pageSize : 999
	  	}
	  }),Request.ajax({
	  	server : "applyrestudylist",
	  	ctxState : ctx.state,
	  	data : {
	  		memberId: ctx.query.memberId
	  	}
	  })]).then(axios.spread(async function (expirationcourse, applyrestudylist) {
	  	var newApplyrestudylist = [];
	  	if(applyrestudylist.data && applyrestudylist.data.length){
	  		for(var i=0;i<applyrestudylist.data.length;i++){
	  			var thisData = applyrestudylist.data[i];
	  			if(thisData.auditState != 1){
	  				if(newApplyrestudylist.length){
	  					var isAdd = false;
	  					var isAddList = false;
	  					for(var j=0;j<newApplyrestudylist.length;j++){
	  						
	  						if(thisData.courseCategoryId == newApplyrestudylist[j].courseCategoryId){
	  							// newApplyrestudylist[j].list.push(thisData)
	  							isAddList = true;
	  							break;
	  						}else{
	  							isAdd = true;
	  							break;
	  						}
	  					}
	  					if(isAdd){
	  						newApplyrestudylist.push({
	  							"courseCategoryId" : thisData.courseCategoryId,
	  							"auditState" : thisData.auditState,
	  							"auditTime" : thisData.auditTime,
	  							"list" : [thisData]
	  						})
	  					}
	  					if(isAddList){
	  						newApplyrestudylist[j].list.push(thisData)
	  						var auditTime = 0;

	  						if(thisData.auditState){
	  							auditTime = thisData.auditTime;
	  						}else{
	  							auditTime = thisData.createDate;
	  						}
	  						if(auditTime>newApplyrestudylist[j].auditTime){
	  							newApplyrestudylist[j].auditTime = auditTime;
	  						}
	  					}
	  				}else{
	  					newApplyrestudylist.push({
	  						"courseCategoryId" : thisData.courseCategoryId,
	  						"auditState" : thisData.auditState,
	  						"auditTime" : thisData.auditTime,
	  						"list" : [thisData]
	  					})
	  				}
	  			}
	  		}
	  	}
	  	let courseArr = [];
	  	for(let i=0;i<expirationcourse.data.courselist.length;i++){
	  		courseArr.push(expirationcourse.data.courselist[i].courseId);
	  	}
  		await Request.ajax({
  		  server : 'getCourseProgress',
  		  ctxState : ctx.state,
  		  data : {
  	  		token : ctx.query.token,
  	  		memberId : ctx.query.memberId,
  	  		courseId : courseArr.toString()
  	  	}
  		}).then((resProgress)=>{
				for(var i=0;i<expirationcourse.data.courselist.length;i++){
					for(var j=0;j<resProgress.data.length;j++){
						var thisCourseData = expirationcourse.data.courselist[i];
						var thisProgressData = resProgress.data[j];
						if(thisCourseData.courseId == thisProgressData.courseId){
							// thisCourseData.courseProgress = thisProgressData.courseProgress ? thisProgressData.courseProgress : 0;
							thisCourseData.courseProgress = iGlobal.getProgress(thisProgressData.courseProgress,thisCourseData.taskTotal);
	            thisCourseData.createDate = thisProgressData.createDate;
	            thisCourseData.chapterId = thisProgressData.chapterId;
	            thisCourseData.chapterName = thisProgressData.chapterName;
	            thisCourseData.progress = thisProgressData.progress;
	            thisCourseData.taskId = thisProgressData.taskId;
	            thisCourseData.taskName = thisProgressData.taskName;
						}
					}
				}
  			ctx.state.data = Filter.expiration({
  				applyrestudylist : newApplyrestudylist,
  				expiration : expirationcourse.data.courselist
  			})
  			return next();
  		})
	  }));
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}