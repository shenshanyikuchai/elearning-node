const Request = require('../../request');
const constant = require('../../global/constant');
const Filter = require('../../filter');
const fs = require("fs")
const path = require("path")
module.exports = async (ctx, next) => {
	// require(`${__dirname}/../controller/${list}`)

	if (ctx.query.versionId) {
		// let path = `${__dirname}/../../static/mock/noActivecourse-mock.json`;
		let path = `${__dirname}/../../static/mock/noActivecourse_pad-mock.json`;
		let data = fs.readFileSync(path, 'utf8');
		let parseData = JSON.parse(data);
		let courselist = parseData.data.courselist;
		let activeIndex = -1;
		for (let element of courselist) {
			let courseId = element['versionId'];
			if (courseId == ctx.query.versionId) {
				activeIndex = element;
				// element.isBuy = false;
				element.isBuy = true;
			}
		}
		fs.writeFileSync(path, JSON.stringify(parseData));
		// if (activeIndex > -1) {
		// 	// parseData.data.total -= 1;
		// 	// courselist.splice(activeIndex, 1)

		// }

	} else {
		ctx.state.response = constant.response.noparameter;
	}


}