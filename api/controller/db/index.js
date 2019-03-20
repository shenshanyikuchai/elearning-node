module.exports = async (ctx, next) => {
	let data = await ctx.db.get('user').find({}, {sort: {name: 1}})
	
	ctx.body = data;
}