/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(15);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Home = __webpack_require__(3);

var _Home2 = _interopRequireDefault(_Home);

var _User = __webpack_require__(4);

var _User2 = _interopRequireDefault(_User);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

var _Cart = __webpack_require__(5);

var _Cart2 = _interopRequireDefault(_Cart);

var _Myselef = __webpack_require__(6);

var _Myselef2 = _interopRequireDefault(_Myselef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadFooterStyle: function loadFooterStyle(index) {
		$("#footer").find("li").eq(index).addClass("active").siblings().removeClass("active");
	},
	loadFooter: function loadFooter() {

		$("#footer").load("viwes/myFooter.html", function () {
			console.log("ok");
			sessionStorage.setItem("index", 0);
			$("#footer").find("li").on("tap", function () {
				$(this).addClass("active").siblings().removeClass("active");
				var index = $(this).index();
				if (index == "2") {} else {
					sessionStorage.setItem("index", index);
				}

				switch (index) {
					case 0:
						_Home2.default.loadHeader();
						_Home2.default.loadContent();
						break;
					case 1:
						_User2.default.loadHeader();
						_User2.default.loadContent();
						break;
					case 2:
						_Cart2.default.loadHeader();
						_Cart2.default.loadContent();
						break;
					case 3:
						_Myselef2.default.loadHeader();
						_Myselef2.default.loadContent();
						break;
					default:
						break;
				}
			});
		});
	}
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(7);

__webpack_require__(16);

var _Search = __webpack_require__(8);

var _Search2 = _interopRequireDefault(_Search);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

var _Cart = __webpack_require__(5);

var _Cart2 = _interopRequireDefault(_Cart);

var _Spxq = __webpack_require__(12);

var _Spxq2 = _interopRequireDefault(_Spxq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/home.html #searchHeader", function () {

			$("#search").on("tap", function () {
				$("#footer").css("display", "none");
				_Search2.default.loadHeader();
				_Search2.default.loadContent();
			});
			$("#cart").on("tap", function () {
				_Cart2.default.loadHeader();
				_Cart2.default.loadContent();
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/home.html #homeContent", function () {
			$.ajax({
				url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=51822%2C51827%2C41119%2C51833%2C51836%2C4604&callback=?",
				type: "get",
				dataType: "jsonp",
				success: function success(data) {
					//首页轮播
					var obj = data.data;
					var objImg = data.data[51822].list;
					//	console.log(obj);
					for (var i in objImg) {
						//、console.log(i);
						$("#homeWrapper").append('<div class="swiper-slide" id="imgDiv">' + '<img src="' + objImg[i].image_800 + '"/>' + '</div>');
					}
					var mySwiper = new Swiper("#homeBanner", {
						pagination: ".swiper-pagination",
						autoplay: 3000,
						loop: true,
						autoplayDisableOnInteraction: false
					});
					//轮播下面第一排
					var objNav = data.data[51827].list;
					for (var j in objNav) {
						//console.log(i);
						$("#nav").append('<div id="navShop">' + '<span>' + objNav[j].title + '</span>' + '<i>' + objNav[j].description + '</i>' + '<img src="' + objNav[j].image + '"/>' + '</div>' + '<p></p>');
					};
					//倒计时
					var timeOut = data.data[41119].list;
					$("#timeOut").append('<p>' + timeOut[0].title + '.' + timeOut[0].viceTitle + '</p>' + '<div class="time">' + '<span class="timeHour">03</span>' + ':' + '<span class="timeMinute">00</span>' + ':' + '<span class="timeSecond">15</span>' + '</div>');

					var dingshiqi = setInterval(function () {
						clearInterval(dingshiqi);
						var timeSecond = $(".timeSecond").html();
						var timeMinute = $(".timeMinute").html();
						var timeHour = $(".timeHour").html();

						if (timeSecond == '00') {

							timeSecond = 59;
							if (timeMinute == '00') {
								timeMinute = 59;
								timeHour--;
							} else {
								timeMinute--;
							};

							if (timeHour == '0' + '-1') {
								timeSecond = '00';
								timeMinute = '00';
								timeHour = '00';
								clearInterval(dingshiqi);
							}
						} else {
							if (timeSecond <= 1) {
								timeSecond = '00';
							} else {
								timeSecond--;
							}
						};
						$(".timeSecond").html(timeSecond);
						$(".timeMinute").html(timeMinute);
						$(".timeHour").html(timeHour);
					}, 1000);

					//倒计时下面的商品

					var objList = data.data[51833].list;

					for (var n in objList) {
						var str = objList[n].viceTitle;
						var reg = /^\{/gi;
						var reg2 = /\}$/gi;
						str = str.replace(reg, '');
						str = str.replace(reg2, '');
						$("#listBox").append('<li >' + '<strong>' + objList[n].title + '</strong>' + '<i>' + str + ' </i>' + '<img src="' + objList[n].image + '"/>' + '</li>');
					};

					var objUser = data.data[51836].list;
					for (var o in objUser) {
						$("#listUser").append('<li>' + '<img src="' + objUser[o].image + '"/>' + '<p>' + objUser[o].title + '</p>' + '</li>');
					}
				}
			});

			$.ajax({
				type: "get",
				url: "https://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&_version=61&_=1501124581862&callback=?",
				dataType: "jsonp",
				success: function success(data) {
					var data = data.result.wall.docs;
					//console.log(data);
					for (var t in data) {
						var $li = $('<li class="listLi" iid= "' + data[t].iid + '"></li>');
						$("#bottomNav").append($li);
						$li.append('<img src="' + data[t].img + '"/>' + '<ol class="olNav"></ol>' + '<p class="pNav">' + '<a>' + '￥' + data[t].price + '</a>' + '<a>' + data[t].cfav + '</a>' + '</p>');
					}
					for (var p in data[t].props) {
						$(".olNav").append('<span>' + data[t].props[p] + '</span>');
						//console.log(data[t].props[p])
					};
					//点击商品进入详情页
					var ni = $("#bottomNav li").on("tap", function () {
						//console.log(11111);
						$("#header").css("display", "none");
						var iid = $(this).attr("iid");
						localStorage.setItem("iid", iid);
						_Spxq2.default.loadContent();
						_Spxq2.default.loadFooter();
					});
				}

			});

			//商品列表	

			//http://m.mogujie.com/jsonp/detail.api/v1?iid=1k3yaqm&template=1-2-detail_normal-1.0.0&callback=httpCb150128736200598&_=1501287362005
			//http://m.mogujie.com/jsonp/detail.api/v1?iid=1kest58&template=1-2-detail_normal-1.0.0&callback=httpCb150128799985234&_=1501287999852
			//http://m.mogujie.com/jsonp/detail.api/v1?iid=1kcb2l2&template=1-2-detail_normal-1.0.0&callback=?&_=1501309346884			

		});
	}
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(7);

__webpack_require__(21);

var _Search = __webpack_require__(8);

var _Search2 = _interopRequireDefault(_Search);

var _Cart = __webpack_require__(5);

var _Cart2 = _interopRequireDefault(_Cart);

var _Spxq = __webpack_require__(12);

var _Spxq2 = _interopRequireDefault(_Spxq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/user.html #searchHeader", function () {
			console.log("ok");
			$("#search").on("tap", function () {
				$("#footer").css("display", "none");
				_Search2.default.loadHeader();
				_Search2.default.loadContent();
			});
			$("#cart").on("tap", function () {
				_Cart2.default.loadHeader();
				_Cart2.default.loadContent();
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/user.html #userContent", function () {
			console.log("ok");
			$.ajax({
				url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=41789%2C4604&callback=?",
				type: "get",
				success: function success(data) {

					var listTittle = data.data[41789].list;
					//console.log(listTittle);
					for (var i in listTittle) {
						$("#leftNav").append('<li maitKey="' + listTittle[i].maitKey + '" miniWallkey="' + listTittle[i].miniWallkey + '">' + '<p>' + listTittle[i].title + '</p>' + '</li>');
					}
					//默认
					$("#leftNav li").eq(0).addClass("active");
					$.ajax({
						url: "http://mce.mogujie.com/jsonp/makeup/3?pid=41888&_=1500888633455&callback=?",
						type: "get",
						success: function success(data) {
							$("#mianUp").html("");
							var dataList = data.data.categoryNavigation.list;
							//console.log(dataList);
							for (var p in dataList) {
								$("#mianUp").append('<li>' + '<img src="' + dataList[p].image + '"/>' + '<span>' + dataList[p].title + '</span>' + '</li>');
							}
						}

					});
					$.ajax({
						url: "https://list.mogujie.com/search?cKey=h5-cube&fcid=10062603&page=1&_version=1&pid=&q=&cpc_offset=0&_=1501144810553&callback=?",
						type: "get",
						success: function success(data) {
							$("#mainList").html("");
							var mainList = data.result.wall.docs;
							//	console.log(mainList);
							for (var p in mainList) {
								$("#mainList").append('<li iid= "' + mainList[p].iid + '">' + '<img src="' + mainList[p].img + '"/>' + '<ol>' + mainList[p].title + '</ol>' + '<p>' + '<a>' + mainList[p].price + '</a>' + '<a>' + mainList[p].cfav + '</a>' + '</p>' + '</li>');
							};
							var ni = $("#mainList li").on("tap", function () {
								//console.log(11111);
								$("#header").css("display", "none");
								var iid = $(this).attr("iid");
								localStorage.setItem("iid", iid);
								_Spxq2.default.loadContent();
								_Spxq2.default.loadFooter();
							});
						}

					});
					//点击切换
					$("#leftNav li").on("tap", function () {
						$(this).addClass("active").siblings().removeClass("active");
						var $data = $(this).attr("maitKey");
						//console.log($data);
						$.ajax({
							url: "http://mce.mogujie.com/jsonp/makeup/3?pid=" + $data + "&_=1500888633455&callback=?",
							type: "get",
							success: function success(data) {
								$("#mianUp").html("");
								var dataList = data.data.categoryNavigation.list;
								console.log(dataList);
								for (var p in dataList) {
									$("#mianUp").append('<li>' + '<img src="' + dataList[p].image + '"/>' + '<span>' + dataList[p].title + '</span>' + '</li>');
								}
							}

						});
						var $datas = $(this).attr("miniWallkey");
						$.ajax({
							url: "https://list.mogujie.com/search?cKey=h5-cube&fcid=" + $datas + "&page=1&_version=1&pid=&q=&cpc_offset=0&_=1501144810553&callback=?",
							type: "get",
							success: function success(data) {
								$("#mainList").html("");
								var mainList = data.result.wall.docs;
								//	console.log(mainList);
								for (var p in mainList) {
									$("#mainList").append('<li iid= "' + mainList[p].iid + '">' + '<img src="' + mainList[p].img + '"/>' + '<ol>' + mainList[p].title + '</ol>' + '<p>' + '<a>' + mainList[p].price + '</a>' + '<a>' + mainList[p].cfav + '</a>' + '</p>' + '</li>');
								};
								var ni = $("#mainList li").on("tap", function () {
									//console.log(11111);
									$("#header").css("display", "none");
									var iid = $(this).attr("iid");
									localStorage.setItem("iid", iid);
									_Spxq2.default.loadContent();
									_Spxq2.default.loadFooter();
								});
							}

						});
					});
				}

			});

			$("#ranking p").on("tap", function () {
				$(this).addClass("activeR").siblings().removeClass("activeR");
			});
		});
	}
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(23);

var _Home = __webpack_require__(3);

var _Home2 = _interopRequireDefault(_Home);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

var _User = __webpack_require__(4);

var _User2 = _interopRequireDefault(_User);

var _Myselef = __webpack_require__(6);

var _Myselef2 = _interopRequireDefault(_Myselef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/cart.html #cartHeader", function () {
			console.log("ok");
			$("#return").on("tap", function () {
				var index = sessionStorage.getItem("index");
				console.log(index);
				if (index == '0') {
					_Home2.default.loadHeader();
					_Home2.default.loadContent();
					_MyFooter2.default.loadFooterStyle(0);
				} else if (index == '1') {
					_User2.default.loadHeader();
					_User2.default.loadContent();
					_MyFooter2.default.loadFooterStyle(1);
				} else {
					_Myselef2.default.loadHeader();
					_Myselef2.default.loadContent();
					_MyFooter2.default.loadFooterStyle(3);
				}
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/cart.html #cartContent", function () {
			console.log("ok");
			var obj = localStorage.getItem('data');
			var str = JSON.parse(obj);
			console.log(str);

			for (var i = 0; i < str.length; i++) {
				$("#cartMain").append('<li>' + '<img src="' + str[i].src + '"/>' + '<p>' + str[i].title + '</p>' + '<ol>' + '<span>颜色：' + str[i].yanse + '</span>' + '<span>尺码：' + str[i].chima + '</span>' + '<span>数量：' + str[i].num + '</span>' + '</ol>' + '<h1>￥' + str[i].money + '</h1>' + '<button class="remove">删除</button>' + '</li>');
			};
			var sum = 0;
			for (var j = 0; j < str.length; j++) {
				var moneySum = str[j].money;
				sum += Number(moneySum);
				console.log(sum);
				$("#sumMoney").html("");
				$("#sumMoney").html('总价:￥' + sum);
			}
			$(".remove").on("tap", function () {
				var inx = $(this).parent().index();
				console.log(inx);

				console.log(str[inx].money);
				var sum1 = sum - Number(str[inx].money);
				console.log(sum1);
				$("#sumMoney").html("");
				$("#sumMoney").html('总价:￥' + sum1);
				str.splice(inx, 1);
				console.log(str);
				var str1 = JSON.stringify(str);
				console.log(str1);
				localStorage.setItem('data', str1);
				$("#cartMain li").eq(inx).remove();
			});
		});
	}
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(25);

var _Login = __webpack_require__(9);

var _Login2 = _interopRequireDefault(_Login);

var _Register = __webpack_require__(11);

var _Register2 = _interopRequireDefault(_Register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/myselef.html #myselefHeader", function () {
			console.log("ok");
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/myselef.html #myselefContent", function () {
			console.log("ok");
			$(".btn1").on("tap", function () {
				console.log(1111111);
				$("#footer").css("display", "none");
				_Login2.default.loadHeader();
				_Login2.default.loadContent();
			});
			$(".btn2").on("tap", function () {
				$("#footer").css("display", "none");
				console.log(1111111);
				_Register2.default.loadHeader();
				_Register2.default.loadContent();
			});
		});
	}
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(19);

var _Home = __webpack_require__(3);

var _Home2 = _interopRequireDefault(_Home);

var _User = __webpack_require__(4);

var _User2 = _interopRequireDefault(_User);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/search.html #searchHeader-page", function () {
			var $idx = $("#footer").find("li").attr("class");
			console.log($idx);
			$(".return").on("tap", function () {
				if ($idx == "") {
					$("#footer").css("display", "block");
					_User2.default.loadHeader();
					_User2.default.loadContent();
				} else {
					$("#footer").css("display", "block");
					_MyFooter2.default.loadFooterStyle(0);
					_Home2.default.loadHeader();
					_Home2.default.loadContent();
				}
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/search.html #searchContent", function () {});
	}
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(10);

var _Register = __webpack_require__(11);

var _Register2 = _interopRequireDefault(_Register);

var _Myselef = __webpack_require__(6);

var _Myselef2 = _interopRequireDefault(_Myselef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/login.html #loginHeader", function () {
			$("#return").on("tap", function () {
				$("#footer").css("display", "block");
				_Myselef2.default.loadHeader();
				_Myselef2.default.loadContent();
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/login.html #loginContent", function () {
			$("#registerIng").on("tap", function () {
				$("#footer").css("display", "none");
				_Register2.default.loadHeader();
				_Register2.default.loadContent();
			});

			$(".loginDl").on("tap", function () {
				var username = $("#loginContent .ipt1").val();
				var password = $("#loginContent .ipt2").val();
				if (username == "" || password == "") {
					alert("填写不完整");
				} else {

					var obj = localStorage.getItem('array');
					var str1 = JSON.parse(obj);
					var arrs = [];
					var arra = [];
					var b = 0;
					var c = 0;
					for (var n = 0; n < str1.length; n++) {
						var ar = str1[n].username;
						arrs.push(ar);
						console.log(arrs);
						for (var v = 0; v < arrs.length; v++) {
							if (username == arrs[v]) {
								b = 2;
								break;
							} else {
								b = 3;
							}
						};
					};

					if (b == '2') {
						for (var i = 0; i < str1.length; i++) {
							var arr = str1[i].username + ':' + str1[i].password;

							arra.push(arr);
						};
						for (var j = 0; j < arra.length; j++) {
							console.log(arra[j]);
							if (username + ':' + password == arra[j]) {
								alert("登录成功");
								c = 0;
								break;
							} else {
								c = 1;
							}
						};
						if (c == '1') {
							alert("密码错误");
							c = 0;
						}
					} else if (b == '3') {
						alert("用户名不存在");
						b = 0;
					}
				}
			});
		});
	}
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./loginOrRegister.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./loginOrRegister.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(10);

var _Myselef = __webpack_require__(6);

var _Myselef2 = _interopRequireDefault(_Myselef);

var _Login = __webpack_require__(9);

var _Login2 = _interopRequireDefault(_Login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$("#header").load("viwes/register.html #registerHeader", function () {
			$("#return").on("tap", function () {
				$("#footer").css("display", "block");
				_Myselef2.default.loadHeader();
				_Myselef2.default.loadContent();
			});
			$("#cartNews").on("tap", function () {

				_Login2.default.loadHeader();
				_Login2.default.loadContent();
			});
		});
	},
	loadContent: function loadContent() {
		$("#content").load("viwes/register.html #registerContent", function () {

			$(".registerZc").on("tap", function () {
				var username = $("#registerContent .ipt1").val();
				var password = $("#registerContent .ipt2").val();
				var password1 = $("#registerContent .ipt3").val();

				if (username == "" || password == "" || password1 == "") {
					alert("请填写完整");
				} else if (password != password1) {
					alert("两次输入密码不一致");
				} else {
					var arrays = [];
					var obj = localStorage.getItem('array');
					var str1 = JSON.parse(obj);
					var a = 3;
					console.log(str1);
					var arra = [];
					if (str1 == null) {
						arrays.push({ 'username': username, 'password': password });
						var str = JSON.stringify(arrays);
						localStorage.setItem('array', str);
						console.log(str);
						a = 3;
						alert("注册成功");
					} else {
						for (var i = 0; i < str1.length; i++) {
							var arr = str1[i].username;
							arra.push(arr);
						};
						for (var i = 0; i < arra.length; i++) {
							console.log(arra);
							if (username == arra[i]) {
								//alert("5")
								a = 0;
								break;
								console.log(arr, username);
							} else {
								a = 1;
							}
						};

						if (a == '0') {
							a = 3;
							alert("用户名重复");
						} else if (a == '1') {
							str1.push({ 'username': username, 'password': password });
							var str = JSON.stringify(str1);
							localStorage.setItem('array', str);
							console.log(str);
							a = 3;
							alert("注册成功");
						}
					}
				}
			});
		});
	}
};
//var i =	localStorage.getItem('array',str);
//			var str1 = JSON.parse(i); 
//				console.log(str1)

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(28);

var _Home = __webpack_require__(3);

var _Home2 = _interopRequireDefault(_Home);

var _User = __webpack_require__(4);

var _User2 = _interopRequireDefault(_User);

var _Cart = __webpack_require__(5);

var _Cart2 = _interopRequireDefault(_Cart);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadContent: function loadContent() {
		$("#content").load("viwes/spxq.html #spxqContent", function () {
			console.log("ok");

			var id = localStorage.getItem('iid');
			$.ajax({
				url: "http://m.mogujie.com/jsonp/detail.api/v1?iid=" + id + "&template=1-2-detail_normal-1.0.0&callback=?&_=1501287362005",
				type: "get",
				dataType: "jsonp",
				success: function success(data) {
					var data = data.data;
					//console.log(data);				
					//轮播图
					for (var i in data.topImages) {
						$("#spxqWrapper").append('<div class="swiper-slide" id="imgDiv">' + '<img src="' + data.topImages[i] + '"/>' + '</div>');
					}
					var mySwiper = new Swiper("#spxqBanner", {
						pagination: ".swiper-pagination"
					});
					//标题
					$("#spxqTittle").append('<p>' + data.itemInfo.title + '</p>');
					$("#spxqTittle").append('<span>￥' + data.itemInfo.highNowPrice + '<i>￥' + data.itemInfo.highPrice + '</i></span>');
					$("#spxqTittle").append('<b>' + data.itemServices.columns[1].desc + '</b>');
					$("#spxqTittle").append('<ol class="spxqol"></ol>');
					var services = data.itemServices.services;

					for (var j in services) {
						//console.log(services[j].name)
						$(".spxqol").append('<strong>' + services[j].name + '</strong>');
					};
					var mainImg = data.detailInfo.detailImage[0].list;
					for (var n in mainImg) {
						//console.log(services[j].name)
						$("#mainImg").append('<img src="' + mainImg[n] + '"/>');
					};
				}
			});

			//data.itemServices.columns[j].desc

		});
	},
	loadFooter: function loadFooter() {
		$("#footer").load("viwes/spxq.html #spxqFooter", function () {
			//console.log("ok");
			$("#spxqKf").on("tap", function () {

				var index = sessionStorage.getItem("index");
				console.log(index);
				if (index == '0') {
					$("#header").css("display", "block");
					_Home2.default.loadHeader();
					_Home2.default.loadContent();
					_MyFooter2.default.loadFooter();
					_MyFooter2.default.loadFooterStyle(0);
				} else {
					$("#header").css("display", "block");
					_User2.default.loadHeader();
					_User2.default.loadContent();
					_MyFooter2.default.loadFooter();
					_MyFooter2.default.loadFooterStyle(1);
				}
			});
			$("#spxqCart").on("tap", function () {
				//console.log(3333);
				$("#footer").css("display", "none");
				$("#addCart").html("");
				$("#addCart").css("display", "block");
				//====================
				var id = localStorage.getItem('iid');
				$.ajax({
					url: "http://m.mogujie.com/jsonp/detail.api/v1?iid=" + id + "&template=1-2-detail_normal-1.0.0&callback=?&_=1501287362005",
					type: "get",
					dataType: "jsonp",
					success: function success(data) {
						var data = data.data;
						//console.log(data);				

						$("#addCart").append('<div id="cartDiv">' + '<img src="' + data.topImages[0] + '"/>' + '</div>');

						$("#addCart").append('<span>￥' + data.itemInfo.highNowPrice + '</span>');
						$("#addCart").append('<p>请选择:' + data.skuInfo.styleKey + ' ' + data.skuInfo.sizeKey + '</p>');

						$("#addCart").append('<ol id="yanse"><a>' + data.skuInfo.styleKey + '：</a></ol>');
						var props = data.skuInfo.props[0].list;
						for (var j in props) {
							//console.log(services[j].name)
							$("#yanse").append('<strong>' + props[j].name + '</strong>');
						};

						$("#addCart").append('<ol id="chima"><a>' + data.skuInfo.sizeKey + '：</a></ol>');
						var props = data.skuInfo.props[1].list;
						for (var v in props) {
							//console.log(services[j].name)
							$("#chima").append('<strong>' + props[v].name + '</strong>');
						};
						$("#addCart").append('<ol id="number"><a>数量：</a></ol>');

						//console.log(services[j].name)
						$("#number").append('<ul><li class="romove">-</li><li class="numShop">1</li><li class="add">+</li></ul>');
						$("#addCart").append('<button id="btnCart">确定</button>');
						$("#addCart").append('<h1 id="guanbi">x</h1>');

						$("#yanse strong").on("tap", function () {
							$(this).addClass("active").siblings().removeClass("active");
						});
						$("#chima strong").on("tap", function () {
							$(this).addClass("active").siblings().removeClass("active");
						});
						$("#guanbi").on("tap", function () {
							$("#addCart").css("display", "none");
							$("#footer").css("display", "block");
						});

						$(".romove").on("tap", function () {
							var num = $(".numShop").html();
							if (num == 1) {
								num = 1;
							} else {
								num--;
							}
							$(".numShop").html(num);
						});
						$(".add").on("tap", function () {
							var num = $(".numShop").html();

							num++;

							$(".numShop").html(num);
						});
						//点击确定添加到购物车
						$("#btnCart").on("tap", function () {

							var active1 = $("#yanse strong").attr("class");
							var active2 = $("#chima strong").attr("class");
							console.log(active1);
							if (active1 == undefined) {
								alert("请选择颜色");
							} else if (active2 == undefined) {
								alert("请选择尺码");
							} else {
								//alert("可以选择");
								var obj = localStorage.getItem('data');
								var str = JSON.parse(obj);
								console.log(str);
								var yanse = $("#yanse .active").html();
								var chima = $("#chima .active").html();
								var num = $(".numShop").html();
								var money = data.itemInfo.highNowPrice;
								var title = data.itemInfo.title;
								var src = data.topImages[0];
								console.log(num, yanse, chima, money, title, src);
								var array = [];
								if (str == null) {
									array.push({ 'yanse': yanse, 'chima': chima, 'num': num, 'money': money, 'title': title, 'src': src });
									var str1 = JSON.stringify(array);
									localStorage.setItem('data', str1);
									console.log(str1);
								} else {
									str.push({ 'yanse': yanse, 'chima': chima, 'num': num, 'money': money, 'title': title, 'src': src });
									var str1 = JSON.stringify(str);
									localStorage.setItem('data', str1);
									console.log(str1);
								}

								//							if(str == null){
								//								
								//								
								//								
								//							}
							}
						});
					}
				});
			});
			$("#spxqXd").on("tap", function () {
				$("#footer").css("display", "none");
				$("#header").css("display", "block");
				_Cart2.default.loadHeader();
				_Cart2.default.loadContent();
			});
		});
	}
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(7);

var _MyFooter = __webpack_require__(2);

var _MyFooter2 = _interopRequireDefault(_MyFooter);

var _Home = __webpack_require__(3);

var _Home2 = _interopRequireDefault(_Home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//默认头部
_Home2.default.loadHeader();
//默认内容
_Home2.default.loadContent();
//默认底部
_MyFooter2.default.loadFooter();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./home.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./home.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#homeBanner {\n  width: 100%;\n  height: 150px; }\n  #homeBanner .swiper-wrapper {\n    width: 100%;\n    height: 130px; }\n    #homeBanner .swiper-wrapper img:nth-child(1) {\n      width: 100%;\n      display: block;\n      margin: 0 auto; }\n  #homeBanner img {\n    width: 100%;\n    height: 150px; }\n\n#nav {\n  width: 100%;\n  height: 100px;\n  display: -webkit-box;\n  display: flex; }\n  #nav #navShop {\n    width: 28%;\n    height: 100%;\n    padding: 10px;\n    text-align: center; }\n    #nav #navShop span {\n      font: 12px/15px '';\n      color: #ff6801;\n      display: block;\n      width: 100%;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis; }\n    #nav #navShop i {\n      display: block;\n      width: 100%;\n      font: 12px/20px '';\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis; }\n    #nav #navShop img {\n      margin-top: 10px;\n      width: 30px; }\n  #nav p {\n    width: 1px;\n    height: 80px;\n    margin-top: 3%;\n    border-right: 1px solid #eee; }\n  #nav p:last-child {\n    display: none; }\n\n#timeOut {\n  width: 100%;\n  height: 30px;\n  border-top: 10px solid #f6f6f6;\n  border-bottom: 10px solid #f6f6f6; }\n  #timeOut p {\n    font: 14px/30px '';\n    margin-left: 10px;\n    float: left;\n    margin-right: 10px; }\n  #timeOut .time {\n    display: inline-block;\n    float: left; }\n    #timeOut .time span {\n      font: 14px/30px ''; }\n\n#span {\n  margin-left: 10px;\n  font: 14px/30px ''; }\n\n#listBox {\n  width: 100%;\n  height: 260px; }\n  #listBox li:first-child {\n    float: left;\n    width: 49%;\n    height: 150px;\n    border: 1px solid #e5e5e5;\n    text-align: center; }\n    #listBox li:first-child strong {\n      margin-top: 15px;\n      display: block;\n      font-size: 10px; }\n    #listBox li:first-child i {\n      display: block;\n      font: 10px/15px '';\n      color: #ffa092; }\n    #listBox li:first-child img {\n      width: 82px;\n      height: auto; }\n  #listBox li:nth-child(2) {\n    float: left;\n    width: 49%;\n    height: 75px;\n    border: 1px solid #e5e5e5;\n    position: relative; }\n    #listBox li:nth-child(2) strong {\n      margin-left: 10px;\n      display: block;\n      margin-top: 15px;\n      font-size: 10px; }\n    #listBox li:nth-child(2) i {\n      margin-left: 10px;\n      float: left;\n      font: 10px/15px '';\n      color: #ffa092; }\n    #listBox li:nth-child(2) img {\n      width: 68px;\n      height: 68px;\n      float: right;\n      position: absolute;\n      top: 0;\n      right: 0; }\n  #listBox li:nth-child(3) {\n    float: left;\n    width: 49%;\n    height: 73px;\n    border: 1px solid #e5e5e5;\n    position: relative; }\n    #listBox li:nth-child(3) strong {\n      margin-left: 10px;\n      display: block;\n      margin-top: 15px;\n      font-size: 10px; }\n    #listBox li:nth-child(3) i {\n      margin-left: 10px;\n      float: left;\n      font: 10px/15px '';\n      color: #ffa092; }\n    #listBox li:nth-child(3) img {\n      width: 68px;\n      height: 68px;\n      float: right;\n      position: absolute;\n      top: 0;\n      right: 0; }\n  #listBox li:nth-child(n+4) {\n    float: left;\n    width: 32.5%;\n    height: 105px;\n    border: 1px solid #e5e5e5;\n    text-align: center; }\n    #listBox li:nth-child(n+4) strong {\n      display: block;\n      margin-top: 10px;\n      font-size: 10px; }\n    #listBox li:nth-child(n+4) i {\n      display: block;\n      font: 10px/15px '';\n      color: #ffa092; }\n    #listBox li:nth-child(n+4) img {\n      width: 60px;\n      height: 60px;\n      top: 0;\n      right: 0; }\n\n#tittleNav {\n  border-top: 10px solid #f6f6f6;\n  width: 100%;\n  height: 40px;\n  text-align: center;\n  font: 15px/40px '';\n  background: url(" + __webpack_require__(18) + ") no-repeat -10px;\n  background-position-x: 5px; }\n\n#listUser {\n  width: 100%;\n  height: 320px;\n  display: -webkit-box;\n  display: flex;\n  flex-wrap: wrap; }\n  #listUser li {\n    width: 25%;\n    height: 80px;\n    text-align: center; }\n    #listUser li img {\n      width: 52px;\n      height: 52px; }\n    #listUser li p {\n      font: 12px/15px ''; }\n\n#bottomNav {\n  width: 100%;\n  height: auto;\n  display: -webkit-box;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around; }\n  #bottomNav li {\n    width: 47%;\n    min-height: 240px;\n    margin-bottom: 5px; }\n    #bottomNav li img {\n      width: 100%;\n      height: 180px; }\n    #bottomNav li ol {\n      width: 90%;\n      min-height: 20px;\n      margin: 0 auto; }\n      #bottomNav li ol span {\n        display: inline-block;\n        background: #eff3f6;\n        color: #5a6f7a;\n        font: 12px/15px '';\n        margin-right: 5px; }\n    #bottomNav li p {\n      width: 90%;\n      height: 30px;\n      font: 12px/30px '';\n      margin: 0 auto; }\n      #bottomNav li p a:first-child {\n        font-weight: 600; }\n      #bottomNav li p a:last-child {\n        float: right; }\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATkAAAAKAgMAAACyFsHVAAAADFBMVEVMaXEzMzMzMzP///8xqFqyAAAAAnRSTlMAtlSR24EAAAABYktHRAMRDEzyAAAAQElEQVQoz2NgoDkQIVZhAHHKMok0jnEJccpWORBnHttK4pStmkCceVJYLV6FCkg1TwtVewPt/Uvt+KB6eqEIAACpih6NjokEAgAAAABJRU5ErkJggg=="

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./search.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./search.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#searchHeader-page {\n  width: 100%;\n  height: 40px;\n  border-bottom: 1px solid #e9e9e9;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  flex-direction: row; }\n  #searchHeader-page .return {\n    width: 50px;\n    height: 30px;\n    text-align: center;\n    font: 20px/40px ''; }\n  #searchHeader-page .searchBtn {\n    -webkit-box-flex: 1;\n    flex: 1;\n    margin-top: 10px;\n    height: 20px;\n    border-radius: 3px;\n    outline: none;\n    border: 1px solid #ff4466;\n    font: 10px/15px '';\n    text-indent: 10px; }\n  #searchHeader-page .search-zi {\n    width: 50px;\n    height: 30px;\n    text-align: center;\n    font: 12px/40px ''; }\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./user.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./user.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\nbady {\n  padding-bottom: 50px; }\n\n.header-header {\n  position: fixed;\n  background: #fff;\n  border-bottom: 1px solid #eeeeee; }\n\n#userContent {\n  width: 100%;\n  height: 500px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  flex-direction: row; }\n\n::-webkit-scrollbar {\n  display: none; }\n\n#leftNav {\n  width: 25%;\n  height: 500px;\n  position: fixed;\n  overflow: auto; }\n  #leftNav li:last-child {\n    margin-bottom: 20px; }\n  #leftNav li {\n    width: 100%;\n    height: 25px;\n    background: #f6f6f6;\n    padding-top: 10px; }\n    #leftNav li p {\n      height: 13px;\n      width: 80%;\n      font: 12px/13px '';\n      border-left: 5px solid #f6f6f6;\n      text-align: center; }\n  #leftNav .active {\n    background: #fff; }\n    #leftNav .active p {\n      border-left: 5px solid #ff5577;\n      color: #ff5577; }\n\n#main {\n  width: 72%;\n  height: auto;\n  margin-left: 27%;\n  padding-bottom: 50px; }\n  #main #mianUp {\n    width: 100%;\n    height: auto;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    flex-wrap: wrap; }\n    #main #mianUp li {\n      width: 33%;\n      height: 80px;\n      margin: 10px 0;\n      text-align: center; }\n      #main #mianUp li img {\n        width: 70%;\n        height: 55px; }\n      #main #mianUp li span {\n        width: 100%;\n        height: 20px;\n        overflow: hidden;\n        margin: 0 auto;\n        display: block;\n        font: 12px/20px ''; }\n  #main #ranking {\n    width: 100%;\n    height: 30px;\n    border-bottom: 1px solid #e5e5e5;\n    border-top: 1px solid #e5e5e5;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    padding-top: 10px;\n    margin-bottom: 5px; }\n    #main #ranking p {\n      width: 33%;\n      height: 17px;\n      font: 14px/14px '';\n      border-left: 1px solid #e5e5e5;\n      text-align: center; }\n    #main #ranking .activeR {\n      color: #ef4562; }\n  #main #mainList {\n    width: 100%;\n    height: auto;\n    display: -webkit-box;\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: space-around; }\n    #main #mainList li {\n      width: 47%;\n      height: 250px;\n      margin-bottom: 5px; }\n      #main #mainList li img {\n        width: 100%;\n        height: 150px; }\n      #main #mainList li ol {\n        width: 90%;\n        height: 20px;\n        font: 14px/20px '';\n        margin: 0 auto;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis; }\n      #main #mainList li p {\n        width: 90%;\n        height: 20px;\n        font: 12px/20px '';\n        margin: 0 auto; }\n        #main #mainList li p a:first-child {\n          font-weight: 600;\n          color: #ef4562; }\n        #main #mainList li p a:last-child {\n          float: right; }\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./cart.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./cart.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#cartHeader {\n  width: 100%;\n  height: 40px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  flex-direction: row;\n  text-align: center;\n  color: #727272;\n  border-bottom: 1px solid #e6e6e6; }\n  #cartHeader .iconfont {\n    width: 60px;\n    height: 40px;\n    line-height: 40px; }\n  #cartHeader #cartNews {\n    margin-right: 10px; }\n  #cartHeader #cartTittle {\n    -webkit-box-flex: 1;\n    flex: 1;\n    line-height: 40px; }\n\n#cartContent {\n  width: 100%;\n  height: auto; }\n  #cartContent #cartMain {\n    width: 90%;\n    height: auto;\n    margin: 10px auto; }\n    #cartContent #cartMain li {\n      width: 100%;\n      height: 150px;\n      margin-bottom: 10px;\n      margin-top: 20px;\n      border-top: 1px solid #999;\n      border-bottom: 1px solid #999;\n      position: relative; }\n      #cartContent #cartMain li img {\n        margin-top: 10px;\n        margin-right: 10px;\n        width: 20%;\n        height: 100px;\n        float: left; }\n      #cartContent #cartMain li p {\n        margin-top: 10px;\n        float: left;\n        width: 70%;\n        font: 15px/20px ''; }\n      #cartContent #cartMain li ol {\n        width: 70%;\n        float: right; }\n        #cartContent #cartMain li ol span {\n          font: 12px/15px '';\n          margin-right: 10px; }\n      #cartContent #cartMain li h1 {\n        font: 20px/30px ''; }\n      #cartContent #cartMain li button {\n        width: 80px;\n        height: 30px;\n        position: absolute;\n        bottom: 10px;\n        right: 10px; }\n  #cartContent h2 {\n    min-width: 120px;\n    float: right;\n    margin-right: 20px; }\n  #cartContent #sum {\n    float: right;\n    margin-right: 20px; }\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./myselef.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./myselef.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#myselefHeader {\n  width: 100%;\n  height: 40px;\n  background: #ff4466;\n  text-align: center;\n  font: 15px/40px ''; }\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#loginHeader, #registerHeader {\n  width: 100%;\n  height: 40px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  flex-direction: row;\n  border-bottom: 1px solid #e6e6e6;\n  text-align: center;\n  background: #fafafa; }\n  #loginHeader .iconfont, #registerHeader .iconfont {\n    width: 60px;\n    height: 40px;\n    line-height: 40px; }\n  #loginHeader #cartNews, #registerHeader #cartNews {\n    margin-right: 10px;\n    font-size: 13px; }\n  #loginHeader #cartTittle, #registerHeader #cartTittle {\n    -webkit-box-flex: 1;\n    flex: 1;\n    line-height: 40px; }\n\n#loginContent, #registerContent {\n  width: 100%; }\n  #loginContent input, #registerContent input {\n    width: 90%;\n    height: 40px;\n    box-sizing: border-box;\n    margin: 10px 5%;\n    text-indent: 10px; }\n  #loginContent .loginDl, #loginContent .registerZc, #registerContent .loginDl, #registerContent .registerZc {\n    width: 90%;\n    height: 40px;\n    margin: 10px 5%;\n    background: #ff4466;\n    border: none;\n    color: #fff; }\n  #loginContent a, #registerContent a {\n    display: block;\n    font: 12px/20px '';\n    text-align: right;\n    margin-right: 20px;\n    color: #ff4466; }\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./spxq.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./spxq.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 361443 */\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot\");\n  src: url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_pecuzhys50orbe29.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nbody {\n  padding-bottom: 50px; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #header {\n    width: 100%;\n    height: 45px; }\n    #container #header .searchHeader {\n      width: 100%;\n      height: 45px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row; }\n      #container #header .searchHeader #information {\n        width: 40px;\n        height: 45px;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container #header .searchHeader #search {\n        height: 25px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        background: #eeeeee;\n        margin-top: 3%;\n        font: 10px/25px ''; }\n        #container #header .searchHeader #search i {\n          margin: 0 10px; }\n      #container #header .searchHeader #cart {\n        width: 40px;\n        height: 100%;\n        font-size: 20px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container #footer {\n    height: 45px;\n    width: 100%;\n    border-top: 1px solid #ededed;\n    position: fixed;\n    bottom: 0;\n    background: #fff; }\n    #container #footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container #footer ul li {\n        font-size: 15px;\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container #footer ul li.active {\n          color: #f66; }\n\n#spxqContent {\n  width: 100%;\n  height: auto;\n  position: relative; }\n  #spxqContent #spxqBanner {\n    width: 100%;\n    height: 450px; }\n    #spxqContent #spxqBanner #spxqWrapper {\n      width: 100%;\n      height: 100%; }\n      #spxqContent #spxqBanner #spxqWrapper img {\n        width: 100%;\n        height: 100%; }\n\n#spxqFooter {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  flex-direction: row; }\n  #spxqFooter div {\n    width: 14%;\n    height: 100%;\n    text-align: center;\n    font: 13px/46px '';\n    border-left: 1px solid #ededed; }\n  #spxqFooter div:nth-child(n+4) {\n    width: 30%; }\n  #spxqFooter div:nth-child(4) {\n    background: #ffe6e8;\n    color: #ff4e85; }\n  #spxqFooter div:nth-child(5) {\n    background: #ff4e85;\n    color: #fff; }\n\n#spxqTittle {\n  width: 90%;\n  margin: 10px auto; }\n  #spxqTittle p {\n    width: 100%;\n    height: 30px;\n    font: 14px/18px ''; }\n  #spxqTittle span {\n    font: 25px/50px ''; }\n    #spxqTittle span i {\n      margin-left: 20px;\n      font: 12px/0 '';\n      text-decoration: line-through;\n      color: #999999; }\n  #spxqTittle b {\n    display: block;\n    height: 30px;\n    font-size: 13px;\n    color: #999999; }\n  #spxqTittle ol {\n    width: 100%;\n    height: 30px;\n    overflow: hidden;\n    border-top: 1px solid #ededed;\n    border-bottom: 1px solid #ededed; }\n    #spxqTittle ol strong {\n      font: 12px/30px '';\n      margin-left: 8px; }\n\n#mainImg {\n  width: 100%;\n  height: auto; }\n  #mainImg img {\n    width: 100%; }\n\n#addCart {\n  position: fixed;\n  width: 100%;\n  height: 350px;\n  background: #fff;\n  bottom: 0;\n  z-index: 999;\n  display: none; }\n  #addCart #cartDiv {\n    position: absolute;\n    width: 100px;\n    height: 180px;\n    top: -90px;\n    left: 30px; }\n    #addCart #cartDiv img {\n      width: 100px;\n      height: 180px; }\n  #addCart span {\n    margin-left: 150px;\n    font: 20px/40px ''; }\n  #addCart p {\n    margin-left: 150px;\n    font: 13px/20px ''; }\n  #addCart #yanse {\n    width: 90%;\n    height: 50px;\n    margin-left: 5%;\n    margin-top: 40px; }\n    #addCart #yanse a {\n      display: block;\n      margin-bottom: 5px; }\n    #addCart #yanse strong {\n      display: inline-block;\n      min-width: 60px;\n      height: 20px;\n      text-align: center;\n      font: 13px/20px '';\n      margin-left: 5px;\n      float: left;\n      border: 1px solid #000;\n      border-radius: 2px; }\n    #addCart #yanse .active {\n      border: 1px solid #f27a91;\n      color: #f27a91; }\n  #addCart #chima {\n    width: 90%;\n    height: 50px;\n    margin-left: 5%;\n    margin-top: 10px; }\n    #addCart #chima a {\n      display: block;\n      margin-bottom: 5px; }\n    #addCart #chima strong {\n      min-width: 40px;\n      height: 20px;\n      text-align: center;\n      font: 13px/20px '';\n      margin-left: 5px;\n      display: inline-block;\n      border-radius: 2px;\n      border: 1px solid #000; }\n    #addCart #chima .active {\n      border: 1px solid #f27a91;\n      color: #f27a91; }\n  #addCart #number {\n    width: 90%;\n    height: 50px;\n    margin-left: 5%;\n    margin-top: 20px; }\n    #addCart #number a {\n      display: block;\n      margin-bottom: 5px; }\n    #addCart #number ul {\n      width: 90px;\n      height: 30px;\n      border: 1px solid #8c8c8c; }\n      #addCart #number ul li {\n        touch-action: none;\n        text-align: center;\n        font: 13px/30px '';\n        box-sizing: border-box;\n        width: 30px;\n        height: 30px;\n        float: left; }\n      #addCart #number ul li:nth-child(2) {\n        border-right: 1px solid #8c8c8c;\n        border-left: 1px solid #8c8c8c; }\n  #addCart #btnCart {\n    width: 100%;\n    height: 40px;\n    text-align: center;\n    font: 18px/30px '';\n    border: none;\n    background: #ff488c;\n    color: #fff;\n    position: absolute;\n    bottom: 0;\n    left: 0; }\n  #addCart #guanbi {\n    text-align: center;\n    font: 15px/30px '';\n    width: 30px;\n    height: 30px;\n    position: absolute;\n    top: 0;\n    right: 0; }\n", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map