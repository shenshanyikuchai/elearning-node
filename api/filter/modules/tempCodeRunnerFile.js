var User = {
  count: 1,
  getCount: function () {
    return this.count;
  }
};
Function.prototype.bind = Function.prototype.bind || function(context){
  var self = this;

  return function(){
    return self.apply(context, arguments);
  };
}
var func = User.getCount.bind(User);