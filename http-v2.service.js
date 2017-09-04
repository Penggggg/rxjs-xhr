"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Http = (function () {
    function Http() {
        var _this = this;
        this.options = {
            TIMEOUT: 10000
        };
        this.get = function (url, query, headers) {
            if (query === void 0) { query = {}; }
            if (headers === void 0) { headers = {}; }
            var xhr = new XMLHttpRequest();
            var subject = new BehaviorSubject_1.BehaviorSubject(null);
            _this.decorateXHR(xhr, subject);
            _this.sendXHR(xhr, 'GET', url, query, {}, headers);
            return subject;
        };
    }
    //  发送xhr
    Http.prototype.sendXHR = function (xhr, type, url, query, body, headers) {
        // 设置头部信息
        this.setHeaders(xhr, headers);
        switch (type) {
            case "GET": {
                url += "?" + this.toQueryString(query);
                xhr.open('GET', url, true);
                xhr.send();
                break;
            }
            default: break;
        }
    };
    // xhr set headers 
    Http.prototype.setHeaders = function (xhr, headers) {
        if (headers === void 0) { headers = {}; }
        var keys = Object.keys(headers);
        if (keys.length === 0) {
            return;
        }
        keys.map(function (k) { return xhr.setRequestHeader(k, headers[k]); });
    };
    // 对象转查询字符串
    Http.prototype.toQueryString = function (query) {
        if (query === void 0) { query = {}; }
        var keys = Object.keys(query);
        if (keys.length === 0) {
            return '';
        }
        return keys.map(function (k) { return k + "=" + query[k] + "&"; }).join('');
    };
    // 监听xhr异步事件
    Http.prototype.decorateXHR = function (xhr, subject) {
        var _this = this;
        // error 错误事件
        xhr.onerror = function (err) { return _this.errorCloseConnection(xhr, subject, JSON.stringify(err)); };
        // timeout事件
        xhr.timeout = this.options.TIMEOUT;
        xhr.ontimeout = function (err) { return _this.errorCloseConnection(xhr, subject, JSON.stringify(err)); };
        // readyStateChange事件
        xhr.onreadystatechange = function () {
            var readyState = xhr.readyState, status = xhr.status, statusText = xhr.statusText;
            if (readyState === 4) {
                // 成功
                if (String(status).indexOf('2') === 0 || String(status).indexOf('3')) {
                    try {
                        subject.next(xhr.responseText);
                        subject.complete();
                    }
                    catch (e) {
                        _this.errorCloseConnection(xhr, subject, JSON.stringify(e));
                    }
                    // 失败
                }
                else {
                    _this.errorCloseConnection(xhr, subject, statusText);
                }
            }
        };
    };
    // 发生错误 - xhr关闭连接
    Http.prototype.errorCloseConnection = function (xhr, subject, err) {
        xhr.abort();
        subject.error(err);
        subject.complete();
    };
    // 请求成功 - xhr关闭连接
    Http.prototype.successCloseConnection = function (xhr, subject, err) {
        xhr.abort();
        subject.complete();
    };
    return Http;
}());
var http = new Http();
var a = http.get('/haha');
a
    .do(console.log)
    .subscribe();
