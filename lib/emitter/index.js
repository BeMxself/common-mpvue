var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this._events = {};
    }
    EventEmitter.prototype.emit = function (name) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this._events[name]) {
            return false;
        }
        var handler = this._events[name];
        if (!handler) {
            return false;
        }
        if (typeof handler === 'function') {
            handler.call.apply(handler, __spreadArrays([this], args));
            return true;
        }
        else if (Array.isArray(handler)) {
            for (var i = 0, l = handler.length; i < l; i++) {
                (_a = handler[i]).call.apply(_a, __spreadArrays([this], args));
            }
            return true;
        }
        return false;
    };
    EventEmitter.prototype.on = function (name, listener) {
        if (typeof listener !== 'function') {
            throw new Error('监听必须是方法');
        }
        if (!this._events[name]) {
            this._events[name] = listener;
        }
        else if (Array.isArray(this._events[name])) {
            this._events[name].push(listener);
        }
        else {
            this._events[name] = [this._events[name], listener];
        }
        return this;
    };
    EventEmitter.prototype.once = function (name, listener) {
        var self = this;
        self.on(name, function l() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            self.off(name, l);
            listener.apply(self, args);
        });
    };
    EventEmitter.prototype.off = function (name, listener) {
        if (typeof listener !== 'function') {
            throw new Error('监听必须是方法');
        }
        if (!this._events || !this._events[name]) {
            return this;
        }
        var list = this._events[name];
        if (Array.isArray(list)) {
            var index = list.indexOf(listener);
            if (index > -1) {
                list.splice(index, 1);
                if (list.length === 0) {
                    this._events[name] = undefined;
                }
            }
        }
        else if (this._events[name] === listener) {
            this._events[name] = undefined;
        }
        return this;
    };
    EventEmitter.prototype.offAll = function (name) {
        if (name && this._events && this._events[name]) {
            this._events[name] = null;
        }
        return this;
    };
    return EventEmitter;
}());
export default EventEmitter;
