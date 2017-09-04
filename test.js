"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_v2_service_1 = require("./http-v2.service");
require("rxjs/add/operator/do");
require("rxjs/add/operator/filter");
http_v2_service_1.default
    .get('/haha', { sex: 'asdsd' }, { accToken: 'sdasd' })
    .filter(function (x) { return !!x; })
    .do(function (x) { return console.log('------GET-------'); })
    .do(console.log)
    .subscribe();
http_v2_service_1.default
    .post('/haha', { name: 'asdasd' }, { accToken: 'sdasd' }, { id: 123 })
    .filter(function (x) { return !!x; })
    .do(function (x) { return console.log('------POST-------'); })
    .do(console.log)
    .subscribe();
http_v2_service_1.default
    .delete('/haha', { name: 'asdasd' }, { accToken: 'sdasd' })
    .filter(function (x) { return !!x; })
    .do(function (x) { return console.log('------DELETE-------'); })
    .do(console.log)
    .subscribe();
http_v2_service_1.default
    .put('/haha', { name: 'asdasd' }, { accToken: 'sdasd' }, { id: 123 })
    .filter(function (x) { return !!x; })
    .do(function (x) { return console.log('------PUT-------'); })
    .do(console.log)
    .subscribe();
