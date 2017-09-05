"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = require("rxjs/ReplaySubject");
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
            var subject = new ReplaySubject_1.ReplaySubject(1);
            _this.decorateXHR(xhr, subject);
            _this.sendXHR(xhr, 'GET', url, query, {}, headers);
            return subject;
        };
        this.post = function (url, body, headers, query) {
            if (body === void 0) { body = {}; }
            if (headers === void 0) { headers = {}; }
            if (query === void 0) { query = {}; }
            var xhr = new XMLHttpRequest();
            var subject = new ReplaySubject_1.ReplaySubject(1);
            _this.decorateXHR(xhr, subject);
            _this.sendXHR(xhr, 'POST', url, query, body, headers);
            return subject;
        };
        this.delete = function (url, query, headers) {
            if (query === void 0) { query = {}; }
            if (headers === void 0) { headers = {}; }
            var xhr = new XMLHttpRequest();
            var subject = new ReplaySubject_1.ReplaySubject(1);
            _this.decorateXHR(xhr, subject);
            _this.sendXHR(xhr, 'DELETE', url, query, {}, headers);
            return subject;
        };
        this.put = function (url, body, headers, query) {
            if (body === void 0) { body = {}; }
            if (headers === void 0) { headers = {}; }
            if (query === void 0) { query = {}; }
            var xhr = new XMLHttpRequest();
            var subject = new ReplaySubject_1.ReplaySubject(1);
            _this.decorateXHR(xhr, subject);
            _this.sendXHR(xhr, 'PUT', url, query, body, headers);
            return subject;
        };
    }
    //  发送xhr
    Http.prototype.sendXHR = function (xhr, type, url, query, body, headers) {
        url += "?" + this.toQueryString(query);
        switch (type) {
            case "DELETE": {
                xhr.open('DELETE', url, true);
                this.setHeaders(xhr, headers);
                xhr.send();
                break;
            }
            case "GET": {
                xhr.open('GET', url, true);
                this.setHeaders(xhr, headers);
                xhr.send();
                break;
            }
            case "POST": {
                xhr.open('POST', url, true);
                this.setHeaders(xhr, headers);
                xhr.send(JSON.stringify(body));
                break;
            }
            case "PUT": {
                xhr.open('PUT', url, true);
                this.setHeaders(xhr, headers);
                xhr.send(JSON.stringify(body));
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
            var readyState = xhr.readyState, status = xhr.status, statusText = xhr.statusText, responseText = xhr.responseText;
            if (readyState === 4) {
                // 成功
                if (String(status).indexOf('2') === 0 || String(status).indexOf('3')) {
                    try {
                        subject.next(responseText);
                        subject.complete();
                    }
                    catch (e) {
                        _this.errorCloseConnection(xhr, subject, JSON.stringify(e));
                    }
                    // 失败
                }
                else {
                    _this.errorCloseConnection(xhr, subject, JSON.stringify({ statusText: statusText, status: status, responseText: responseText }));
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
exports.default = new Http();
