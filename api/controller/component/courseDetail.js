const http = require("http")
module.exports = async(ctx, next) => {
	http.get('http://api.zbgedu.com/api/teachsource/course/courseDetail/data?courseId=554aa8fa367aad25d49ef902709bd327', (res) => {
	  const { statusCode } = res;
	  const contentType = res.headers['content-type'];

	  let error;
	  if (statusCode !== 200) {
	    error = new Error('请求失败。\n' +
	                      `状态码: ${statusCode}`);
	  } else if (!/^application\/json/.test(contentType)) {
	    error = new Error('无效的 content-type.\n' +
	                      `期望 application/json 但获取的是 ${contentType}`);
	  }
	  if (error) {
	    console.error(error.message);
	    // 消耗响应数据以释放内存
	    res.resume();
	    return;
	  }

	  res.setEncoding('utf8');
	  let rawData = '';
	  res.on('data', (chunk) => { rawData += chunk; });
	  res.on('end', () => {
	    try {
	      const parsedData = JSON.parse(rawData);
<<<<<<< HEAD
	      
=======
	      console.log(parsedData);
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
	    } catch (e) {
	      console.error(e.message);
	    }
	  });
	}).on('error', (e) => {
	  console.error(`错误: ${e.message}`);
	});
	// await Request.ajax({
	//   server : 'courseactivestatus',
	//   ctxState : ctx.state,
	//   data : {
 //  		token : ctx.query.token,
 //  		versionId: ctx.state.courseDetail.versionId,
 //  		classId : ctx.query.classId,
 //  	}
	// }).then((res) => {
	//   ctx.state.courseactivestatus = res.data;
	//   return next();
	// })
  next();
}