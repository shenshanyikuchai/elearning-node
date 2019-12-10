module.exports = async (ctx, next) => {
  await ctx.render('index', { list: ZBG.api })
}