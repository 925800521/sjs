/**
 * build by awen  71752352@qq.com
 */
;(function(W,undefined){
	var D=W.document,
		_$$=W.$?W.$:undefined,
		wn=W.navigator,
		wl=W.location,
		ua=wn.userAgent.toLowerCase(),
		av=wn.appVersion,
		AP=Array.prototype,
		RAF = W.requestAnimationFrame|| W.mozRequestAnimationFrame|| W.webkitRequestAnimationFrame|| W.msRequestAnimationFrame|| W.oRequestAnimationFrame|| function(f) {setTimeout(f, 1000/60);},
 		sh=/^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,
 		type=function(o){
			return o!=undefined?(Object.prototype.toString.call(o)).slice(8,-1):'undefined';
		},
		/*基础工具类*/
		UT={
			noConflict:function(){
				if (_$$) {W.$=_$$;}
			},
			uniqueId:function(){
				var t=new Date().getTime(),r=parseInt(Math.random()*10000);
				return t*10000+r;
			},
			type:type,
			isArray:function(o){
				return type(o)==='Array';
			},
			isBoolean:function(o){
				return type(o)==='Boolean';
			},
			isString:function(o){
				return type(o)==='String';
			},
			isFunction:function(o){
				return type(o)==='Function';
			},
			isNumeric:function(o){
				return !isNaN( parseFloat(o) ) && isFinite( o );
			},
			isXML: function(el) {
	            var doc = el.ownerDocument || el;
	            return doc.createElement("p").nodeName !== doc.createElement("P").nodeName;
	        },
			isPlainObject:function(o){
				return type(o)==='Object';
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
				if (sjs.isArray(o)) {
					for (var i = 0,l=o.length; i < l; i++) {
						if(f.call(o,i,o[i])===false){
							break;
						}
					}
				}else{
					for (var k in o) {
						if (o[k]!=undefined) {
							if(f.call(o,k,o[k])===false){
								break;
							}
						}
					}
				}
			},
			grep:function(o,c,s){
				var ret=new o.constructor,rs=s===true?false:true;
				if(o&&c) {
					M.each(o,function(i,n){
						if(c.call(o,n,i)===rs){
							ret.push(n);
						}
					});
				}
				return ret;
			},
			merge:function(f,s){
				var args=[f.length,0].concat(s);
				AP.splice.apply(f,args);
				return f;
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
			inArray:function(v,o){
				if (AP.indexOf) {
					  return AP.indexOf.call(o,v);  
				}else{
					for (var i=0,l=o.length; i < l; i++) {
						if (o[i]==v) {return i}
					}
				}
				return -1;
			},
			unique:uniqd,
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
			JSON:{
				parse:function(d){
					if ( typeof d !== "string" || !d ) {  
		        		return null;  
					}
					d =sjs.trim(d);
					return W.JSON?JSON.parse(d):eval(d);
				},
				stringify:function(O){
					if (!O) {return '';}
					if (W.JSON) {return W.JSON.stringify(O);}
					var S = [],J = "";
					switch(type(O)){
						case 'Array':
							for (var i = 0; i < O.length; i++){
					       		S.push(this.stringify(O[i])); 
						    }
						    J = '[' + S.join(',') + ']'; 
						break;
						case 'Date':
						 	J = "new Date(" + O.getTime() + ")"; 
						break;
						case 'RegExp':
						case 'Function':
							J = O.toString(); 
						break;
						case 'Object':
						  for (var i in O) { 
						       O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? this.stringify(O[i]) : O[i]); 
						       S.push(i + ':' + O[i]); 
						   } 
						   J = '{' + S.join(',') + '}'; 
						break;
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
			},
			/**帧动画对象*/
			raf:function(frame,fn) {
				//run 动画状态  0初始 1运动 2暂停 3停止
				var st=new Date().getTime(),_f=Math.ceil(1000/frame),run=0,
					cnt=0,args=AP.slice.call(arguments,2);args.unshift(cnt);
				instance=this;
	 			function go(){
	 				if (run<2) {
	 					var _t=new Date().getTime();
						var _d=_t-st;
						if (_d>=_f) {
							st=_t;
							cnt++;
							args[0]=cnt;
							if(fn.apply(instance,args)===false){
								return;
							};
						};
						RAF(go);
	 				};
				}
				this.sign=null;
				this.start=function(){
					if (run==0) {
						run=1;
						RAF(go);
					};
				}
				this.pause=function(){
					if (run==1) {
						run=2;
					};
				}
				this.resume=function(){
					if (run==2) {
						run=1;
						RAF(go);
					};
				}
	 			this.stop=function(){
	 				run=3;
				}
			}
		},
		//构建sjs对象
		M=function(s,cxt){return new M.fn.init(s,cxt);};
		//对象原型
		M.fn=M.prototype={
			constructor: M,
			selector:'',
			sjs:'sjs',
			length: 0,
			init:function(s,cxt){
				if (W==this) {return new M(s,cxt)};
				//是sjs对象则返回原sjs对象
				if (isS(s)) {return s;};
				this.context=cxt?cxt:D;
				if (s) {
					/**如果是函数则为ready*/
					if (M.isFunction(s)) {
						document.addEventListener("DOMContentLoaded", function(e) {
							s.call(W,sjs);
						});
					}
					// M(DOMElement)
					if (s.nodeType) {
						this[0] = s;
						this.length = 1;
						//dom对象的唯一标志
						id(s);
					}
					//doms数组
					if (UT.isArray(s)) {
						UT.merge(this,s);
					}
					// M(string)
					if ( typeof s === "string" ) {
						var ds;
						if ((ds=sh.exec(s))&&ds[1]) {
							return M(cds(ds[1]));
						} else {
							ds=this.context.querySelectorAll(s);
							this.length = ds.length;
							for (var i = 0,len=this.length; i<len; i++) {
								id(ds[i]);
								this[i]=ds[i];
							}
							this.selector=s;
						}
					}
				}
			},
			size:function(){
				return this.length;
			},
			get:function(i){
				var gs=AP.slice.call(this);
				return i==undefined?gs:gs[i];
			},
			index:function(){
				var d=this[0],cs=d.parentNode.children;
				return M.inArray(d,cs);
			}
		}
		M.fn.init.prototype = M.fn;
		//主要扩展方法
		M.extend=M.fn.extend=function(){
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
				 		if (deep&&copy&&(UT.isArray(copy)||UT.isPlainObject(copy))) {
				 			if (UT.isPlainObject(copy)) {
				 				src= src && UT.isArray(src) ? src : {};
				 			}
				 			if (UT.isArray(copy)) {
				 				src= src && UT.isPlainObject(src) ? src : [];
				 			}
				 			to[key] = M.extend( deep, src, copy );
				 		}else{
				 			to[key]=copy;
				 		}
				 	};
				 };
			}
			return to;
		}
		///////////////////////////////////常用函数
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
		//将数组或者字符串 统一成数组
		function ba(s,b){
			b=b?b:' ';
			return s==undefined?s:M.isArray(s)?s:s.split(b);
		}
		//根据字符串创建dom数组,f=true的话 返回documentfragment对象
		function cds(s,f){
			var tmp=D.createElement('div');
				tmp.innerHTML=s;
			if (f===true) {
				var doc=D.createDocumentFragment(),c=tmp.firstChild;
				while(c){
					var d=c,c=c.nextSibling;
					doc.appendChild(d);
				}
				return doc;
			}else{
				return AP.slice.call(tmp.children,0);
			}
		}
		//将CSS驼峰属性名转换为原本属性名
		function cnes(s) {
			s.replace(/([A-Z])/g,"-$1").toLowerCase();
			return s.replace(/^(webkit-|moz-|o-|ms-)/,'-$1');
		}
		//将CSS属性名改为驼峰
		function cne(s) {
			 return s.replace(/-[a-z]/gi,function (c) {
			  return c.charAt(1).toUpperCase();
			 });
		}
		//删除classname
		function dc(d,c){
			if (c&&hc(d,c)) {
				var r=new RegExp('(\\s|^)'+c);
				d.className=d.className.replace(r,'');
			}
		}
		//删除数据
		function dd(d,k){
			var hash=id(d),ds=_domdatas[hash]||undefined;
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
		/**借用jquery的，挺精简的
		 * 从一个元素出发，迭代检索某个方向上的所有元素并记录，直到与遇到document对象或遇到until匹配的元素
		 * 迭代条件（简化）：cur.nodeType !== 9 && !M( cur ).is( until ) 
		 * elem		起始元素
		 * dir		迭代方向，可选值（Node 对象的属性）：如parentNode nextSibling previousSibling
		 * until	选择器表达式，如果遇到until匹配的元素，迭代终止
		 * only 	是否只返回第一个符合要求的
		 */
		function dir(elem,dir,until,only){
			var matched = [],cur = elem[ dir ];
			while ( cur && cur.nodeType !== 9 && (!until|| cur.nodeType !== 1 || !M( cur ).is( until ))) {
				if ( cur.nodeType === 1 ) {
					if (only) {return cur;}
					matched.push( cur );
				}
				cur = cur[dir];
			}
			return matched;
		}
		/*~parentsUntil,nextUntil,prevUntil*/
		function diru(type,o,s,f){
			var ps=[],i=0,l=o.length,r;
			for(;i<l;i++){
				M.merge(ps,dir(o[i],type,s));
			}
			r=M(uniqd(ps));
			return f?r.filter(f):r;
		}
		/*~parent,next,prev*/
		function dirs(type,o,s){
			var ps=[],i=0,l=o.length,r;
			for(;i<l;i++){
				var p=o[i][type];
				p&&ps.push(p);
			}
			r=M(uniqd(ps));
 			return s?r.filter(s):r;
		}
		//获取class值
		function gc(d,n){
			return W.getComputedStyle(d).getPropertyValue(cnes(n))||'';
		}
		//获取元素数据
		function gd(d,k){
		 	var hash=id(d),ds=_domdatas[hash]||undefined;
		 	return k==undefined?ds:(ds&&ds[k])?ds[k]:undefined;
		}
		//获取dom的outhtml代码
		function gh(d){
			if (d.outerHTML) {return d.outerHTML};
			var t=D.createElement('div');t.appendChild(d.cloneNode(true));
			return t.innerHTML;
		}
		//检测是否含有className
		function hc(d,c){
			var r=new RegExp('(\\s|^)'+c+'(\\s|$)');
			return r.test(d.className);
		}
		//获取dom对象的唯一标志,e强制重新获取
		function id(d,e){
			return (e||!d._hash)?(d._hash=UT.uniqueId()):d._hash;
		}
		// 判断是否sjs对象
		function isS(o){
			return o&&o.sjs!=undefined;
		}
		//sjs对象整合到documentFragment对象中病返回
		function stodf(o){
			var d=D.createDocumentFragment();
			for (var i = 0; i < o.length; i++) {
				o[i]
			};
			return d;
		}
		//parent child操作  r是操作的类型 0,append（默认）,1perpend,2after,3before,4 replaceWith
		function dom(o,s,r){
			if (s&&o.length>0){
				var isf=M.isFunction(s),isstr=M.isString(s),iss=isS(s),_s=(!isstr&&!isf)?M(s):null,rs=[];
 				o.each(function(d,i){
 					var p=r>1?d.parentNode:null;
					if (_s) {
						//dom,sjs会保留事件
 						var cs=i>0?_s.clone(true):_s,
 						//集成为docfragment
 						df=D.createDocumentFragment();
 						cs.each(function(m){df.appendChild(m)});

						((r==1) && (d.insertBefore(df,d.firstChild))) ||
						((r==2) && p && (((p.lastChild==d)&&p.appendChild(df))||p.insertBefore(df,d.nextSibling)))||
						((r==3) && p && p.insertBefore(df,d))||
						((r==4) && p && p.replaceChild(df,d))||
						d.appendChild(df);
						iss&&(i>0)&&rs.push(cs);
 					}else{
						var h=isf?s.call(d,i,d.innerHTML):s,h=r>1?cds(s,true):h;
						((r==1)&&(d.innerHTML=h+d.innerHTML))||
						((r==2) && p && (((p.lastChild==d)&&p.appendChild(h))||p.insertBefore(h,d.nextSibling)))||
						((r==3) && p && p.insertBefore(h,d))||
						((r==4) && p && p.replaceChild(h,d))||
						(d.innerHTML+=h);
					}
				});
				if (iss) {
					for (var i = 0; i < rs.length; i++) {
						s.add(rs[i]);
					}
				}
			}
			return o;
		}
		//设置元素数据
		function sd(d,k,v){
			var hash=id(d);
			if (!_domdatas[hash]) {_domdatas[hash]={};}
			_domdatas[hash][k]=v;
		}
		//常规数组去重
		function uniq(o){
			var j={},r=[];
			for (var i = 0; i < o.length; i++) {
				j[o[i]]=o[i];
			}
			M.each(j,function(n,i){
				r.push(i);
			});
			return r;
		}
		//dom数组去重
		function uniqd(o){
			var ret = [], done = {},i=0,l=o.length;
			for(;i<l;i++){
				var d=o[i],j=id(d);
				if (!done[j]) {
					done[j]=true;
					ret.push(d);
				};
			}
			return ret;
		}		
		//dom扩展
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
	 			if (M.isString(name) && !M.isEmptyString(name)) {
	 				name=name.split(" ");
	 			}
	 			return this.each(function(d){
 					if (M.isArray(name)) {
 						M.each(name,function(i,n){
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
	 			if (s==undefined) {
	 				return this[0].innerHTML;
	 			}
	 			var h=M.isString(s)?s:null,isfunc=M.isFunction(s);
	 			return this.each(function(d,i){
	 				if (isfunc) {
	 					h=s.call(this,i,this.innerHTML);
	 					if (!h) {return true;};
	 				};
	 				this.innerHTML=h;
	 			});
	 		},
	 		//获取所有匹配元素的整合html代码字符串
	 		htmls:function(){
	 			var h='';
	 			this.each(function(d){
	 				h+=gh(d);
	 			});
	 			return h;
	 		},
	 		val:function(s){
	 			return this.length==0?undefined:s==undefined?((this[0].value)||''):this.each(function(d,i){
				 				if (M.isFunction(s)) {
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
	 					if (M.isFunction(s)) {
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
	 			if (a==undefined) {return undefined}
	 			if (this.length==0) {return this;}
	 			if (M.isString(a)) {
	 				var isf=M.isFunction(b);
	 				return b==undefined?gc(this[0],a):this.each(function(d,i){
	 					var v=isf?(b.call(this,i,gc(this,a))):b;
	 					v=((/height|width|left|right|top|bottom|size/i).test(a) && M.isNumeric(v))?(v+'px'):v;
	 					a=cne(a);
	 					d.style[a]=v;
	 				});
	 			}
	 			if (M.isPlainObject(a)) {
	 				var ins=this;
	 				M.each(a,function(k,v){
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
	 					if (M.isFunction(b)) {
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
	 					if (M.isString(a)) {
	 						return this[0].getAttribute(a);
	 					}else if (M.isPlainObject(a)) {
	 						this.each(function(d){
	 							M.each(a,function(k,v){
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
				if (W.HTMLElement&&(!('getBoundingClientRect' in HTMLElement))) {
					var st = D.documentElement.scrollTop,sl = D.documentElement.scrollLeft,al = this[0].offsetLeft,
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
	 				var b=M(this).getBox();
	  				r=b.left<=x&&b.right>=x&&b.top<=y&&b.bottom>=y;
	  				if (r==true) {return false};
	 			});
	 			return r;
	 		},
	 		/**r参数判断是否反向遍历*/
	 		each:function(fn,r){
	 			if (r===true) {
	 				for (var i = this.length-1; i >=0; i--) {
		 				if(fn.call(this[i],this[i],i)===false){
		 					return this;
		 				}
		 			}
	 			}else{
	 				for (var i = 0; i <this.length; i++) {
		 				if(fn.call(this[i],this[i],i)===false){
		 					return this;
		 				}
		 			}
	 			}
	 			return this;
	 		},
			addClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=M.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					var sc=M.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&!hc(d,cn)) {
							d.className=sc+' '+cn;
						}
					}
					else{
						M.each(cs,function(i,cn){
							sc=M.trim(d.className);
							if (cn&&!hc(d,cn)) {
								d.className=sc+' '+cn;
							}
						});
					}
				});
			},
			removeClass:function(c){
				if (this.length==0) {return this};
				var cs=M.isFunction(c)?null:ba(c);
				return this.each(function(d,i){
					if (c==undefined) {return (d.className='');};
					var sc=M.trim(d.className);
					if (cs==null) {
						var cn=c.call(d,i,sc);
						if (cn&&hc(d,cn)) {
							dc(d,cn)
						}
					}
					else{
						M.each(cs,function(i,cn){
							dc(d,cn);
						});
					}
				});
			},
			toggleClass:function(c){
				if (c==undefined||this.length==0) {return this};
				var cs=M.isFunction(c)?null:ba(c);
 				return this.each(function(d,i){
					var sc=M.trim(d.className),cn='';
					if (cs==null) {
						if(cn=c.call(d,i,sc)){
							if (hc(d,cn)) {dc(d,cn)}
							else{d.className=sc+' '+cn}
						}
					}
					else{
						M.each(cs,function(i,ci){
							sc=M.trim(d.className);
							if (hc(d,ci)) {dc(d,ci)}
							else{d.className=sc+' '+ci}
						});
					}
				});
			},
			//筛选
			eq:function(i){
				i=i<0?this.length+i:i;
				return M(this.get(i));
			},
			hasClass:function(c){
				var r=false;
				this.each(function(d){
 					return !(r=hc(d,c));
				});
				return r;
			},
			//w如果为true的话，那么将返回不符合条件的元素，（默认返回符合条件的）
			filter:function(p,w){
				var isf=M.isFunction(p),ls=!isf?M(p):null;
				for (var i = this.length - 1; i >= 0; i--) {
					if ((isf&&((!w&&!p.call(this[0],i))||(w&&p.call(this[0],i)))) || (ls&&((!w&&M.inArray(this[i],ls)<0)||(w&&M.inArray(this[i],ls)>-1)))) {
						AP.splice.call(this,i,1);
					}
				}
				return this;
			},
			//filter的反操作
			not:function(p){
				return this.filter(p,true);
			},
			slice:function(s,e){
				var _s=s==undefined?0:s<0?this.length+s:s,_e=e==undefined?this.length:e;
				for (var i = this.length - 1; i >= 0; i--) {
					if (i>=e && i<=s) {
						AP.splice.call(this,i,1);
					}
				}
				return this;
			},
			is:function(p){
				return this.filter(p).length>0;
			},
			has:function(p){
				var ins=this;
				if (M.isString(p)) {
					return this.filter(function(i){
						return M(p,ins[i]).length>0;
					});
				}else{
					if (p.sjs) {p=p[0];}
					return this.filter(function(i){
						var ds=M('*',ins[i]).get();
						return M.inArray(p,ds)>-1;
					});
				}
			},
			//查找
			find:function(s,c){
				var r=[];
				for (var i = this.length - 1; i >= 0; i--) {
					var d=this[i],cs=d.querySelectorAll(s);
					for (var j = cs.length - 1; j >= 0; j--) {
						(!c||cs[j].parentNode==d)&&r.push(cs[j]);
					};
				}
				return M(uniqd(r));
			},
			children:function(s){
				var _s=!s?'*':s;
  				return this.find(_s,true);
			},
			parentsUntil:function(s,f){
				return diru('parentNode',this,s,f);
			},
			parent:function(s){
				return dirs('parentNode',this,s);
			},
			parents:function(s){
				return this.parentsUntil(null,s);
			},
			closest:function(s){
				var ps=[],r;
				for (var i = this.length - 1; i >= 0; i--) {
					var d=this[i],p;
					if (M(d).is(s)) {
						ps.push(d);
					}else{
						p=dir(this[i],'parentNode',null,true);
						p.nodeType&&ps.push(p);
					}
				}
				r=M(uniqd(ps));
				return s?r.filter(s):r;
			},
			nextUntil:function(s,f){
				return diru('nextElementSibling',this,s,f);
			},
			next:function(s){
				return dirs('nextElementSibling',this,s);
			},
			nextAll:function(s){
				return this.nextUntil(null,s);
			},
			prevUntil:function(s,f){
				return diru('previousElementSibling',this,s,f);
			},
			prev:function(s){
				return dirs('previousElementSibling',this,s);
			},
			prevAll:function(s){
				return this.prevUntil(null,s);
			},
			siblings:function(s){
				return this.nextAll(s).add(this.prevAll(s));
			},
			// 串联
			add:function(s){
				var ins=this;
				M(s).each(function(d){
					AP.push.call(ins,d);
				});
				return M(uniqd(this));
			},
			//文档处理
			append:function(s){
				return dom(this,s);
			},
			appendTo:function(s){
				dom(M(s),this);
 				return this;
			},
			prepend:function(s){
				return dom(this,s,1);
			},
			prependTo:function(s){
				dom(M(s),this,1);
				return this;
			},
			after:function(s){
				return dom(this,s,2);
			},
			before:function(s){
				return dom(this,s,3);
			},
			insertBefore:function(s){
				dom(M(s),this,3);
				return this;
			},
			insertAfter:function(s){
				dom(M(s),this,2);
				return this;
			},
			//替换
			replaceWith:function(s){
				return dom(this,s,4);
			},
			replaceAll:function(s){
				dom(M(s),this,4);
				return this;
			},
			clone:function(e){
				var ins=this,n=M(this.htmls());
				return Event?n.each(function(d,i){
 					for (var k in _ES) {
 						var e=_ES[k][id(ins[i])];
 						//事件会连动，删除一个另外一个也会删除
 						e&&(_ES[k][id(d)]=e);  
					}
				}):n;
			},
			empty:function(){
				return this.html('');
			},
			remove:function(s){
	 			return this.each(function(d) {
	 				if ((!s||M(d).is(s))&&d.parentNode) {
	 					d.parentNode.removeChild(d);
	 					for (var k in _ES) {
	 						delete _ES[k][id(d)];
	 					}
	 				}
				});
			}
	 	},
	 	//ajax
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
				if (!M.isString(url)) {return false}
				var _t=new Date().getTime(),_s=s?M.extend(_s,s):_s,
					xhr=new XMLHttpRequest,url=url.indexOf('?')>-1?url+'&':url+'?',postd=_s.data;
					url+=_s.cache?'':'_t='+_t;
 					if ((_s.type).toLowerCase()=='get') {
						url+=M.JSON.toQuery(_s.data);
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
					if (M.isFunction(_s.error)) {_s.error('ajax不被支持！')}
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
				if (M.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return M.ajax(u,{success:_f,data:_d,dataType:_t||'html'});
			},
			getJSON:function(u,d,f){
				if (!u) {return false;}
				var _d=d,_f=f;
				if (M.isFunction(_d)) {
					_f=_d;
					_d=null;
				}
				return M.ajax(u,{success:_f,data:_d,dataType:'json'});
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
				if (M.isFunction(_d)) {
					_t=_f;
					_f=_d;
					_d=null;
				}
				return M.ajax(u,{type:'post',success:_f,data:_d,dataType:_t});
			}
	 	},
	 	/**浏览器扩展*/
	 	gwe=function(p){
			try {
	            if (W.external && W.external[p]) {
	                var f=W.external[p];
	                return UT.isFunction(f)?f():f;
	            }
			} catch (e) {}
            return '';
        },
		bs={
			isAndroid  		:(/Android/i).test(ua),
   			isIPad  		:(/ipad/i).test(ua),
   			isIPhone  		:(/iphone os/i).test(ua),
   			isWMobile		:(/Windows mobile/i).test(ua),
   			isMobile        :(/mobile|wap/).test(ua),

			isIECore		:(/Trident/i).test(ua),
			isWebkitCore	:(/webkit/i).test(ua),
			isGeckosCore	:(/Gecko/i).test(ua) && !(/khtml/i).test(ua),
			se360			:(function(){
						        var ret =/360se/i.test(ua)|| /360ee/i.test(ua);
						        return ret?ret:(/360se/i).test(gwe('twGetRunPath'));
							})(),
			sougou			:(/MetaSr/i).test(ua),
			qq				:(/QQBrowser/i).test(ua),
			maxthon			:(function(){
								return gwe('max_version').substr(0,1)>0;
					 		})(),
			opera			:W.opera?true:false,
			firefox 		:(/Firefox/i).test(ua),
			uc  			:(/ucweb/i).test(ua),
			liebao			:(/LBBROWSER/i).test(ua),
			baidu			:(/BIDUBrowser/i).test(ua)||gwe('GetVersion')=='baidubrowser'
		},
		nogc=!bs.sougou&&!bs.maxthon&&!bs.qq&&!bs.uc&&!bs.liebao&&!bs.baidu&&!bs.se360;
		bs.ie=(bs.isIECore&&nogc);
		bs.chrome=( /Chrome/i).test(ua)&&W.chrome&&nogc;
		bs.safari=(/Safari/.test(ua))&&!bs.chrome&&nogc;
		bs.prefix=bs.isWebkitCore?'webkit':bs.isGeckosCore?'Moz':bs.opera?'O':bs.isIECore?'ms':'';
	 	/**事件管理栈*/
	 	//滑动事件统一绑定
	 	function swipe(){
			var a	='ontouchstart' in W,
				ES	=a ? 'touchstart' : 'mousedown',
				EM	=a ? 'touchmove' : 'mousemove',
				EE	=a ? 'touchend' : 'mouseup',
				EL	=a ? 'touchleave' : 'mouseout',
				EC	=a ? 'touchcancel' : 'mouseup';

			var st,et,sx,sy,x,y,tap,swipe;
			document.addEventListener(ES,function(e){
		         if (e.touches&&e.touches.length!=1){return;}
		         var touch = e.touches?e.touches[0]:e;
		         st=Date.now()||new Date().getTime();
		         sx = touch.pageX;
		         sy = touch.pageY;
		         tap=true;swipe=false;
		         $(e.target).trigger("swipeStart",e)
			});
			document.addEventListener(EM,function(e){
				if (tap) {
					swipe=true;
					var touch =e.touches?e.touches[0]:e;
					x=touch.pageX;y=touch.pageY;

					var dx=Math.abs(x-sx),dy=Math.abs(y-sy),
						t=(dx>2||dy>2)?(dx>dy?(x>sx?'Right':'Left'):(y>sy?'Down':'Up')):false;
					if (t) {
						e.movement={startx:sx,starty:sy,x:x,y:y};
						$(e.target).trigger("swipe",e)
						$(e.target).trigger("swipe"+t,e)
					};
				}
			});
			document.addEventListener(EL,function(e){
				if (tap) {
					tap=false;
			       	$(e.target).trigger("swipeEnd",e);
				};
			});
			document.addEventListener(EE,function(e){
				if (tap) {
					tap=false;
			       	$(e.target).trigger("swipeEnd",e);
				};
			});
			document.addEventListener(EC,function(e){
				if (tap) {
					tap=false;
			       	$(e.target).trigger("swipeEnd",e);
				};
			});
		}
	 	var _ES={},_swipe,
		EVENTS={
			on:function(){
				if (arguments.length>1){
					var et=arguments[0],d=arguments[1],fn=arguments[2],es;					
					if (M.isFunction(d)) {
						fn=d;d=null;
					}else{
						if (!fn||!M.isFunction(fn)) {
							return this;
						}
					}
					es=uniq(et.split(" "));
					for (var i = 0; i < es.length; i++) {
						var _e=es[i];
						if (typeof _ES[_e] === "undefined") {	
							_ES[_e]={};
							//事件委托
							document.addEventListener(_e,function(e){
								if(_ES[e.type]){
									M(e.target).trigger(e.type,e);
								}
							},false);
							//滑动事件绑定判断
							if((_swipe==undefined)&&(_e.indexOf('swipe')>-1)){
								_swipe=true;
								swipe();
							}
						}
						//将本次选择器放入本对象的data中，便于以后循环获取根据不同selector绑定的事件
						this.each(function(d){
							var hash=id(d);
							if (typeof _ES[_e][hash] === "undefined") {
								_ES[_e][hash]=[];
							}
							_ES[_e][hash].push({'fn':fn,'data':d,'cnt':0});
						});
					};
				}
				return this;
			},
			trigger:function(et){
				if (et && _ES[et]) {
					var _dels=[],e=arguments[arguments.length-1];;
					//在本对象的事件选择器列表中获取所有绑定事件时使用过的选择器来检索事件
					this.each(function(d){
						//始终传入的最后一个参数为event(手动除外)
						e=e.type?e:{'target':d};
						e.type=et;
						var hash=id(d),items=_ES[et][hash]||[];
						for (var j=0,len = items.length; j <len; j++) {
							e.data=items[j]['data'];
							e.firecnt=++items[j]['cnt'];
							//根据返回值来判断是否取消绑定
							if(items[j]['fn'].call(this,e)===false){
								items.splice(j,1);
							}
						}
						//触发其他自定义绑定事件
						// try{
						// 	var evt = document.createEvent('Event'); 
						// 	evt.initEvent(et,true,true); 
						// 	d.dispatchEvent(evt); 
						// }catch(e){console.log(e)}
					});
 				}
				
				return this;
			},
			off:function(et,fn){
				this.each(function(d){
					var hash=id(d),items;
					if (et && _ES[et]) {
						if (items=_ES[et][hash]) {
							if(fn){
								var _dels=[];
								for (var i =items.length - 1; i >= 0; i--) {
									if (items[i]['fn']==fn) {
										_dels.push(i);
									}
								}
								//数组分离删除，防止序号错乱
								for (var i = _dels.length - 1; i >= 0; i--) {
									_ES[et][hash].splice(i,1);
								}
							}else{
								delete _ES[et][hash];
							}
						}
					}else{
						//删除所有
						M.each(_ES,function(i,d){
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
			}
		};
		EVENTS.bind=EVENTS.on;EVENTS.unbind=EVENTS.off;
		/**动画*/
		var atimer=null,_AS={},_apre=bs.prefix?bs.prefix+'Transition':'transition',ntdelay=_apre+'Delay',ntp=_apre+'Property',ntd=_apre+'Duration',nttf=_apre+'TimingFunction',
		speed={'slow':1000,'normal':600,'fast':300},
		gfx=function(d){
			var i=id(d),q=_AS[i];
			if (q==undefined) {
				var ds=d.style,ot={};
				ot[ntp]=ds[ntp];ot[ntd]=ds[ntd];ot[nttf]=ds[nttf];ot[ntdelay]=ds[ntdelay];
				return {dom:d,oldt:ot,t:0,stacks:[]};
			}
			return  _AS[i];
		},
		ANIMS={
			delay:function(t){
				if (M.isNumeric(t)) {
					$(this).each(function(d){
						var q=gfx(d);
							q.stacks.push({'dur':t});
						_AS[id(d)]=q;
					});
				}
				this._run();
				return this;
			},
			/**stop([clearQueue])
			停止所有在指定元素上正在运行的动画。
			如果队列中有等待执行的动画(并且clearQueue没有设为true)，他们将被马上执行
			*/
			stop:function(cq){
				cq=cq===false?false:true;
				this.each(function(d){
					var idx=id(d);
					if (!_AS[idx]) {return false;};
					if (cq) {
						//中断
						var s=d.style;
						for (var i = s.length - 1; i >= 0; i--) {
							d.style[s[i]]=gc(d,s[i]);
						}
					}else{
						var as=_AS[idx],l=as?as.stacks.length:0,p={};
						for (var i = 0; i <l; i++) {
							if (as.stacks[i].tran) {
								M.extend(p,as.stacks[i].tran)
							}
						}
						M(d).css(p);
					}
					M(d).css(_apre,'');
					_AS[idx].stacks=[];
				});
				return this;
			},
			/**animate(params,[speed],[easing],[fn])*/
			animate:function(p,s,e,f){
				if (!M.isPlainObject(p)||M.isEmptyObject(p)) {return this;};
				var	_s=(s==undefined||M.isPlainObject(s))?100:s,
					_e=!e?'ease':e,
					_f=f;
					if (M.isPlainObject(s)) {
						_s=s.speed?s.speed:_s;
						_e=s.easing?s.easing:_e;
						_f=s.callback?s.callback:_f;
					};
					_s=M.isString(_s)?(speed[_s]||100):_s;
					_e=_e=='swing'?'ease-in-out':_e;
				//更新动画队列
 				this.each(function(d){
					var queue=gfx(d),tran={};
					tran[ntp]='all';tran[ntd]=_s/1000+'s';tran[nttf]=_e;
					M.extend(tran,p);
					queue.stacks.push({dur:_s,tran:tran,fn:_f});
					_AS[id(d)]=queue;
				});
				this._run();
				return this;
			},
			/***/
			_run:function(){
				//启动全局动画队列
				if (atimer==null) {
					atimer=new UT.raf(25,function(n){
						var n=0;
						M.each(_AS,function(i,q){
							if (q.stacks.length==0) {
								//本对象的动画序列为空，还原并删除队列中的该对象
								M(q.dom).css(q.oldt);
								delete _AS[i]
							}else{
								var stack=q.stacks[0];
								//本dom的计数器开始
								if (q.t==0) {
									q.t=Date.now();
									if (stack.tran!=undefined) {
										M(q.dom).css(stack.tran);
									}
								}else{
									//判断结束
									if (Date.now()-q.t>=stack.dur){
										if(stack.fn){stack.fn.call(q.dom);}
										q.t=0;
										_AS[i].stacks.shift();
									}
								}
							}
							n++;
						});
						if (n==0) {this.stop();atimer=null};
					});
					atimer&&atimer.start();
				};
			}
		},
		/**
		 * 扩展所有工具包
		 */
		SED=M.extend({},UT,{browser:bs},AJAXS),ED=M.extend(DOMS,EVENTS,ANIMS);
		M.extend(SED);
		M.fn.extend(ED);
		//全局提供
		W.sjs = W.$ = M;
})(window);