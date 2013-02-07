/**
 * 在console中显示js效率测试,仅仅对比sjs与jquery
 * @param  {string}   code     要测试的代码或者函数(去掉sjs或者jquery部分代码前缀（prefix）)
 * @param  {int}  	  cnt      执行次数
 * @param  {Function} callback 执行成功后的回调函数，参数[prefix,time,count]
 * @demo   tests('');
 */
function tests(code,cnt,callback){
	// console.trace();
	var sjstest=function(){
		 return new Function('return sjs'+code)();
	},jquerytest=function(){
		 return new Function('return jQuery'+code)();
	}
	console.profile('性能分析-sjs&jquery');
	for (var i = cnt; i >0; i--) {
		 	sjstest();
		 	jquerytest();
	}
	console.profileEnd();
}