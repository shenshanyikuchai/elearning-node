module.exports = async (ctx) => {
	ctx.state.data = {
		isWxGetToken : true,
		echostr : ctx.query.echostr
	}
}