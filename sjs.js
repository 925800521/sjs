/**
 * build by awen  71752352@qq.com
 * version 1.1
 */
(function(W, undefined) {
	var D = W.document,
		_$$ = W.$ ? W.$ : undefined,
		wn = W.navigator,
		wl = W.location,
		ua = wn.userAgent.toLowerCase(),
		av = wn.appVersion,
		AP = Array.prototype,
		sh = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,
		DS = {},
		type = function(o) {
			return o != undefined ? (Object.prototype.toString.call(o)).slice(8, -1) : 'undefined';
		};
	/*基础工具类*/
	var UT = {
		noConflict: function() {
			if (_$$) {
				W.$ = _$$;
			}
		},
		uniqueId: function() {
			var t = new Date - 0,
				r = parseInt(Math.random() * 10000);
			return t * 10000 + r;
		},
		type: type,
		isArray: function(o) {
			return type(o) === 'Array';
		},
		isBoolean: function(o) {
			return type(o) === 'Boolean';
		},
		isString: function(o) {
			return type(o) === 'String';
		},
		isFunction: function(o) {
			return type(o) === 'Function';
		},
		isNumeric: function(o) {
			return !isNaN(parseFloat(o)) && isFinite(o);
		},
		isXML: function(el) {
			var doc = el.ownerDocument || el;
			return doc.createElement("p").nodeName !== doc.createElement("P").nodeName;
		},
		isPlainObject: function(o) {
			return type(o) === 'Object';
		},
		isEmptyObject: function(o) {
			var ret = false;
			if (UT.isPlainObject(o)) {
				var name;
				for (name in o) {
					return false;
				}
				ret = true;
			}
			return ret;
		},
		/**正则*/
		isEmptyString: function(s) {
			return (/^\s*$/ig).test(s);
		},
		trim: function(s) {
			return s.replace(/(^\s*)|(\s*$)/g, "");
		},
		each: function(o, f) {
			if (o.forEach) {
				o.some(function(d, i, o) {
					return f.call(o, i, d);
				});
			} else {
				for (var k in o) {
					if (o[k] != undefined) {
						if (f.call(o, k, o[k]) === false) {
							break;
						}
					}
				}
			}
		},
		clone: function(obj) {
			if (typeof obj != 'object' || obj == null) {
				return obj;
			}
			var newObj = {};
			for (var i in obj) {
				newObj[i] = clone(obj[i]);
			}
			return newObj;
		},
		grep: function(o, c, s) {
			var ret = new o.constructor,
				rs = s === true ? false : true;
			if (o && c) {
				UT.each(o, function(i, n) {
					if (c.call(o, n, i) === rs) {
						ret.push(n);
					}
				});
			}
			return ret;
		},
		merge: function(f, s) {
			var args = [f.length, 0].concat(s);
			AP.splice.apply(f, args);
			return f;
		},
		map: function(o, f) {
			if (o && f) {
				var t = [];
				for (var i = 0, l = o.length; i < l; i++) {
					var v = f.call(o, o[i], i);
					if (v == null) {
						return true;
					}
					if (UT.isArray(v)) {
						UT.merge(t, v);
					} else {
						t.push(v);
					}
				}
				o = t;
			}
			return o;
		},
		inArray: function(v, o) {
			if (AP.indexOf) {
				return AP.indexOf.call(o, v);
			} else {
				for (var i = 0, l = o.length; i < l; i++) {
					if (o[i] == v) {
						return i;
					}
				}
			}
			return -1;
		},
		unique: uniqd,
		/**从数组或者对象中移除*/
		remove: function(o, k, isv) {
			var ik = k;
			if (isv === true) {
				ik = null;
				for (var i in o) {
					if (o[i] == k) {
						ik = i;
						break;
					}
				}
			}
			if (ik !== undefined && ik !== null) {
				if (UT.isArray(o)) {
					o.splice(ik, 1);
				}
				if (UT.isPlainObject(o)) {
					delete o[ik];
				}
			}
			return o;
		},
		data: function(d, k, v) {
			return M(d).data(k, v);
		},
		/**json*/
		JSON: {
			parse: function(d) {
				if (typeof d !== "string" || !d) {
					return null;
				}
				d = UT.trim(d);
				return W.JSON ? JSON.parse(d) : eval(d);
			},
			stringify: function(O) {
				if (!O) {
					return '';
				}
				if (W.JSON) {
					return W.JSON.stringify(O);
				}
				var S = [],
					J = "";
				switch (type(O)) {
					case 'Array':
						for (var i = 0; i < O.length; i++) {
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
							O[i] = typeof(O[i]) == 'string' ? '"' + O[i] + '"' : (typeof(O[i]) === 'object' ? this.stringify(O[i]) : O[i]);
							S.push(i + ':' + O[i]);
						}
						J = '{' + S.join(',') + '}';
						break;
				}
				return J;
			},
			parseQuery: function(s) {
				s = decodeURIComponent(s);
				var o = {};
				var os = s.split("&");
				for (var i = 0, len = os.length; i < len; i++) {
					if (os[i].indexOf("=") > -1) {
						var oi = os[i].split("=");
						if (!((/^\s*$/ig).test(o[0]))) {
							var v = oi[1].trim();
							if (v == "null" || v == "undefined") {
								v = "";
							}
							if (v && /(\[|\]|{|})/ig.test(v)) {
								v = UT.JSON.parse(v);
							}
							o[oi[0]] = v;
						}
					}
				}
				return o;
			},
			toQuery: function(t) {
				var k, v, s = [];
				if (typeof t == 'object') {
					for (k in t) {
						v = t[k];
						switch (typeof v) {
							case 'object':
								v = UT.JSON.stringify(v);
								break;
							default:
								break;
						}
						s[s.length] = k + '=' + encodeURIComponent(v);
					}
				}
				return s.join('&');
			},
			count: function(o) {
				var n = 0;
				for (var k in o) {
					n++;
				}
				return n;
			}
		},
		/**帧动画对象*/
		raf: function(frame, fn) {
			//run 动画状态  0初始 1运动 2暂停 3停止
			var _f = Math.ceil(1000 / frame),
				run = 0,
				cnt = 0,
				args = AP.slice.call(arguments, 2),
				instance = this,
				rid = 0;
			args.unshift(cnt);

			function go() {
				if (run < 2) {
					cnt++;
					args[0] = cnt;
					if (fn.apply(instance, args) === false) {
						return;
					}
					rid = setTimeout(go, _f);
				}
			}
			this.start = function() {
				if (run == 0) {
					run = 1;
					rid = setTimeout(go, _f);
				}
			};
			this.pause = function() {
				if (run == 1) {
					run = 2;
				}
			};
			this.resume = function() {
				if (run == 2) {
					run = 1;
					rid = setTimeout(go, _f);
					// console.log("resume>>"+rid);
				}
			};
			this.stop = function() {
				run = 0;
				W.clearTimeout(rid);
			};
		}
	},
		//构建sjs对象
		M = function(s, cxt) {
			return new M.fn.init(s, cxt);
		};
	//对象原型
	M.fn = M.prototype = {
		constructor: M,
		selector: '',
		sjs: 'sjs',
		length: 0,
		init: function(s, cxt) {
			if (W == this) {
				return new M(s, cxt)
			};

			this.context = cxt ? cxt : D;
			if (s) {
				//是sjs对象则返回原sjs对象
				if (isS(s)) {
					return s;
				};
				/**如果是函数则为ready*/
				if (UT.isFunction(s)) {
					if (/complete|loaded|interactive/.test(D.readyState)) {
						s.call(W, M);
					} else {
						D.addEventListener("DOMContentLoaded", function(e) {
							s.call(W, M);
						}, false);
					}
				}
				// M(DOMElement)
				if (s.nodeType || s == W) {
					this[0] = s;
					this.length = 1;
					//dom对象的唯一标志
					id(s);
				}
				//doms数组
				if (UT.isArray(s)) {
					UT.merge(this, s);
				}
				// M(string)
				if (typeof s === "string") {
					var ds;
					if ((ds = sh.exec(s)) && ds[1]) {
						return M(cds(ds[1]));
					} else {
						ds = this.context.querySelectorAll(s);
						this.length = ds.length;
						for (var i = 0, len = this.length; i < len; i++) {
							id(ds[i]);
							this[i] = ds[i];
						}
						this.selector = s;
					}
				}
			}
		},
		size: function() {
			return this.length;
		},
		get: function(i) {
			return i == undefined ? this : this[i];
		},
		index: function() {
			var d = this[0],
				cs = d.parentNode.children;
			return M.inArray(d, cs);
		}
	}
	M.fn.init.prototype = M.fn;
	//主要扩展方法
	M.extend = M.fn.extend = function() {
		var to = arguments[0] || {}, options, len = arguments.length,
			deep = false,
			ci = 0,
			src, copy;
		//第一个参数如果是boolean型的话，则代表是否深度复制，扩充对象为第二个参数
		if (typeof to === "boolean") {
			ci++;
			deep = true;
			to = arguments[ci] || {};
		}
		//to类型检测
		if (typeof to != 'object') {
			to = {};
		}
		//如果只有一个object对象则扩充对象为本身
		if (len == ci + 1) {
			to = this;
		}
		//循环所有要继承的对象
		for (; ci < len; ci++) {
			if ((options = arguments[ci]) != null) {
				for (var key in options) {
					src = to[key];
					copy = options[key];
					//防止两个对象互相包含，造成无休止循环
					if (to == copy) {
						continue;
					}
					//深度复制
					if (deep && copy && (UT.isArray(copy) || UT.isPlainObject(copy))) {
						if (UT.isPlainObject(copy)) {
							src = src && UT.isArray(src) ? src : {};
						}
						if (UT.isArray(copy)) {
							src = src && UT.isPlainObject(src) ? src : [];
						}
						to[key] = M.extend(deep, src, copy);
					} else {
						to[key] = copy;
					}
				};
			};
		}
		return to;
	}
	///////////////////////////////////常用函数
	//ajax回调函数绑定
	function ajaxcall(xhr, s) {
		if (!s || !xhr) {
			return false;
		};
		if (s.success) {
			xhr.onload = function(e) {
				var res = null;
				switch (s.dataType) {
					case 'json':
						res = M.JSON.parse(this.responseText);
						break;
					case 'script':
						res = eval('('+this.responseText+')');
						break;
					case 'xml':
						res = this.responseXML;
					default:
						res = this.response || this.responseText;
						break;
				}
				s.success.call(s.context, res, this);
			}
		}
		if (s.abort) {
			xhr.onabort = function(e) {
				s.abort.call(s.context, this);
			}
		}
		if (s.error) {
			xhr.onerror = function(e) {
				s.error.call(s.context, this);
			}
		}
		if (s.beforeSend) {
			xhr.onloadstart = function(e) {
				s.beforeSend.call(s.context, this);
			}
		}
		if (s.complete) {
			xhr.onloadend = function(e) {
				s.complete.call(s.context, this);
			}
		}
		if (s.progress) {
			xhr.onprogress = function(e) {
				s.progress.call(s.context, e);
			}
		}
		if (s.upProgress) {
			xhr.upload.onprogress = function(e) {
				s.upProgress.call(s.context, e);
			}
		}
	}
	//将数组或者字符串 统一成数组
	function ba(s, b) {
		b = b ? b : ' ';
		return s == undefined ? s : M.isArray(s) ? s : s.split(b);
	}
	//根据字符串创建dom数组,f=true的话 返回documentfragment对象
	function cds(s, f) {
		var tmp = D.createElement('div');
		tmp.innerHTML = s;
		if (f === true) {
			var doc = D.createDocumentFragment(),
				c = tmp.firstChild;
			while (c) {
				var d = c,
					c = c.nextSibling;
				doc.appendChild(d);
			}
			return doc;
		} else {
			return AP.slice.call(tmp.children, 0);
		}
	}
	//将CSS驼峰属性名转换为原本属性名
	function cnes(s) {
		s.replace(/([A-Z])/g, "-$1").toLowerCase();
		return s.replace(/^(webkit-|moz-|o-|ms-)/, '-$1');
	}
	//将CSS属性名改为驼峰
	function cne(s) {
		return s.replace(/-[a-z]/gi, function(c) {
			return c.charAt(1).toUpperCase();
		});
	}
	//获取class值
	function gc(d, n) {
		return W.getComputedStyle(d).getPropertyValue(cnes(n)) || '';
	}
	//检测是否含有className
	function hc(d, c) {
		if ('classList' in d) {
			return d.classList.contains(c);
		}else{
			var r = new RegExp('(\\s|^)' + c + '(\\s|$)');
			return r.test(d.className);
		}
	}
	//删除classname
	function dc(d, c) {
		if (c) {
			if ('classList' in d) {
				d.classList.remove(c);
			}else if(hc(d, c)){
				var r = new RegExp('(\\s|^)' + c);
				d.className = d.className.replace(r, '');
			}
		}
	}
	// 增加classname
	function ac(d,c){
		if ('classList' in d) {
			d.classList.add(c);
		}else if(hc(d,c)){
			var cname = d.className;
      cname += ' ' + c;
      d.className = cname;
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
	function dir(elem, dir, until, only) {
		var matched = [],
			cur = elem[dir];
		while (cur && cur.nodeType !== 9 && (!until || cur.nodeType !== 1 || !M(cur).is(until))) {
			if (cur.nodeType === 1) {
				if (only) {
					return cur;
				}
				matched.push(cur);
			}
			cur = cur[dir];
		}
		return matched;
	}
	/*~parentsUntil,nextUntil,prevUntil*/
	function diru(type, o, s, f) {
		var ps = [],
			i = 0,
			l = o.length,
			r;
		for (; i < l; i++) {
			M.merge(ps, dir(o[i], type, s));
		}
		r = M(uniqd(ps));
		return f ? r.filter(f) : r;
	}
	/*~parent,next,prev*/
	function dirs(type, o, s) {
		var ps = [],
			i = 0,
			l = o.length,
			r;
		for (; i < l; i++) {
			var p = o[i][type];
			p && ps.push(p);
		}
		r = M(uniqd(ps));
		return s ? r.filter(s) : r;
	}
	//获取dom的outhtml代码
	function gh(d) {
		if (d.outerHTML) {
			return d.outerHTML
		};
		var t = D.createElement('div');
		t.appendChild(d.cloneNode(true));
		return t.innerHTML;
	}
	//获取dom对象的唯一标志,e强制重新获取
	function id(d, e) {
		return (e || !d._hash) ? (d._hash = UT.uniqueId()) : d._hash;
	}
	// 判断是否sjs对象
	function isS(o) {
		return o && o != W && o.sjs != undefined;
	}
	//sjs对象整合到documentFragment对象中病返回
	function stodf(o) {
		var d = D.createDocumentFragment();
		for (var i = 0; i < o.length; i++) {
			o[i]
		};
		return d;
	}
	//parent child操作  r是操作的类型 0,append（默认）,1perpend,2after,3before,4 replaceWith
	function dom(o, s, r) {
		if (s && o.length > 0) {
			var isf = M.isFunction(s),
				isstr = M.isString(s),
				iss = isS(s),
				_s = (!isstr && !isf) ? M(s) : null,
				rs = [];
			o.each(function(d, i) {
				var p = r > 1 ? d.parentNode : null,
					df = D.createDocumentFragment();
				if (_s) {
					//dom,sjs会保留事件
					var cs = i > 0 ? _s.clone(true) : _s;
					cs.each(function(m) {
						df.appendChild(m)
					});

					((r == 1) && (d.insertBefore(df, d.firstChild))) ||
						((r == 2) && p && (((p.lastChild == d) && p.appendChild(df)) || p.insertBefore(df, d.nextSibling))) ||
						((r == 3) && p && p.insertBefore(df, d)) ||
						((r == 4) && p && p.replaceChild(df, d)) ||
						d.appendChild(df);
					iss && (i > 0) && rs.push(cs);
				} else {
					var h = isf ? s.call(d, i, d.innerHTML) : s,
						h = isstr ? cds(s, true) : h;
					((r == 1) && (d.insertBefore(h, d.firstChild))) ||
						((r == 2) && p && (((p.lastChild == d) && p.appendChild(h)) || p.insertBefore(h, d.nextSibling))) ||
						((r == 3) && p && p.insertBefore(h, d)) ||
						((r == 4) && p && p.replaceChild(h, d)) ||
						(d.appendChild(h));
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
	//获取元素数据
	function gd(d, k) {
		var hash = id(d),
			ds = DS[hash] || undefined;
		return k == undefined ? ds : (ds && (ds[k] != undefined)) ? ds[k] : undefined;
	}
	//设置元素数据
	function sd(d, k, v) {
		var hash = id(d);
		if (!DS[hash]) {
			DS[hash] = {};
		}
		DS[hash][k] = v;
	}
	//删除数据
	function dd(d, k) {
		var hash = id(d),
			ds = DS[hash] || undefined;
		if (ds) {
			if (k) {
				if (DS[hash][k]) {
					delete DS[hash][k];
				}
			} else {
				delete DS[hash];
			}
		}
	}
	//常规数组去重
	function uniq(o) {
		var j = {}, r = [];
		for (var i = 0; i < o.length; i++) {
			j[o[i]] = o[i];
		}
		M.each(j, function(n, i) {
			r.push(i);
		});
		return r;
	}
	//dom数组去重
	function uniqd(o) {
		var ret = [],
			done = {}, i = 0,
			l = o.length;
		for (; i < l; i++) {
			var d = o[i],
				j = id(d);
			if (!done[j]) {
				done[j] = true;
				ret.push(d);
			};
		}
		return ret;
	}
	//dom扩展
	var DOMS = {
		data: function(k, v) {
			if (this.length > 0) {
				return v ? this.each(function(d) {
					sd(d, k, v)
				}) : gd(this[0], k);
			}
			return this;
		},
		/**删除数据,k可以使某个key，也可以使key数组，或者空格分开的key串*/
		removeData: function(k) {
			if (M.isString(k) && !M.isEmptyString(k)) {
				k = k.split(" ");
			}
			return this.each(function(d) {
				if (M.isArray(k)) {
					M.each(k, function(i, n) {
						dd(d, n)
					});
				} else {
					dd(d);
				}
			});
		},
		outerHTML: function() {
			return gh(this[0]);
		},
		html: function(s) {
			if (this.length == 0) {
				return this;
			}
			if (s == undefined) {
				return this[0].innerHTML;
			}
			var h = M.isString(s) ? s : null,
				isfunc = M.isFunction(s);
			return this.each(function(d, i) {
				if (isfunc) {
					h = s.call(this, i, this.innerHTML);
					if (!h) {
						return true;
					};
				};
				this.innerHTML = h;
			});
		},
		//获取所有匹配元素的整合html代码字符串
		htmls: function() {
			var h = '';
			this.each(function(d) {
				h += gh(d);
			});
			return h;
		},
		val: function(s) {
			return this.length == 0 ? undefined : s == undefined ? ((this[0].value) || '') : this.each(function(d, i) {
				if (M.isFunction(s)) {
					var r = s.call(d, i, d.value);
					if (r != undefined) {
						d.value = r;
					}
				} else {
					d.value = s;
				}
			});
		},
		text: function(s) {
			if (s) {
				return this.each(function(d, i) {
					if (M.isFunction(s)) {
						var r = s.call(d, i, d.textContent);
						if (r != undefined) {
							d.textContent = r;
						}
					} else {
						d.textContent = s;
					}
				});
			} else {
				var ret = '';
				this.each(function(d) {
					ret += d.textContent;
				});
				return ret;
			}
		},
		css: function(a, b) {
			if (a == undefined) {
				return undefined
			}
			if (this.length == 0) {
				return this;
			}
			if (M.isString(a)) {
				var isf = M.isFunction(b);
				return b == undefined ? gc(this[0], a) : this.each(function(d, i) {
					var v = isf ? (b.call(this, i, gc(this, a))) : b;
					v = ((/height|width|left|right|top|bottom|size/i).test(a) && M.isNumeric(v)) ? (v + 'px') : v;
					a = cne(a);
					d.style[a] = v;
				});
			}
			if (M.isPlainObject(a)) {
				var ins = this;
				M.each(a, function(k, v) {
					ins.css(k, v);
				});
			}
			return this;
		},
		/*css状态保存*/
		save: function() {
			return this.each(function(d) {
				var s = gd(d, 'cstack') || [];
				s.push({
					ct: d.style.cssText,
					cn: d.className
				});
				sd(d, 'cstack', s);
			});
		},
		/*css状态回滚
		 **/
		restore: function() {
			return this.each(function(d) {
				var s = gd(d, 'cstack') || [];
				if (s.length > 0) {
					var item = s.pop();
					d.style.cssText = item.ct;
					d.className = item.cn;
					sd(d, 'cstack', s);
				}
			});
		},
		/*name|properties|key,value|fn*/
		attr: function(a, b) {
			if (a) {
				if (b) {
					//两个参数
					if (M.isFunction(b)) {
						this.each(function(d, i) {
							var v = d.getAttribute(a),
								r = b.call(d, i, v);
							if (r != undefined) {
								d.setAttribute(a, r);
							};
						});
					} else {
						this.each(function(d) {
							d.setAttribute(a, b);
						});
					}
				} else {
					//一个参数
					if (M.isString(a)) {
						return this[0].getAttribute(a);
					} else if (M.isPlainObject(a)) {
						this.each(function(d) {
							M.each(a, function(k, v) {
								d.setAttribute(k, v);
							})
						})
					}
				}
			};
			return this;
		},
		removeAttr: function(n) {
			return this.each(function(d) {
				d.removeAttribute(n);
			});
		},
		getBox: function() {
			//safari3.2没有getBoundingClientRect
			if ('getBoundingClientRect' in D.body) {
				var box = this[0].getBoundingClientRect();
				return {
					left: box.left,
					right: box.right,
					top: box.top,
					bottom: box.bottom,
					width: box.right - box.left,
					height: box.bottom - box.top
				}
			} else {
				var st = D.documentElement.scrollTop,
					sl = D.documentElement.scrollLeft,
					al = this[0].offsetLeft,
					at = this[0].offsetTop,
					cp = this[0].offsetParent;
				while (cp != null) {
					al += cp.offsetLeft;
					at += cp.offsetTop;
					cp = cp.offsetParent;
				}
				return {
					left: al - sl,
					right: al + this[0].offsetWidth - sl,
					top: at - st,
					bottom: at + this[0].offsetHeight - st,
					width: this[0].offsetWidth,
					height: this[0].offsetHeight
				}
			}
		},
		inBox: function(x, y) { /**x，y均相对于浏览器窗口，event可用clientX,clientY*/
			var r = false,
				x = parseInt(x),
				y = parseInt(y);
			this.each(function(dom, i) {
				var b = M(this).getBox();
				r = b.left <= x && b.right >= x && b.top <= y && b.bottom >= y;
				if (r == true) {
					return false
				};
			});
			return r;
		},
		/**r参数判断是否反向遍历*/
		each: function(fn, r) {
			if (r === true) {
				for (var i = this.length - 1; i >= 0; i--) {
					if (fn.call(this[i], this[i], i) === false) {
						return this;
					}
				}
			} else {
				for (var i = 0; i < this.length; i++) {
					if (fn.call(this[i], this[i], i) === false) {
						return this;
					}
				}
			}
			return this;
		},
		addClass: function(c) {
			if (c == undefined || this.length == 0) {
				return this
			};
			var cs = M.isFunction(c) ? null : ba(c);
			return this.each(function(d, i) {
				var sc = M.trim(d.className);
				if (cs == null) {
					var cn = c.call(d, i, sc);
					if (cn) {
						ac(d,cn);
					}
				} else {
					M.each(cs, function(i, cn) {
						sc = M.trim(d.className);
						if (cn) {
							ac(d,cn);
						}
					});
				}
			});
		},
		removeClass: function(c) {
			if (this.length == 0) {
				return this
			};
			var cs = M.isFunction(c) ? null : ba(c);
			return this.each(function(d, i) {
				if (c == undefined) {
					return (d.className = '');
				};
				if (cs == null) {
					var cn = c.call(d, i, d.className);
					if (cn) {
						dc(d, cn);
					}
				} else {
					M.each(cs, function(i, cn) {
						dc(d, cn);
					});
				}
			});
		},
		toggleClass: function(c) {
			if (c == undefined || this.length == 0) {
				return this
			};
			var cs = M.isFunction(c) ? null : ba(c);
			return this.each(function(d, i) {
				var sc = M.trim(d.className),
					cn = '';
				if (cs == null) {
					if (cn = c.call(d, i, sc)) {
						if (hc(d, cn)) {
							dc(d, cn)
						} else {
							ac(d,cn);
						}
					}
				} else {
					M.each(cs, function(i, ci) {
						if (hc(d, ci)) {
							dc(d, ci)
						} else {
							ac(d,ci);
						}
					});
				}
			});
		},
		//筛选
		eq: function(i) {
			i = i < 0 ? this.length + i : i;
			return M(this.get(i));
		},
		hasClass: function(c) {
			var r = false;
			this.each(function(d) {
				return !(r = hc(d, c));
			});
			return r;
		},
		//w如果为true的话，那么将返回不符合条件的元素，（默认返回符合条件的）
		filter: function(p, w) {
			var isf = M.isFunction(p),
				ls = !isf ? M(p) : null;
			for (var i = this.length - 1; i >= 0; i--) {
				if ((isf && ((!w && !p.call(this[0], i)) || (w && p.call(this[0], i)))) || (ls && ((!w && M.inArray(this[i], ls) < 0) || (w && M.inArray(this[i], ls) > -1)))) {
					AP.splice.call(this, i, 1);
				}
			}
			return this;
		},
		//filter的反操作
		not: function(p) {
			return this.filter(p, true);
		},
		slice: function(s, e) {
			var _s = s == undefined ? 0 : s < 0 ? this.length + s : s,
				_e = e == undefined ? this.length : e;
			for (var i = this.length - 1; i >= 0; i--) {
				if (i >= e && i <= s) {
					AP.splice.call(this, i, 1);
				}
			}
			return this;
		},
		is: function(p) {
			return this.filter(p).length > 0;
		},
		has: function(p) {
			var ins = this;
			if (M.isString(p)) {
				return this.filter(function(i) {
					return M(p, ins[i]).length > 0;
				});
			} else {
				if (p.sjs) {
					p = p[0];
				}
				return this.filter(function(i) {
					var ds = M('*', ins[i]).get();
					return M.inArray(p, ds) > -1;
				});
			}
		},
		//查找 c是否只查找child
		find: function(s, c) {
			var r = [];
			this.each(function(d) {
				var cs = d.querySelectorAll(s);
				for (var i = 0; i < cs.length; i++) {
					(!c || cs[i].parentNode == d) && r.push(cs[i]);
				};
			});
			return M(uniqd(r));
		},
		children: function(s) {
			var _s = !s ? '*' : s;
			return this.find(_s, true);
		},
		parentsUntil: function(s, f) {
			return diru('parentNode', this, s, f);
		},
		parent: function(s) {
			return dirs('parentNode', this, s);
		},
		parents: function(s) {
			return this.parentsUntil(null, s);
		},
		closest: function(s) {
			var ps = [],
				r;
			for (var i = this.length - 1; i >= 0; i--) {
				var d = this[i],
					p;
				if (M(d).is(s)) {
					ps.push(d);
				} else {
					p = dir(this[i], 'parentNode', null, true);
					p.nodeType && ps.push(p);
				}
			}
			r = M(uniqd(ps));
			return s ? r.filter(s) : r;
		},
		nextUntil: function(s, f) {
			return diru('nextElementSibling', this, s, f);
		},
		next: function(s) {
			return dirs('nextElementSibling', this, s);
		},
		nextAll: function(s) {
			return this.nextUntil(null, s);
		},
		prevUntil: function(s, f) {
			return diru('previousElementSibling', this, s, f);
		},
		prev: function(s) {
			return dirs('previousElementSibling', this, s);
		},
		prevAll: function(s) {
			return this.prevUntil(null, s);
		},
		siblings: function(s) {
			return this.nextAll(s).add(this.prevAll(s));
		},
		// 串联
		add: function(s) {
			var ins = this;
			M(s).each(function(d) {
				AP.push.call(ins, d);
			});
			return M(uniqd(this));
		},
		//文档处理
		append: function(s) {
			return dom(this, s);
		},
		appendTo: function(s) {
			dom(M(s), this);
			return this;
		},
		prepend: function(s) {
			return dom(this, s, 1);
		},
		prependTo: function(s) {
			dom(M(s), this, 1);
			return this;
		},
		after: function(s) {
			return dom(this, s, 2);
		},
		before: function(s) {
			return dom(this, s, 3);
		},
		insertBefore: function(s) {
			dom(M(s), this, 3);
			return this;
		},
		insertAfter: function(s) {
			dom(M(s), this, 2);
			return this;
		},
		//替换
		replaceWith: function(s) {
			return dom(this, s, 4);
		},
		replaceAll: function(s) {
			dom(M(s), this, 4);
			return this;
		},
		clone: function(e) {
			var ins = this,
				n = M(this.htmls()),
				D = ES.data;
			return n.each(function(d, i) {
				var o = M(d);
				for (var k in D) {
					var s = id(ins[i]),
						e = D[k] ? D[k][s] : null;
					if (/swipe|tap/i.test(k)) {
						e && (D[k][id(d)] = e);
					} else {
						e && e.forEach(function(m) {
							o.on(k, m.data, m.fn);
						});
					}
				}
			});
		},
		empty: function() {
			return this.html('');
		},
		remove: function(s) {
			return this.each(function(d) {
				var o = M(d),
					D = ES.data;
				if ((!s || o.is(s)) && d.parentNode) {
					for (var k in D) {
						D[k][id(d)] && o.off(k);
					}
					d.parentNode.removeChild(d);
				}
			});
		}
	},
		//ajax
		AJAXS = {
			ajax: function(url, s) {
				var _s = {
					async: true, // 异步
					cache: false, // 是否读取缓存
					type: 'GET', // 请求方式
					dataType: 'html', // 返回数据类型,xml|html|css|script|json|blod|arraybuffer
					mime: 'text/html',
					data: {}, // 要随请求发送的键值对
					charset: 'utf-8', // 编码
					contentType: 'application/x-www-form-urlencoded',
					// 事件函数句柄
					context: s, // 回调函数的上下文，默认为传递的参数对象
					progress: null, // 下载进度，参数为当前事件对象
					upProgress: null, // 上传进度，参数为当前事件对象
					beforeSend: null, // 请求开始前的函数句柄
					success: null, // 请求成功函数句柄，有两个参数，第一个是返回的数据，第二个是XMLHttpRequest对象
					abort: null, // 请求被取消时的回调句柄，并且传入一个XMLHttpRequest作为参数		
					error: null, // 请求失败似的函数句柄，并且传入一个XMLHttpRequest作为参数
					complete: null // 请求结束后的函数句柄,不管成功或者失败，并且传入一个XMLHttpRequest作为参数
				};
				if (!M.isString(url)) {
					return false
				}
				var _t = new Date - 0,
					xhr = null,
					postd;
				_s = s ? M.extend(_s, s) : _s;
				postd = M.JSON.toQuery(_s.data);
				url += url.indexOf('?') > -1 ? '&' : '?';
				url += _s.cache ? '' : '_t=' + _t;
				if ((_s.type).toLowerCase() == 'get') {
					url += '&' + postd;
					postd = null;
					// jsonp
					if (_s.dataType == 'jsonp') {
						var _fname = 'sjs_' + sjs.uniqueId(),
							_kv = 'callback=' + _fname;
						if (/callback=\?/i.test(url)) {
							url = url.replace(/callback=\?/i, _kv);
						} else {
							url += '&callback=' + _fname;
						}
						W[_fname] = function(v) {
							// console.log(_s.succes);
							_s.success && _s.success.call(null, v);
							delete W[_fname];
						}
						var s = D.createElement('script');
						s.type = 'text/javascript';
						s.async = _s.async;
						s.src = url;
						D.body.appendChild(s);
						return {
							abort: function() {
								_s.success = null;
							}
						};
					}
				}
				xhr = new XMLHttpRequest;
				if (xhr) {
					if (_s.dataType == 'blod' || _s.dataType == 'arraybuffer') {
						xhr.responseType = _s.dataType;
					}
					ajaxcall(xhr, _s);
					xhr.open(_s.type, url, _s.async);
					xhr.setRequestHeader("Accept", _s.mime);
					xhr.setRequestHeader("Content-Type", _s.contentType + "; charset=" + _s.charset + "");
					xhr.send(postd);
				} else {
					if (M.isFunction(_s.error)) {
						_s.error('ajax不被支持！')
					}
				}
				return xhr;
			},
			ajaxForm: function(sel, s) {
				M(sel).each(function(d) {
					if (d.nodeName.toLowerCase() == 'form') {
						var fd = new FormData(d),
							xhr = new XMLHttpRequest();
						if (s && s.data) {
							for (var k in s.data) {
								fd.append(k, s.data[k]);
							}
						}
						ajaxcall(xhr, s);
						xhr.open(d.method, d.action);
						xhr.send(fd);
					}
				});
			},
			get: function(u, d, f, t) {
				if (!u) {
					return false;
				}
				var _d = d,
					_f = f,
					_t = t;
				if (M.isFunction(_d)) {
					_t = _f;
					_f = _d;
					_d = null;
				}
				return M.ajax(u, {
					success: _f,
					data: _d,
					dataType: _t || 'html'
				});
			},
			getJSON: function(u, d, f) {
				if (!u) {
					return false;
				}
				var _d = d,
					_f = f,
					_ty = /callback=?/i.test(u) ? 'jsonp' : 'json';
				if (M.isFunction(_d)) {
					_f = _d;
					_d = null;
				}
				// console.log(u,_f,_d,_ty);
				return M.ajax(u, {
					success: _f,
					data: _d,
					dataType: _ty
				});
			},
			getScript: function(u, f) {
				if (!u) {
					return false;
				}
				var script = document.createElement('script');
				script.async = true;
				script.src = u;
				script.onload = f;
				document.body.appendChild(script);
			},
			post: function(u, d, f, t) {
				if (!u) {
					return false;
				}
				var _d = d,
					_f = f,
					_t = t;
				if (M.isFunction(_d)) {
					_t = _f;
					_f = _d;
					_d = null;
				}
				return M.ajax(u, {
					type: 'post',
					success: _f,
					data: _d,
					dataType: _t
				});
			}
		},
		/**浏览器扩展*/
		gwe = function(p) {
			try {
				if (W.external && W.external[p]) {
					var f = W.external[p];
					return UT.isFunction(f) ? f() : f;
				}
			} catch (e) {}
			return '';
		},
		bs = {
			isAndroid: (/Android/i).test(ua),
			isIPad: (/ipad/i).test(ua),
			isIPhone: (/iphone os/i).test(ua),
			isWMobile: (/Windows mobile/i).test(ua),
			isMobile: (/mobile|wap/).test(ua),

			isIECore: (/Trident/i).test(ua),
			isWebkitCore: (/webkit/i).test(ua),
			isGeckosCore: (/Gecko/i).test(ua) && !(/khtml/i).test(ua),
			se360: (function() {
				var ret = /360se/i.test(ua) || /360ee/i.test(ua);
				return ret ? ret : (/360se/i).test(gwe('twGetRunPath'));
			})(),
			sougou: (/MetaSr/i).test(ua),
			qq: (/QQBrowser/i).test(ua),
			maxthon: (function() {
				return gwe('max_version').substr(0, 1) > 0;
			})(),
			opera: W.opera ? true : false,
			firefox: (/Firefox/i).test(ua),
			uc: (/ucweb/i).test(ua),
			liebao: (/LBBROWSER/i).test(ua),
			baidu: (/BIDUBrowser/i).test(ua) || gwe('GetVersion') == 'baidubrowser'
		},
		nogc = !bs.sougou && !bs.maxthon && !bs.qq && !bs.uc && !bs.liebao && !bs.baidu && !bs.se360;
	bs.ie = (bs.isIECore && nogc);
	bs.chrome = (/Chrome/i).test(ua) && W.chrome && nogc;
	bs.safari = (/Safari/.test(ua)) && !bs.chrome && nogc;
	bs.prefix = bs.isWebkitCore ? 'webkit' : bs.isGeckosCore ? 'Moz' : bs.opera ? 'O' : bs.isIECore ? 'ms' : '';
	bs.hasTouch = 'ontouchstart' in W;
	/**事件管理栈*/
	var SET = {
		'vmousecancel': (bs.hasTouch ? 'touchcancel' : 'mouseout'),
		'vmousedown': (bs.hasTouch ? 'touchstart' : 'mousedown'),
		'vmousemove': (bs.hasTouch ? 'touchmove' : 'mousemove'),
		'vmouseup': (bs.hasTouch ? 'touchend' : 'mouseup'),
		'vmouseout': (bs.hasTouch ? 'touchleave' : 'mouseout'),
	},
		// swipe tap 扩展    不支持live
		tap, sx, sy, px, py, target, //手势相关
		lto = 800,
		lt = null,
		st, //长点击监控相关
		// 全局down监控
		gtapdown = function(e) {
			tap = true;
			var touch = e.touches ? e.touches[0] : e;
			sx = px = touch.pageX;
			sy = py = touch.pageY;
			// 长连接监控，缺点不支持终止冒泡，有点，不用每个元素单独监控，增加效率
			st = new Date - 0;
			lt = setInterval(function() {
				if (lt && (new Date - st) > lto) {
					clearInterval(lt);
					lt = null;
					e.stopPropagation = function() {
						this._sbunble = true;
					};
					ES.touchs.forEach(function(d, i) {
						!e._sbunble && M.Event.trigger.call(d, e, 'longTap');
					});
				};
			}, 200);
			M(document).on('vmousemove', gtapmove);
		},
		// 全局move监控
		gtapmove = function(e) {
			if (lt) {
				clearInterval(lt);
				lt = null
			};
			//屏蔽多点触控
			if (tap) {
				var touch = e.touches ? e.touches[0] : e,
					x = touch.pageX,
					y = touch.pageY,
					dx = Math.abs(x - px),
					dy = Math.abs(y - py);
				// 优化执行  如果位移小于限制值则不进行任何操作
				if (dx < ES.swipeStep && dy < ES.swipeStep) {
					return
				};
				// 判断方向
				target = dx > dy ? (x > sx ? 'right' : 'left') : (y > sy ? 'down' : 'up');
				px = x;
				py = y;
				// trigger当前处于监控列表的元素,1.1版本开始过程函数只会处理swipe绑定，没有了swipeleft,Right，Top,Down
				ES.touchs.forEach(function(d, i) {
					e.movement = {
						startx: sx,
						starty: sy,
						x: x,
						y: y,
						mx: dx,
						my: dy,
						target: target
					};
					M.Event.trigger.call(d, e, 'swipe');
				});
			}
		},
		// 全局up监控
		gtapup = function(e) {
			e.stopPropagation = function() {
				this._sbunble = true;
			};
			if (lt) {
				clearInterval(lt);
				lt = null;
				ES.touchs.forEach(function(d, i) {
					!e._sbunble && M.Event.trigger.call(d, e, 'tap');
				});
			} else if (target) {
				e.movement = {
					startx: sx,
					starty: sy,
					x: px,
					y: py,
					target: target
				};
				ES.touchs.forEach(function(d, i) {
					!e._sbunble && M.Event.trigger.call(d, e, 'swipeEnd');
				});
			}
			ES.touchs = [];
			tap = false;
			M(document).off('vmousemove', gtapmove)
		},
		//初始化全局手势操作
		initTouch = function() {
			M(document).on('vmousedown', gtapdown).on('vmouseup', gtapup);
		},
		// dom的down操作
		tapdown = function(e) {
			// bs.isAndroid&&e.preventDefault();
			ES.touchs.push(this);
		},
		// dom的out操作
		tapout = function(e) {
			if (tap && M(e.relatedTarget).parents(this).length == 0) {
				e.movement = {
					startx: sx,
					starty: sy,
					x: px,
					y: py,
					target: target
				};
				M.Event.trigger.call(this, e, 'swipeEnd');
				UT.remove(ES.touchs, this);
			}
		},
		//ES[type][domid]=[ES_item,ES_item....] || ES[type][selector]=[ES_item,ES_item....]; 
		//ES_item={cnt:0,fn:,data:}; cnt 当前执行的次数
		ES = {
			// swipe出发的精度，默认为2
			swipeStep: 2,
			//是否监控swipe时间的mouseout
			swipeCheckOut: false,
			//记录当前点击开始的监控对象列表,touch监控事件初始化时才会初始化为数组
			touchs: null,
			//已经live绑定的事件列表（一个事件类型只绑定一个代理函数）
			lives: {},
			// dom事件列表，每个事件，每个dom绑定一个事件类型
			data: {},
			// dom代理函数事件,每个dom每个事件类型只会绑定一个func函数来代理。由于在事件中回调，所以this代表的是dom
			// e 为event,et自定义的触发事件，不设置的话则为e自身的type，k自定义的触发对象（dom或者selector），默认为dom对象本身
			trigger: function(e, et, k) {
				et = et ? et : e.type;
				var s = k ? k : id(this),
					d = (k && k.nodeType) ? k : this,
					D = k ? ES.lives : ES.data,
					el = D[et] ? D[et][s] : null;
				if (el) {
					for (var i = 0, l = el.length; i < l; i++) {
						var n = el[i];
						e.firecnt = ++n.cnt;
						e.data = n.data;
						if (n.fn.call(this, e) === false) {
							ES.remove(et, d, n.fn);
							i--;
							l--;
						}
					}
				};
			},
			// selector的代理函数事件，根据选择器来匹配元素从而确认函数是否执行。
			live: function(e) {
				var et = e.type,
					d = e.target,
					o = M(d),
					os = o.add(o.parentsUntil(document.body)),
					ss = ES.lives[et] || [],
					dss = {};
				e.stopPropagation = function() {
					this._sbunble = true;
				}
				// 先检索出所有该事件类型的live绑定dom列表
				for (var s in ss) {
					dss[s] = M(s);
				}
				// 如此繁琐的循环，是为了保障冒泡的顺序
				os.each(function(d) {
					if (e._sbunble) {
						return false;
					}
					M.each(dss, function(s, n) {
						M(d).is(n) && ES.trigger.call(d, e, null, s);
					});
				});
			},
			// 事件列表中增加某事件类型某dom绑定的事件
			// d可能是dom也可能是selector
			add: function(et, d, da, f) {
				var s = d,
					D = ES.lives;
				if (typeof d != 'string') {
					s = id(d);
					D = ES.data;
					// 增加swipe，tap判断
					if (/swipe|tap/i.test(et)) {
						if (ES.touchs == null) {
							ES.touchs = [];
							initTouch();
						}
						var o = M(d);
						if (!o.data('tapinit')) {
							o.on('vmousedown', tapdown).data('tapinit', true);
							ES.swipeCheckOut && o.on('vmouseout', tapout);
						}
					} else {
						d.addEventListener(et, ES.trigger, false);
					}
				} else {
					// 如果该event.type下没有元素，则初始化live监听列表
					if (!D[et]) {
						document.addEventListener(et, ES.live, false);
					}
				}!D[et] && (D[et] = {});
				!D[et][s] && (D[et][s] = []);
				D[et][s].push({
					cnt: 0,
					data: da,
					fn: f
				});
			},
			// 事件列表中删除某事件类型[某dom]绑定的事件,暂时没有根据事件列表的为空时删除代理事件绑定
			// d可能是dom也可能是selector
			// isDie  是否die操作
			remove: function(et, d, f, isDie) {
				if (!et || !d) {
					return;
				}
				var s = isDie ? d : id(d),
					D = isDie ? this.lives : this.data;
				if (f == undefined) {
					D[et] && D[et][s] && (delete D[et][s]);
				} else {
					if (D[et] && D[et][s]) {
						var el = D[et][s];
						for (var i = 0, l = el.length; i < l; i++) {
							if (el[i]['fn'] == f) {
								D[et][s].splice(i, 1);
								i--;
								l--; //这里没有直接return 因为有可能同一个函数绑定两次。。
							}
						}
						(D[et][s].length == 0) && (delete D[et][s]);
					}
				}
				D[et] && (M.JSON.count(D[et]) == 0) && (delete D[et]);
				// 解除事件绑定
				if (isDie) {
					if (!D[et]) {
						document.removeEventListener(et, this.live, false);
						return;
					};
				} else {
					if (/swipe|tap/i.test(et)) {
						if (!D['tap'] && !D['longTap'] && !D['swipe']) {
							M(d).off('vmousedown', tapdown).off('vmouseout', tapout).data('tapinit', false);
						};
					} else {
						if (!D[et] || !D[et][s]) {
							d.removeEventListener(et, this.trigger, false);
						}
					}
				}
			}
		};

	UT.each(['live', 'die', 'bind', 'unbind', 'on', 'off', 'delegate', 'undelegate', 'one', 'trigger'], function(i, n) {
		M.fn[n] = function(evs, da, f) {
			if (!evs) {
				return this;
			}
			da && !f && (f = da) && (da = undefined);
			//兼容多事件类型同时操作
			var es = evs.split(' '),
				s = this.selector;
			for (var i = 0, l = es.length; i < l; i++) {
				var et = es[i];
				et = SET[et] ? SET[et] : et;
				switch (n) {
					case 'live':
						if (!s) {
							return this;
						}
						ES.add(et, s, da, f);
						break;
					case 'die':
						if (!s) {
							return this;
						}
						ES.remove(et, s, f, true);
						break;
					default:
						for (var i = 0, l = this.length; i < l; i++) {
							s = this[i];
							switch (n) {
								case 'bind':
								case 'on':
								case 'delegate':
									if (!f) {
										return this;
									}
									ES.add(et, s, da, f);
									break;
								case 'unbind':
								case 'off':
								case 'undelegate':
									ES.remove(et, s, f);
									break;
								case 'one':
									ES.add(et, s, da, function() {
										f.call(this, arguments[0]);
										return false;
									});
									break;
								case 'trigger':
									// 模拟触发绑定事件 ，兼容touch
									var ev = document.createEvent("Events"); //MouseEvents<UIEvents<Events
									ev.initEvent(et, true, true);
									s.dispatchEvent(ev);
									break;
							}
						}
						break;
				}
			};
			return this;
		}
	});

	M.Event = ES;
	/**动画*/
	var atimer = null,
		_AS = {}, _apre = bs.prefix ? bs.prefix + 'Transition' : 'transition',
		ntdelay = _apre + 'Delay',
		ntp = _apre + 'Property',
		ntd = _apre + 'Duration',
		nttf = _apre + 'TimingFunction',
		speed = {
			'slow': 1000,
			'normal': 600,
			'fast': 300
		},
		gfx = function(d) {
			var i = id(d),
				q = _AS[i];
			if (q == undefined) {
				var ds = d.style,
					ot = {};
				ot[ntp] = ds[ntp];
				ot[ntd] = ds[ntd];
				ot[nttf] = ds[nttf];
				ot[ntdelay] = ds[ntdelay];
				return {
					dom: d,
					oldt: ot,
					t: 0,
					stacks: []
				};
			}
			return _AS[i];
		},
		ANIMS = {
			isAnimate: function() {
				var r = false;
				this.each(function(d) {
					if (_AS[id(d)]) {
						r = true;
						return false;
					}
				});
				return r;
			},
			delay: function(t) {
				if (M.isNumeric(t)) {
					this.each(function(d) {
						var q = gfx(d);
						q.stacks.push({
							'dur': t
						});
						_AS[id(d)] = q;
					});
				}
				this._run();
				return this;
			},
			/**stop([clearQueue])
		停止所有在指定元素上正在运行的动画。
		如果队列中有等待执行的动画(并且clearQueue没有设为true)，他们将被马上执行
		*/
			stop: function(cq) {
				cq = cq === false ? false : true;
				this.each(function(d) {
					var idx = id(d);
					if (!_AS[idx]) {
						return false;
					};
					if (cq) {
						//中断
						var s = d.style;
						for (var i = s.length - 1; i >= 0; i--) {
							d.style[s[i]] = gc(d, s[i]);
						}
					} else {
						var as = _AS[idx],
							l = as ? as.stacks.length : 0,
							p = {};
						for (var i = 0; i < l; i++) {
							if (as.stacks[i].tran) {
								M.extend(p, as.stacks[i].tran)
							}
						}
						M(d).css(p);
					}
					M(d).css(_apre, '');
					_AS[idx].stacks = [];
				});
				return this;
			},
			/**animate(params,[speed],[easing],[fn])*/
			animate: function(p, s, e, f) {
				if (!M.isPlainObject(p) || M.isEmptyObject(p)) {
					return this;
				};
				var a = type(s),
					b = type(e),
					_s = 'normal',
					_e = 'linear',
					_f = null,
					argl = arguments.length;
				if (a == 'Object') {
					_s = s.speed ? s.speed : _s;
					_e = s.easing ? s.easing : _e;
					_f = s.callback ? s.callback : _f;
				} else {
					var timfunc = /^(ease|cubic-bezier|linear).*/;
					switch (argl) {
						case 2:
							if (a == 'Function') {
								_f = s;
							} else if (a == 'String') {
								if (timfunc.test(s)) {
									_e = s;
								} else {
									_s = s;
								}
							} else {
								_s = s;
							}
							break;
						case 3:
							if (b == 'Function') {
								_f = e;
								if (a == 'String' && timfunc.test(s)) {
									_e = s;
								} else {
									_s = s;
								}
							} else {
								_s = s;
								_e = e;
							}
							break;
						case 4:
							_s = s;
							_e = e;
							_f = f;
							break;
					}
				}
				// console.log(_s,_e,a,b);
				_s = UT.isString(_s) ? (speed[_s] || speed['normal']) : _s;
				_e = _e == 'swing' ? 'ease-in-out' : _e;
				//更新动画队列
				this.each(function(d) {
					var queue = gfx(d),
						tran = {};
					tran[ntp] = 'all';
					tran[ntd] = _s / 1000 + 's';
					tran[nttf] = _e;
					M.extend(tran, p);
					queue.stacks.push({
						dur: _s,
						tran: tran,
						fn: _f
					});
					_AS[id(d)] = queue;
				});
				this._run();
				return this;
			},
			/**启动全局动画队列*/
			_run: function() {
				if (atimer == null) {
					atimer = new UT.raf(20, function() {
						var n = 0;
						M.each(_AS, function(i, q) {
							if (q.stacks.length == 0) {
								//本对象的动画序列为空，还原并删除队列中的该对象
								M(q.dom).css(q.oldt);
								delete _AS[i]
							} else {
								var stack = q.stacks[0];
								//本dom的计数器开始
								if (q.t == 0) {
									q.t = new Date - 0;
									if (stack.tran != undefined) {
										M(q.dom).css(stack.tran);
									}
								} else {
									//判断结束
									if (new Date - q.t >= stack.dur) {
										if (stack.fn) {
											stack.fn.call(q.dom);
										}
										q.t = 0;
										_AS[i].stacks.shift();
									}
								}
							}
							n++;
						});
						if (n == 0) {
							this.stop();
							atimer = null
						};
					});
					atimer && atimer.start();
				}
			}
		},
		/**动画扩展包*/
		animExt = function(oo, t, s, e, f) {
			if (oo.isAnimate()) {
				return false
			};
			oo.each(function(d) {
				var o = M(d),
					ds = o.data('sjs_aext'),
					dis = o.css('display'),
					oc = {
						'overflow': 'hidden'
					}, /*动画初始css属性*/
					ac = {}, /*动画css属性*/
					ed = 'none'; /*动画结束后的显示状态*/
				if (!ds) {
					o.save();
					o.css({
						'display': 'block'
					});
					ds = o.getBox();
					ds.dis = (dis == 'none') ? 'block' : dis;
					o.restore();
					o.data('sjs_aext', ds);
				}
				t = (t == 'slideToggle') ? ((dis == 'none') ? 'slideDown' : 'slideUp') : ((t == 'fadeToggle') ? ((dis == 'none') ? 'fadeIn' : 'fadeOut') : ((t == 'spreadToggle') ? ((dis == 'none') ? 'spreadRight' : 'spreadLeft') : t));
				switch (t) {
					case 'slideUp':
						oc.height = ds.height;
						ac.height = 0;
						break;
					case 'slideDown':
						if (dis != 'none') {
							return oo;
						}
						oc.height = 0;
						oc.display = ed = ds.dis;
						ac.height = ds.height;
						break;
					case 'spreadLeft':
						oc.width = ds.width;
						ac.width = 0;
						break;
					case 'spreadRight':
						if (dis != 'none') {
							return oo;
						}
						oc.width = 0;
						oc.display = ed = ds.dis;
						ac.width = ds.width;
						break;
					case 'fadeIn':
						if (dis != 'none') {
							return oo;
						}
						oc.opacity = 0;
						oc.display = ed = ds.dis;
						ac.opacity = 1;
						break;
					case 'fadeOut':
						oc.opacity = 1;
						ac.opacity = 0;
						break;
				}
				o.save();
				o.css(oc).animate(ac, s, e, function() {
					o.restore();
					o.css('display', ed);
					if (f) {
						f.call(d)
					};
				});
			});
			return oo;
		};
	UT.each(['slideDown', 'slideUp', 'slideToggle', 'spreadRight', 'spreadLeft', 'spreadToggle', 'fadeIn', 'fadeOut', 'fadeToggle'], function(i, d) {
		M.fn[d] = function(s, e, f) {
			return animExt(this, d, s, e, f);
		}
	});
	/**
	 * 扩展所有工具包
	 */
	var SED = M.extend({}, UT, {
		browser: bs
	}, AJAXS),
		ED = M.extend(DOMS, ANIMS);
	M.extend(SED);
	M.fn.extend(ED);
	//全局提供
	W.sjs = W.$ = M;
})(window);