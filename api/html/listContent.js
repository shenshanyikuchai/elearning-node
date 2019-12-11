const fs = require('fs');
const path = require('path');
const qs = require('qs');

module.exports = async (ctx, next) => {
	let currentPath = ctx.path.substr(1);
	let current = {};
	for(let i of ZBG.api){
		console.log(i.path,currentPath)
		if( ("elearning/"+i.path) == currentPath){
			current = i;
			break;
		}
	}
	let currentPathArray = ctx.path.split('/');
	let jsonPath = "";
	currentPathArray.forEach((item) => {
		jsonPath += item + "/"
	})
	let content = fs.readFileSync(path.join(__dirname, `/../wiki/${jsonPath.substr(0, jsonPath.length-1)}`),'utf-8');
	// let sendHost = `${ZBG.COMMON.host.action}${ZBG.prefix}${current.path}`;
	
	let sendOrigin = `${ZBG.COMMON.host.actionMock}${ZBG.prefix}${current.path}`;

	let sendParams = qs.stringify(current.queryData);
	let sendUrl = `${sendOrigin}?${sendParams}`;
	await ctx.render('index', { sendData: {
		host: ZBG.COMMON.host.actionMock,
		prefix: ZBG.prefix,
		origin: sendOrigin,
		params: sendParams,
		url: sendUrl
	}, list: ZBG.api, current: current, content: content  })
}