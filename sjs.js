/**
 * build by awen  71752352@qq.com
 */
(function(window,undefined){
	var wd=window.document,
		_$=window.$?window.$:undefined;
		wn=window.Navigator,
		wl=window.location,
		type=function(o){
			return o!=undefined?Object.prototype.toString.call(o):'undefined';
		},
		/*基础工具类*/
		untils={
			noConflict:function(){
				if (_$) {
					window.$=_$;
				}
			},
			uniqueId:function(){
				var t=new Date().getTime(),r=parseInt(Math.random()*100000);
				return t*100000+r;
			},
			isArray:function(o){
				return type(o)==='[object Array]';
			},
			isBoolean:function(o){
				return type(o)==='[object Boolean]';
			},
			isString:function(o){
				return type(o)==='[object String]';
			},
			isFunction:function(o){
				return type(o)==='[object Function]';
			},
			isNumeric:function(o){
				return !isNaN( parseFloat(obj) ) && isFinite( obj );
			},
			isXML: function(el) {
	            var doc = el.ownerDocument || el;
	            return doc.createElement("p").nodeName !== doc.createElement("P").nodeName;
	        },
			isObject:function(o){
				return type(o)==='[object Object]';
			},
			isPlainObject:function(o){
				//ie6下 window和dom都是object
				if (!o||(!this.isObject(o))||o.nodeType||o==window) {
					return false;
				}
				//检查第一个或者最后一个属性为自身属性
				var k=null;
				for (k in o) {};
				return k===undefined||Object.prototype.hasOwnProperty.call(o,k);
			},
			isEmptyObject: function(o) {
				var name;
				for ( name in o ) {
					return false;
				}
				return true;
			},
			/**正则*/
			isEmptyString:function(s){
				return (/^\s*$/ig).test(s);
			},
			trim:function(s){
				return s.replace(/(^\s*)|(\s*$)/g, ""); 
			},
			/**核心啊，代码换效率*/
			each:function(o,f){
				var isa=sjs.isArray(o);
				if (isa) {
					for (var i = 0,l=o.length; i < l; i++) {
						if(f.call(o,i,o[i])===false){
							break;
						}
					}
				}else{
					for (var k in o) {
						if (o.hasOwnProperty(k)) {
							if(f.call(o,k,o[k])===false){
								break;
							}
						}
					}
				}
			},
			grep:function(o,c,s){
				var ret=[],rs=s===true?false:true;
				if(o&&c) {
					sjs.each(o,function(i,n){
						if(c.call(o,n,i)===rs){
							ret.push(n);
						}
					});
				}
				return ret;
			},
			merge:function(f,s){
				return f=f.concat(s);
			},
			map:function(o,f){
				if (o&&f) {
					var t=[];
					for (var i = 0,l=o.length; i <l; i++) {
						var v=f.call(o,o[i],i);
						if (v==null) {return true}
						if (sjs.isArray(v)) {
							sjs.merge(t,v);
						}else{
							t.push(v);
						}
					}
					o=t;
				}
				return o;
			},
			inArray:function(v,o,i){
				for (var i=i==undefined?0:i,l=o.length; i < l; i++) {
					if (o[i]==v) {return i}
				}
				return -1;
			},
			unique:function(o){
				var j={},r=[];
				for (var i = 0; i < o.length; i++) {
					j[o[i]]=o[i];
				}
				sjs.each(j,function(n,i){
					r.push(i);
				});
				return r;
			},
			/**从数组或者对象中移除*/
			remove:function(o,k,isv){
				var ik=k;
				if (isv===true) {
					ik=null;
					for (var i in o) {
						if (o[i]==k) {
							ik=i;
							break;
						}
					}
				}
				if (ik!==undefined&&ik!==null) {
					if (sjs.isArray(o)) {
						o.splice(ik,1);
					}
					if (sjs.isPlainObject(o)) {
						delete o[ik];
					}
				}
				return o;
			},
			/**json*/
			JSONS:{
				parse:function(d){
					if ( typeof d !== "string" || !d ) {  
		        		return null;  
					}
					d =sjs.trim(d);
					return window.JSON?JSON.parse(d):eval(d);
				},
				stringify:function(O){
					if (!O) {
						return '';
					}
					if (window.JSON) {
						return window.JSON.stringify(O);
					}
					var S = [],J = ""; 
					if (type(O) === '[object Array]') { 
					   for (var i = 0; i < O.length; i++){
					       S.push(this.stringify(O[i])); 
					   }
					   J = '[' + S.join(',') + ']'; 
					} 
					else if (type(O) === '[object Date]') { 
					   J = "new Date(" + O.getTime() + ")"; 
					} 
					else if (type(O) === '[object RegExp]' || type(O) === '[object Function]') { 
					   J = O.toString(); 
					} 
					else if (type(O) === '[object Object]') { 
					   for (var i in O) { 
					       O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? this.stringify(O[i]) : O[i]); 
					       S.push(i + ':' + O[i]); 
					   } 
					   J = '{' + S.join(',') + '}'; 
					} 
					return J; 
				},
				parseQuery:function(s){
					var o={};
					var os=s.split("&");
					for(var i=0,len=os.length;i<len;i++){
						if(os[i].indexOf("=")>-1){
							var oi=os[i].split("=");
							if(!( (/^\s*$/ig).test(o[0]))){
								var v=oi[1].trim();
								if(v=="null"||v=="undefined"){v="";}
								o[oi[0]]=v;
							}
						}
					}
					return o;
				},
				toQuery:function(o){
					var s="";
					for(var k in o){
						s+=sjs.isEmptyString(s)?"":"&";
						var v=o[k]==null?"":o[k];
						s+=k+"="+v;
					}
					return s;
				},
				count:function(o){
					var n=0;
					for (var k in o) {
						n++;
					}
					return n;
				}
			}
		},
		//构建sjs对象
		sjs=function(s){return sjs.fn._init(s);};
		//对象原型
		sjs.fn=sjs.prototype={
			selector: "",
			length: 0,
			get:function(i){
				return this[i];
			},
			index:function(){
				var d=this[0],p=d.parentNode,cs=p.childNodes,idx=0;
				for (var i= 0,l=cs.length;i<l;i++) {
					if(cs[i].nodeType==1){
						if (cs[i]==d) {
							return idx;
						}
						idx++;
					}
				}
				return -1;
			},
			_init:function(s){
				if (window==this) {return new sjs(s)};
				if (!s) {
					return this;
				}
				/**如果是函数则为ready*/
				if (sjs.isFunction(s)) {
					document.addEventListener("DOMContentLoaded", function(e) {
						s.call(window,sjs);
					});
				}
				// sjs(DOMElement)
				if (s.nodeType) {
					this[0] = s;
					this.length = 1;
					//dom对象的唯一标志
					index(s);
				}
				// sjs(string)
				if ( typeof s === "string" ) {
					if ( s.charAt(0) === "<" && s.charAt( s.length - 1 ) === ">" && s.length >= 3 ) {
						//暂时不处理html代码
					} else {
						var doms=wd.querySelectorAll(s);
						this.length = doms.length;
						for (var i = 0,len=doms.length; i<len; i++) {
							index(doms[i]);
							this[i]=doms[i];
						}
						this.selector=s;
					}
				}
				return this;
			}
		}
		//主要扩展方法
		sjs.extend=sjs.fn.extend=function(){
			var to=arguments[0]||{},options,len=arguments.length,deep=false,ci=0,src,copy;
			//第一个参数如果是boolean型的话，则代表是否深度复制，扩充对象为第二个参数
			if(typeof to === "boolean") {
				ci++;
				deep=true;
				to=arguments[ci]||{};
			}
			//to类型检测
			if (typeof to != 'object') {
				to={};
			}
			//如果只有一个object对象则扩充对象为本身
			if (len==ci+1) {
				to=this;
			}
			//循环所有要继承的对象
			for (;ci<len;ci++){
				 if ((options=arguments[ci])!=null) {
				 	for (var key in options) {
				 		src=to[key];
				 		copy=options[key];
				 		//防止两个对象互相包含，造成无休止循环
				 		if (to==copy) {
				 			continue;
				 		}
				 		//深度复制
				 		if (deep&&copy&&(untils.isArray(copy)||untils.isPlainObject(copy))) {
				 			if (untils.isPlainObject(copy)) {
				 				src= src && untils.isArray(src) ? src : {};
				 			}
				 			if (untils.isArray(copy)) {
				 				src= src && untils.isPlainObject(src) ? src : [];
				 			}
				 			to[key] = sjs.extend( deep, src, copy );
				 		}else{
				 			to[key]=copy;
				 		}
				 	};
				 };
			}
			return to;
		}
		///////////////////////////////////sjs对象扩展
		//获取dom对象的唯一标志
		function index(d){
			return d._hash?d._hash:(d._hash=untils.uniqueId());
		}
		//获取class值
		function gc(d,n){
			return window.getComputedStyle(d).getPropertyValue(n)||'';
		}
		//检测是否含有className
		function hc(d,c){
			var r=new RegExp('(\\s|^)'+c+'(\\s|$)');
			return r.test(d.className);
		}
		//将数组或者字符串 统一成数组
		function ba(s,b){
			b=b?b:' ';
			return s==undefined?s:sjs.isArray(s)?s:s.split(b);
		}
		function dc(d,c){
			if (c&&hc(d,c)) {
				var r=new RegExp('(\\s|^)'+c);
				d.className=d.className.replace(r,'');
			}
		}
		//获取元素数据
		function gd(d,k){
		 	var hash=index(d),ds=_domdatas[hash]||undefined;
		 	return k==undefined?ds:(ds&&ds[k])?ds[k]:undefined;
		}
		//设置元素数据
		function sd(d,k,v){
			var hash=index(d);
			if (!_domdatas[hash]) {_domdatas[hash]={};}
			_domdatas[hash][k]=v;
		}
		//删除数据
		function dd(d,k){
			var hash=index(d),ds=_domdatas[hash]||undefined;
			if (ds){
				if(k){
					if (_domdatas[hash][k]) {
						delete _domdatas[hash][k];
					}
				}else{
					delete _domdatas[hash];
				}
			}
		}
		//ajax回调函数绑定
		function ajaxcall(xhr,s){
			if (!s || !xhr) {return false;};
			if (s.success) {
				xhr.onload=function(e){
					var res=null;
					switch(s.dataType){
						case 'json':
						case 'script':
							res=eval(this.responseText);
						break;
						default:
							res=this.response;
						break;
					}
					s.success.call(s.context,res,this);
				}
			}
			if (s.abort) {
				xhr.onabort=function(e){
					s.abort.call(s.context,this);
				}
			}
			if (s.error) {
				xhr.onerror=function(e){
					s.error.call(s.context,this);
				}
			}
			if (s.beforeSend) {
				xhr.onloadstart=function(e){
					s.beforeSend.call(s.context,this);
				}
			}
			if (s.complete) {
				xhr.onloadend=function(e){
					s.complete.call(s.context,this);
				}
			}
			if (s.progress) {
				xhr.onprogress=function(e){
					s.progress.call(s.context,e);
				}
			}
			if (s.upProgress){
				xhr.upload.onprogress=function(e){
					 s.upProgress.call(s.context,e);
				}
			}
		}
		var _domdatas={},DOMS={
	 		data:function(k,v){
	 			if (this.length>0) {
					var len=arguments.length;
		 			switch(len){
		 				case 0:
		 				case 1:
		 					return gd(this[0],k);
		 				break;
		 				default:
		 					this.each(function(d){
		 						sd(d,k,v)
		 					});
		 				break;
		 			}
	 			}
	 			return this;
	 		},
	 		/**删除数据,name可以使某个key，也可以使key数组，或者空格分开的key串*/
	 		removeData:function(name){
	 			if (sjs.isString(name) && !sjs.isEmptyString(name)) {
	 				name=name.split(" ");
	 			}
	 			return this.each(function(d){
 					if (sjs.isArray(name)) {
 						sjs.each(name,function(i,n){
 							dd(d,n)
		 				});
		 			}else{
		 				dd(d);
 					}
	 			});
	 		},
	 		html:function(s){
	 			if (this.length==0) {
	 				return this;
	 			}
	 			if (!s) {
	 				return this[0].innerHTML;
	 			}
	 			var h=sjs.isString(s)?s:null,isfunc=sjs.isFunction(s);
	 			return this.each(function(d,i){
	 				if (isfunc) {
	 					h=s.call(this,i,this.innerHTML);
	 					if (!h) {return true;};
	 				};
	 				this.innerHTML=h;
	 			});
	 		},
	 		val:function(s){
	 			return s==undefined?this[0].value:this.each(function(d,i){
	 				if (sjs.isFunction(s)) {
	 					var r=s.call(d,i,d.value);
	 					if (r!=undefined) {
	 						d.value=r;
	 					}
	 				}else{
	 					d.value=s;
	 				}
	 			});
	 		},
	 		text:function(s){
	 			if (s) {
	 				return this.each(function(d,i){
	 					if (sjs.isFunction(s)) {
	 						var r=s.call(d,i,d.textContent);
	 						if (r!=undefined) {
	 							d.textContent=r;
	 						}
	 					}else{
	 						d.textContent=s;
	 					}
	 				});
	 			}else{
	 				var ret='';
	 				this.each(function(d){
	 					ret+=d.textContent;
	 				});
	 				return ret;
	 			}
	 		},
	 		css:function(a,b){
	 			if (a==undefined||this.length==0) {return this};
	 			if (sjs.isString(a)) {
	 				var isf=sjs.isFunction(b);
	 				return b==undefined?gc(this[0],a):this.each(function(d,i){
	 					d.style[a]=isf?(b.call(this,i,gc(this,a))):b;
	 				});
	 			}
	 			if (sjs.isPlainObject(a)) {
	 				var ins=this;
	 				sjs.each(a,function(k,v){
	 					ins.css(k,v);
	 				});
	 			}
	 			return this;
	 		},
	 		/*name|properties|key,value|fn*/
	 		attr:function(a,b){
	 			if (a) {
	 				if (b) {
	 					//两个参数
	 					if (sjs.isFunction(b)) {
	 						this.each(function(d,i){
	 							var v=d.getAttribute(a),r=b.call(d,i,v);
	 							if (r!=undefined) {
	 								d.setAttribute(a,r);
	 							};
	 						});
	 					}else{
	 						this.each(function(d){
	 							d.setAttribute(a,b);
	 						});
	 					}
	 				}else{
	 					//一个参数
	 					if (sjs.isString(a)) {
	 						return this[0].getAttribute(a);
	 					}else if (sjs.isPlainObject(a)) {
	 						this.each(function(d){
	 							sjs.each(a,function(k,v){
	 								d.setAttribute(k,v);
	 							})
	 						})
	 					}
	 				}
	 			};
	 			return this;
	 		},
	 		removeAttr:function(n){
	 			return this.each(function(d){
	 				d.removeAttribute(n);
	 			});
	 		},
	 		getBox:function(){
				//safari3.2没有getBoundingClientRect
				if (window.HTMLElement&&(!('getBoundingClientRect' in HTMLElement))) {
					var st = wd.documentElement.scrollTop,sl = wd.documentElement.scrollLeft,al = this[0].offsetLeft,
						at = this[0].offsetTop,
						cp = this[0].offsetParent; 
					while (cp != null){   
					    al += cp.offsetLeft;   
						at += cp.offsetTop;   
						cp = cp.offsetParent;   
					}   
					return {   
					    left : al- sl, 
					    right : al + this[0].offsetWidth - sl,   
					    top : at- st,   
					    bottom : at+ this[0].offsetHeight - st,
					    width: this[0].offsetWidth,
					    height: this[0].offsetHeight
					}   
				}else{
					var box=this[0].getBoundingClientRect();
					return {
						left : box.left, 
					    right :box.right,   
					    top : box.top,   
					    bottom : box.bottom,
					    width: box.right-box.left,
					    height:box.bottom-box.top
					}
				}
	 		},
	 		inBox:function(x,y){/**x，y均相对于浏览器窗口，event可用clientX,clientY*/
	 			var r=false,x=parseInt(x),y=parseInt(y);
	 			this.each(function(dom,i){
	 				var b=sjs(this).getBox();
	  				r=b.left<=x&&b.right>=x&&b.top<=y&&b.bottom>=y;
	  				if (r==true) {return false};
	 			});
	 			return r;
	 		},
	 		each:function(fn){
	 			for (var i = 0; i <this.length; i++) {
	 				if(fn.call(this[i],this[i],i)===false){
	 					return this;
	 				}
	 			}
	 			return this;
	 		},
	 		remove:function(){
	 			return this.each(function() {
						this.parentNode != null && this.parentNode.removeChild(this);
				});
			},
			addClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					var sc=sjs.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&!hc(d,cn)) {
							d.className=sc+' '+cn;
						}
					}
					else{
						sjs.each(cs,function(i,cn){
							sc=sjs.trim(d.className);
							if (cn&&!hc(d,cn)) {
								d.className=sc+' '+cn;
							}
						});
					}
				});
			},
			removeClass:function(c){
				if (this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					if (c==undefined) {return (d.className='');};
					var sc=sjs.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&hc(d,cn)) {
							dc(d,cn)
						}
					}
					else{
						sjs.each(cs,function(i,cn){
							dc(d,cn);
						});
					}
				});
			},
			toggleClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=sjs.isFunction(c)?null:ba(c);
 				return this.each(function(d,i){
					var sc=sjs.trim(d.className),cn='';
					if (cs==null) {
						if(cn=c.call(d,i,sc)){
							if (hc(d,cn)) {dc(d,cn)}
							else{d.className=sc+' '+cn}
						}
					}
					else{
						sjs.each(cs,function(i,ci){
							sc=sjs.trim(d.className);
							if (hc(d,ci)) {dc(d,ci)}
							else{d.className=sc+' '+ci}
						});
					}
				});
			}
	 	},
	 	AJAXS={
	 		ajax:function(url,s){
				var _s = {
					async : true, 		// 异步
					cache : false, 		// 是否读取缓存
					type : 'GET', 		// 请求方式
					dataType:'html',	// 返回数据类型,xml|html|css|script|json|blod|arraybuffer
					mime:'text/html',
					data : {}, 			// 要随请求发送的键值对
					charset:'utf-8',	// 编码
					contentType:'application/x-www-form-urlencoded',
					// 事件函数句柄
					context:s,       	// 回调函数的上下文，默认为传递的参数对象
					progress:null,		// 下载进度，参数为当前事件对象
					upProgress:null,	// 上传进度，参数为当前事件对象
					beforeSend : null, 	// 请求开始前的函数句柄
					success : null, 	// 请求成功函数句柄，有两个参数，第一个是返回的数据，第二个是XMLHttpRequest对象
					abort : null, 		// 请求被取消时的回调句柄，并且传入一个XMLHttpRequest作为参数		
					error : null, 		// 请求失败似的函数句柄，并且传入一个XMLHttpRequest作为参数
					complete : null 	// 请求结束后的函数句柄,不管成功或者失败，并且传入一个XMLHttpRequest作为参数
				};
				if (!sjs.isString(url)) {return false}
				var _t=new Date().getTime(),_s=s?sjs.extend(_s,s):_s,
					xhr=new XMLHttpRequest,url=url.indexOf('?')>-1?url+'&':url+'?',postd=_s.data;
					url+=_s.cache?'':'_t='+_t;
 					if ((_s.type).toLowerCase()=='get') {
						url+=sjs.JSONS.toQuery(_s.data);
						postd=null;
					}
					if (_s.dataType=='blod' || _s.dataType=='arraybuffer') {
						xhr.responseType=_s.dataType;
					}
	 			if (xhr) {
	 				ajaxcall(xhr,_s);
			        xhr.open(_s.type, url, _s.async);
			        xhr.setRequestHeader("Accept", _s.mime);
					xhr.setRequestHeader("Content-Type", _s.contentType+"; charset="+_s.charset+"");
			        xhr.send(postd);
				}else{
					if (sjs.isFunction(_s.error)) {_s.error('ajax不被支持！')}
				}
				return xhr;
			},
			ajaxForm:function(sel,s){
 				$(sel).each(function(d){
 					if (d.nodeName.toLowerCase()=='form') {
						var fd = new FormData(d),xhr=new XMLHttpRequest();
						if (s && s.data) {
							for (var k in s.data) {
								fd.append(k,s.data[k]);
							}
						}
						ajaxcall(xhr,s);
						xhr.open(d.method,d.action);
						xhr.send(fd);
 					}
 				});
			},
			get:function(u,d,f,t){
				if (!u) {return false;}
				var _d=d,_f=f,_t=t;
				if (sjs.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{success:_f,data:_d,dataType:_t||'html'});
			},
			getJSON:function(u,d,f){
				if (!u) {return false;}
				var _d=d,_f=f;
				if (sjs.isFunction(_d)) {
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{success:_f,data:_d,dataType:'json'});
			},
			getScript:function(u,f){
				if (!u) {return false;}
				var script=document.createElement('script');
				script.async=true;
				script.src=u;
				script.onload=f;
				document.body.appendChild(script);
			},
			post:function(u,d,f,t){
				if (!u) {return false;}
				var _d=d,_f=f,_t=t;
				if (sjs.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return sjs.ajax(u,{type:'post',success:_f,data:_d,dataType:_t});
			}
	 	};
	 	/**事件管理栈*/
	 	var _listeners={},
		EVENTS={
			on:function(){
				if (arguments.length>1){
					var et=arguments[0],d=arguments[1],fn=arguments[2];					
					if (sjs.isFunction(d)) {
						fn=d;d=null;
					}else{
						if (!fn||!sjs.isFunction(fn)) {
							return this;
						}
					}
					if (typeof _listeners[et] === "undefined") {	
						_listeners[et]={};
						//事件委托
						document.addEventListener(et,function(e){
							if(_listeners[e.type]){
								sjs(e.target).trigger(e.type,e);
							}
						},false);
					}
					//将本次选择器放入本对象的data中，便于以后循环获取根据不同selector绑定的事件
					this.each(function(dom){
						var hash=index(dom);
						if (typeof _listeners[et][hash] === "undefined") {
							_listeners[et][hash]=[];
						}
						_listeners[et][hash].push({'fn':fn,'data':d,'cnt':0});
					});
				}
				return this;
			},
			trigger:function(et){
				if (et && _listeners[et]) {
					var _dels=[];
					//在本对象的事件选择器列表中获取所有绑定事件时使用过的选择器来检索事件
					this.each(function(d){
						//始终传入的最后一个参数为event(手动除外)
						var e=arguments[arguments.length-1];
						e=e.type?e:{'type':et,'target':d};
						var hash=index(d),items=_listeners[et][hash]||[],_dels=[];
						for (var j=0,len = items.length; j <len; j++) {
							e.data=items[j]['data'];
							e.firecnt=++items[j]['cnt'];
							//根据返回值来判断是否取消绑定
							if(items[j]['fn'].call(this,e)===false){
								_dels.push(j);
							}
						}
						for (var i = _dels.length - 1; i >= 0; i--) {
							items.splice(_dels[i],1);
						}
					})
 				}
				//触发其他自定义绑定事件
				try{
					var evt = document.createEvent('Event'); 
					evt.initEvent(et,true,true); 
					el.dispatchEvent(evt); 
				}catch(e){}
				return this;
			},
			off:function(et,fn){
					this.each(function(d){
						var hash=index(d),items;
						if (et && _listeners[et]) {
							if (items=_listeners[et][hash]) {
								if(fn){
									var _dels=[];
									for (var i =items.length - 1; i >= 0; i--) {
										if (items[i]['fn']==fn) {
											_dels.push(i);
										}
									}
									//数组分离删除，防止序号错乱
									for (var i = _dels.length - 1; i >= 0; i--) {
										_listeners[et][hash].splice(i,1);
									}
								}else{
									delete _listeners[et][hash];
								}
							}
						}else{
							//删除所有
							sjs.each(_listeners,function(i,d){
								delete d[hash];
							});
						}
					});
				
				return this;
			},
			one:function(et,d,fn){
				var _fn=fn;
				this.on(et,d,function(e){
					if (_fn) {
						fn.call(this,e);
					};
					return false;
				});
				return this;
			},
			bind:this.on,
			unbind:this.off
		};
		/**
		 * 扩展常用工具包
		 */
		sjs.extend(untils);
		sjs.extend(AJAXS);
		sjs.fn.extend(DOMS);
		sjs.fn.extend(EVENTS);
		//全局提供
		window.sjs = window.$ = sjs;
})(window);