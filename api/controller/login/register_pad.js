const Request = require('../../request')
const constant = require('../../global/constant');
module.exports = async (ctx) => {
	ctx.state.data = {
		data: true
	};
}