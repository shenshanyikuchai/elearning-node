module.exports = async(ctx) => {
  const dbLogs = ctx.dbs.get('logs');
  let logs = [];
  // .skip(10)  skip(n) 是用来在符合条件的记录中从第一个记录跳过的条数
  // .limit(100) limit(n) 是用来规定显示的条数
	await dbLogs.find({},{_id:0}).then((docs)=>{
    // await dbLogs.find({},{_id:0},{skip:ctx.query.pageNo*ctx.query.pageSize, limit: ctx.query.pageSize}).then((docs)=>{
    logs = docs;
  })
  return logs;
};