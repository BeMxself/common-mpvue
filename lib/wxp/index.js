var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { httpRequest } from '../request';
import nav from '../nav';
var noPromiseMethods = [
    'stopRecord',
    'pauseVoice',
    'stopVoice',
    'pauseBackgroundAudio',
    'stopBackgroundAudio',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'createAnimation',
    'createContext',
    'hideKeyboard',
    'stopPullDownRefresh'
];
Promise.prototype.finally = function (finaliser) {
    return this.then(function (result) {
        finaliser();
        return result;
    }, function (reason) {
        finaliser();
        if (reason instanceof Error) {
            throw reason;
        }
        else if (typeof reason === 'string') {
            throw new Error(reason);
        }
        else if (reason && reason.errMsg) {
            throw new Error(reason.errMsg);
        }
        throw reason;
    });
};
var wxp = {};
var _loop_1 = function (key) {
    if (Object.prototype.hasOwnProperty.call(wx, key)) {
        var noPromise = noPromiseMethods.includes(key) ||
            key.startsWith('on') ||
            /\w+Sync$/.test(key) ||
            typeof wx[key] !== 'function';
        if (!noPromise) {
            wxp[key] = function (obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var params = obj || {};
                return new Promise(function (resolve, reject) {
                    params.success = resolve;
                    params.fail = reject;
                    wx[key].apply(wx, __spreadArrays([params], args));
                });
            };
        }
        else if (typeof wx[key] === 'function') {
            wxp[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return wx[key].apply(wx, args);
            };
        }
        else {
            wxp[key] = wx[key];
        }
    }
};
for (var key in wx) {
    _loop_1(key);
}
Object.defineProperties(wxp, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function () {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function () {
            return nav;
        }
    }
});
Object.defineProperties(wx, {
    httpRequest: {
        configurable: false,
        enumerable: true,
        get: function () {
            return httpRequest;
        }
    },
    nav: {
        configurable: false,
        enumerable: true,
        get: function () {
            return nav;
        }
    }
});
export default wxp;
