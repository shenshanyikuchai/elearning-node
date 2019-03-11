module.exports = async (ctx, next) => {
	let data = await ctx.db.get('user').find({}, {sort: {name: 1}})
	console.log(data);
	ctx.body = data;
}