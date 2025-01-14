var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import Configurable from '../base/configurable';
import { getFormatTime } from '../utils';
import wxp from '../wxp';
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._cache = [];
        return _this;
    }
    Logger.prototype.push = function (msg) {
        this._cache.push(msg);
        this.report();
    };
    Logger.prototype.report = function () {
        var _this = this;
        if (!this.config('reportDomain')) {
            console.warn('Logger上报url未设置, 请使用app.logger.config("reportDomain", "地址")设置');
            return;
        }
        var cache = this._cache;
        this._cache = [];
        wxp
            .request({
            method: 'POST',
            url: this.config('reportDomain'),
            // 统一使用form post方便php等后端语言获取数据
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: "logs=" + encodeURIComponent(JSON.stringify(cache))
        })
            .catch(function () {
            // 上报失败，归还消息
            _this._cache = new Array(0).concat(_this._cache, cache);
        });
    };
    Logger.prototype._log = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var sysInfo = getApp().getSystemInfo();
        if (sysInfo.platform === 'devtools') {
            console.log.apply(console, __spreadArrays(["[" + getFormatTime() + " " + String.prototype.toUpperCase.call(type) + "]"], args));
        }
        else {
            if (args.length < 1) {
                return;
            }
            var msg = args
                .filter(function (arg) { return arg !== undefined; })
                .reduce(function (previous, current) {
                return previous.concat(typeof current === 'string' ? [current] : [JSON.stringify(current)]);
            }, [])
                .join(' ');
            if (msg.length > 2048) {
                console.warn("Log\u4FE1\u606F\u8FC7\u591A\uFF0C\u5F53\u524D\u957F\u5EA6" + msg.length + "\u5B57\u8282");
            }
            var app = getApp();
            this.push({
                project: app.pkgName || app.name,
                pageUrl: (app.pkgName || app.name) + ":" + (app.getPageRoute() || 'app'),
                category: 'jsError',
                timestamp: +new Date(),
                level: type,
                content: msg
            });
        }
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, __spreadArrays(['log'], args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, __spreadArrays(['error'], args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, __spreadArrays(['warn'], args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._log.apply(this, __spreadArrays(['info'], args));
    };
    return Logger;
}(Configurable));
export default Logger;
