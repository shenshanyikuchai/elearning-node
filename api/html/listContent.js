const fs = require('fs');
const path = require('path');

module.exports = async (ctx, next) => {
	console.log('listContent', ctx)
	let currentPath = ctx.path.substr(1);
	let current = {};
	for(let i of ZBG.api){
		console.log(i)
		if(i.path == currentPath){
			current = i;
			break;
		}
	}
	let currentPathArray = ctx.path.split('/');
	let jsonPath = "";
	currentPathArray.forEach((item) => {
		jsonPath += item + "/"
	})
	console.log(jsonPath.substr(0, jsonPath.length-1) + ".json")
	let content = fs.readFileSync(path.join(__dirname, `/../wiki/${jsonPath.substr(0, jsonPath.length-1)}`),'utf-8');

	// await fs.readFileSync(path.join(__dirname, `/../wiki/${currentPath}.json`), 'utf-8', (err, data) => {
		
	// 	if (err) {
	// 		content = '文件读取失败'
	// 	} else {
	// 		content = data
	// 	}
	// })
	console.log(content)
	await ctx.render('index', { list: ZBG.api, current: current, content: content  })
}