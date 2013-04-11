<html lang="en-US">
<head>
  <meta charset="UTF-8">
	<title></title>
</head>
<body>
	
<div class="chead">简介</div>
<p>
	　　之所以写这个库，缘起于一次baidu无线阿拉丁项目，本来作为前端开发者，使用惯了jquery，而且jquery也给力的发布了jquery的mobile库。但是。。。。悲剧的是他居然是依赖于原来的jquery库。哎，各种压缩过之后依然不小啊。国外有个zepto.js， &nbsp;仿jquery针对html5封的一个库，高度模仿啊，以至于能无缝的对接各个jquery第三方库。膜拜一下。但是awen开发中发现了一些bug，尤其是动画部分，这里就不详细说了。总之，本人不爽了。为了以后自己不再蛋疼，才想自己封一个html5的库，精简点，支持链式，不要那么多功能，可扩展。所以想了想就叫 simple javascript 吧，简称sjs(也有朋友戏称sexy javascript。。。)。</p>
<p>
	　　首先，它跟jquery的模式也差不多，一些个人喜欢的jquery的方法也封了进去，当然也加了一些自己的api。主要是为了减轻从新熟悉api的过程。支持智能手机浏览器。那么一些不经常用的api肯定被就简化了（O(∩_∩)O）比如jquery的index在这里只能获取当前元素的索引。position,width，height统一为了getBox等等。。。众口难调嘛~不过各位有需要的话可以自己扩展或者给我邮件讨论。
</p>
<p>
	　　虽然说了针对于html5，但是习惯性的，有许多接口基本上还是考虑了兼容,因为有些移动客户端浏览器也相当的不给力，比如iphone3的原生safari就不支持JSON等。为了追求效率也写了不少冗余代码，于是代码量比预期的臃肿了。。。哎。最起码智能手机开发要兼容啊。这毕竟是第一个版本，以后会优化。
</p>
<p>  如果没有特殊说明，表明该接口与jquery用法相同，具体示例与说明请查阅资源总的api.html或者jquery文档。  


</p>
<p>
在线的引用地址为：http://cczw2010.github.com/sjs/sjs.min.js
</p>
</div>

</body>
</html>
