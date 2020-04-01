// 继承，圣杯模式
var inherit = (function (target, orign) {
    var F = function () { };
    return function () {
        F.prototype = orign.prototype;
        target.prototype = new F();
        target.prototype.constructor = target;
        target.prototype.uber = orign.prototype;
    };
})();

//type方法
function type(target) {
    var objStr = {
        "[object Object]": "object-Object",
        "[object Array]": "array-Object",
        "[object Number]": "number-Object",
        "[object Boolean]": "boolean-Object",
        "[object String]": "string-Object"
    };
    var ret = typeof target;
    //分两类 原始值 引用值
    if (target === null) {
        return "null";
    } else if (ret == "object") {
        var toStr = Object.prototype.toString.call(target);
        return objStr[toStr];
    } else {
        return ret;
    }
}

//数组去重
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        var prop = this[i];
        if (!temp[prop]) {
            temp[prop] = "unique";
            arr.push(prop);
        }
    }
    return arr;
};

//深度克隆
function deepClone(origin, traget) {
    var traget = traget || {};
    var toStr = Object.prototype.toString;
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== "null" && typeof origin[prop] == "object") {
                traget[prop] = toStr.call(origin[prop]) == "[object Array]" ? [] : {};
                deepClone(origin[prop], traget[prop]);
            } else {
                traget[prop] = origin[prop];
            }
        }
    }
}

//一个字符串【a-z]组成，请找出该字符串第一个只出现一次的字母
String.prototype.onlyFirst = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = "onlyFirst";
            arr.push({ key: this[i], value: 1 });
        } else {
            var arrlen = arr.length,
                key = this[i];
            for (var j = 0; j < arrlen; j++) {
                if (arr[j]["key"] === key) {
                    arr[j]["value"]++;
                }
            }
        }
    }
    var ret = arr.sort(function (a, b) {
        return a.value - b.value;
    });
    return ret.shift()["key"];
};
//字符串去重
String.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = "unique";
            arr.push(this[i]);
        }
    }
    return arr.join("");
};

//DOM
/**
 * 返回element元素的第n级父级节点
 * @param {element} elem
 * @param {*} n
 */
function retParent(elem, n) {
    while (elem && n) {
        elem = elem.parentElement;
        n--;
    }
    return elem;
}

//返回节点的子节点的元素节点
Element.prototype.myChildren = function () {
    var child = this.childNodes;
    var len = child.length;
    var arr = [];

    for (var i = 0; i < len; i++) {
        if (child[i].nodeType == 1) {
            arr.push(child[i]);
        }
    }
    return arr;
};
//返回元素e的第n个兄弟元素节点，n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0返回自己
/**
 *
 * @param {元素} e
 * @param {*} n
 */
function retSibling(e, n) {
    while (e && n > 0) {
        if (e.nextElementSibling) {
            e = e.nextElementSibling;
        } else {
            for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling);
        }
        n--;
    }
    while (e && n < 0) {
        if (e.previousElementSibling) {
            e = e.previousElementSibling;
        } else {
            for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling);
        }
        n++;
    }
    return e || null;
}

/**
 * inserAfter
 * a节点插入b节点之后
 */
Element.prototype.inserAfter = function (a, b) {
    var nextElement = b.nextElementSibling;
    if (nextElement) {
        this.insertBefore(a, nextElement);
    } else {
        this.appendChild(a);
    }
};

//将容器内的DOM结构逆序
Element.prototype.revers = function () {
    var childs = this.children;
    var len = childs.length - 2;
    for (var i = len; i >= 0; i--) {
        this.appendChild(childs[i]);
    }
};

//BOM
/**
 * 获取滚动条滚动的位置
 */
function getScrollOffset() {
    var x = 0,
        y = 0;
    if (window.pageXOffset && window.pageYOffset) {
        x = window.pageXOffset;
        y = window.pageYOffset;
    } else {
        x = document.body.scrollLeft || document.documentElement.scrollLeft;
        y = document.body.scrollTop || document.documentElement.scrollTop;
    }
    return {
        x: x,
        y: y
    };
}

/**
 * 获取可视区窗口尺寸
 */

function getViewportOffset() {
    var w = 0,
        h = 0;
    if (window.innerWidth && window.innerHeight) {
        w = window.innerWidth;
        h = window.innerHeight;
    } else {
        //   ie8以下，BackCompat为怪异模式
        if (document.compatMode === "BackCompat") {
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        } else {
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        }
    }
    return {
        w: w,
        h: h
    };
}

/**
 * 求任意元素距离文档的位置
 * @param {元素} ele 
 */
function getElementPosition(ele) {
    var x = 0, y = 0;
    x = ele.offsetLeft;
    y = ele.offsetTop;

    while (ele.offsetParent) {
        ele = ele.offsetParent;
        x += ele.offsetLeft;
        y += ele.offsetTop;
    }
    return {
        pageX: x,
        pageY: y
    }
}

/**
 * 获取元素的属性样式，兼容IE
 * @param {元素} ele 
 * @param {属性名} prop 
 */
function getStyle(ele, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[prop]
    } else {
        return ele.currentStyle[prop]
    }
}

/**
 * 兼容IE的事件绑定方法
 * @param {元素} ele 
 * @param {事件类型} type 
 * @param {事件处理函数} fn 
 */
function addEvent(ele, type, handle) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handle, false)
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, function () {
            handle.call(ele)
        });
    } else {
        ele['on' + type] = handle
    }
}

/**
 * 兼容IE的阻止事件冒泡方法
 * @param {事件元} event 
 */
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation()
    } else {
        event.cancelBubble = true;
    }
}
/**
 * 兼容IE的阻止默认事件
 * @param {*} event 
 */
function cancelHandler(event) {
    if (event.preventDefault) {
        event.preventDefault()
    } else {
        event.returnValue = false
    }
}
