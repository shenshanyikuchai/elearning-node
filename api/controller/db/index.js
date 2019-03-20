module.exports = async (ctx, next) => {
	let data = await ctx.db.get('user').find({}, {sort: {name: 1}})
<<<<<<< HEAD
	
=======
	console.log(data);
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
	ctx.body = data;
}