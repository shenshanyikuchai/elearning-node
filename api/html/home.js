// module.exports = async (ctx, next) => {
	
//   ctx.render('index', { body: 'Hello Worlds' })
// }

module.exports = async (ctx, next) => {
	ctx.body = '<html><body>'
        + '<div>首页</div>'
        + '</body></html>';
}