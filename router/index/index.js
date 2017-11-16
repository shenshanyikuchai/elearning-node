module.exports = async (ctx, next) => {
	console.log(ctx.query)

	ctx.body = ctx.state
}