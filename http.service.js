"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
// 除了GET与POST之外，XMLHttpRequest规范也允许第一个参数为DELETE，HEAD,OPTIONS,PUT
var HttpService = (function () {
    function HttpService() {
        this.TIMEOUT = 10000;
    }
    HttpService.prototype.getXhr = function () {
        return new XMLHttpRequest();
    };
    HttpService.prototype.get = function (url, opt) {
        /**变量声明 */
        var data$$;
        var xhr = this.getXhr();
        /**数据源 */
        var data$ = rxjs_1.Observable.create(function (observer) {
            data$$ = observer;
        }).share();
        this.sub = data$.subscribe();
        /**异步事件设置 */
        this.decorateXHR(xhr, data$$);
        /**整合查询串 */
        url += "?" + this.turnObjToQuery(opt);
        /**开启xhr */
        xhr.open('GEt', "" + url, true);
        xhr.send();
        console.info("sending http-GET: " + url);
        return data$;
    };
    HttpService.prototype.post = function (url, queryOpt) {
        /**变量声明 */
        var postBody;
        var data$$;
        var xhr = this.getXhr();
        /**数据源 */
        var data$ = rxjs_1.Observable.create(function (observer) {
            data$$ = observer;
        }).share();
        this.sub = data$.subscribe();
        /**异步事件设置 */
        this.decorateXHR(xhr, data$$);
        /**开启xhr */
        xhr.open('POST', "" + url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        if (queryOpt) {
            xhr.send(JSON.stringify(queryOpt));
        }
        else {
            xhr.send();
        }
        console.info("sending http-POST: " + url);
        return data$;
    };
    HttpService.prototype.decorateXHR = function (xhr, data$$) {
        var _this = this;
        /**异步错误获取 */
        xhr.onerror = function (err) {
            data$$.error(err);
            _this.closeConnection(xhr, data$$);
        };
        /**超时设置 */
        xhr.timeout = this.TIMEOUT;
        xhr.ontimeout = function ($event) {
            data$$.error('http请求超时');
            _this.closeConnection(xhr, data$$);
        };
        /**异步状态判断 */
        xhr.onreadystatechange = function () {
            /**变量声明 */
            var readyState = xhr.readyState;
            var status = "" + xhr.status;
            /**准备就绪 */
            if (readyState === 4) {
                _this.sub.unsubscribe();
                /**成功：2**、3** */
                if (status.indexOf('2') === 0 || status.indexOf('3') === 0) {
                    var resObj = {};
                    try {
                        resObj = JSON.parse("" + xhr.responseText);
                        data$$.next(resObj);
                    }
                    catch (e) {
                        data$$.error(e);
                        data$$.complete();
                    }
                    /**客户端、服务端错误 */
                }
                else if (status.indexOf('4') === 0 || status.indexOf('0') === 0 || status.indexOf('5') === 0) {
                    data$$.error(status);
                    data$$.complete();
                }
                else {
                    data$$.error(status);
                    data$$.complete();
                }
            }
        };
    };
    HttpService.prototype.closeConnection = function (xhr, data$$) {
        xhr.abort();
        data$$.complete();
        this.sub.unsubscribe();
    };
    HttpService.prototype.setGetUrlWithQuery = function (url, query) {
        url += '?';
        Object.keys(query).map(function (key) {
            url += key + "=" + query[key] + "&";
        });
        return url.substring(0, url.length - 1);
    };
    HttpService.prototype.turnObjToQuery = function (query) {
        if (!query)
            return '';
        var body = '';
        Object.keys(query).map(function (key) {
            body += key + "=" + query[key] + "&";
        });
        return body;
    };
    return HttpService;
}());
exports.default = new HttpService();
var a = new HttpService();
