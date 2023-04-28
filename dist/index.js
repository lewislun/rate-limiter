/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var RateLimiter = /** @class */ (function () {
    /**
     * @param {types.RateLimiterOpts} [opts]
     */
    function RateLimiter(opts) {
        if (opts === void 0) { opts = {}; }
        var _a, _b, _c;
        /** @type {types.RateLimitedJob[]} */ this.queue = [];
        /** @type {number} */ this.callIntervalMs = 200;
        /** @type {number} */ this.retryCount = 4;
        /** @type {number} */ this.onErrPauseTimeMs = 500;
        /** @type {number} */ this.timeoutMs = 10000;
        /** @protected @type {boolean} */ this.isStopping = false;
        this.instanceKey = opts.instanceKey;
        this.retryCount = (_a = opts.retryCount) !== null && _a !== void 0 ? _a : this.retryCount;
        this.onErrPauseTimeMs = (_b = opts.onErrPauseTimeMs) !== null && _b !== void 0 ? _b : this.onErrPauseTimeMs;
        this.log = (_c = opts.log) !== null && _c !== void 0 ? _c : (function () { });
        if (opts.callPerSec) {
            this.callIntervalMs = 1000 / opts.callPerSec;
        }
        this.start();
    }
    /**
     * Get an initialized RateLimiter by opts.instanceKey. If it does not exist, create one. This is useful for sharing RateLimiter if the same endpoint is used.
     *
     * @static
     * @public
     * @param {types.RateLimiterOpts} [opts={}]
     * @returns {RateLimiter}
     */
    RateLimiter.getInstance = function (opts) {
        if (opts === void 0) { opts = {}; }
        // create a new one if instanceKey is not set
        var instanceKey = opts === null || opts === void 0 ? void 0 : opts.instanceKey;
        if (!instanceKey) {
            return new RateLimiter(opts);
        }
        var instance = this.instanceMap.get(instanceKey);
        if (instance) {
            return instance;
        }
        var newInstance = new RateLimiter(opts);
        this.instanceMap.set(instanceKey, newInstance);
        return newInstance;
    };
    Object.defineProperty(RateLimiter.prototype, "isLoopRunning", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return !!this.nextIteration && !this.isStopping;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @public
     */
    RateLimiter.prototype.start = function () {
        var _this = this;
        if (!this.callIntervalMs) {
            throw new Error('Cannot start jobLoop with callIntervalMs === 0 or undefined.');
        }
        if (this.isLoopRunning) {
            this.log('jobLoop is already running.');
            return;
        }
        this.nextIteration = setTimeout(function () { return _this.loop(); }, 0);
    };
    /**
     * @protected
     */
    RateLimiter.prototype.loop = function () {
        var _this = this;
        if (this.isStopping) {
            this.isStopping = false;
            this.nextIteration = undefined;
            return;
        }
        if (this.queue.length === 0) {
            this.nextIteration = setTimeout(function () { return _this.loop(); }, 100);
            return;
        }
        this.processJob(this.queue.shift());
        this.nextIteration = setTimeout(function () { return _this.loop(); }, this.callIntervalMs);
    };
    /**
     * Stop the jobLoop. No-op if the loop is not running.
     *
     * @public
     */
    RateLimiter.prototype.stop = function () {
        if (this.isLoopRunning) {
            this.isStopping = true;
        }
    };
    /**
     * @public
     * @param {number} pauseTimeMs
     */
    RateLimiter.prototype.pause = function (pauseTimeMs) {
        var _this = this;
        this.stop();
        this.nextIteration = setTimeout(function () { return _this.start(); }, pauseTimeMs);
    };
    /**
     * @protected
     * @param {RateLimitedJob} job
     */
    RateLimiter.prototype.processJob = function (job) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1, retryCount, pauseTimeMs;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.race([
                                job.func(),
                                new Promise(function (_, reject) { return setTimeout(function () { return reject(new Error('RateLimitJob timed out.')); }, _this.timeoutMs); })
                            ])];
                    case 1:
                        result = _b.sent();
                        job.callback(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        if (job.retryCount >= this.retryCount) {
                            this.log("RateLimitJob execution failed with exception: ".concat(e_1, ", rejecting this job... (instanceKey: ").concat(this.instanceKey, ", retryCount: ").concat(job.retryCount, ")"));
                            job.errCallback(e_1);
                            return [2 /*return*/];
                        }
                        retryCount = (_a = job.retryCount) !== null && _a !== void 0 ? _a : 0;
                        pauseTimeMs = this.onErrPauseTimeMs * Math.pow(2, retryCount);
                        this.log("RateLimitJob execution failed with exception: ".concat(e_1, ", pushing it back to queue to retry... (instanceKey: ").concat(this.instanceKey, ", retryCount: ").concat(retryCount, ", pauseTimeMs: ").concat(pauseTimeMs, ", queueLength: ").concat(this.queue.length, ")"));
                        job.retryCount = retryCount + 1;
                        if (this.isLoopRunning) {
                            this.pause(pauseTimeMs);
                        }
                        this.queue.push(job);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Accepts both sync and async functions.
     *
     * @public
     * @template T
     * @param {() => Promise<T>} func
     * @param {string} name
     * @returns {Promise<T>}
     */
    RateLimiter.prototype.exec = function (func, name) {
        if (name === void 0) { name = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var callback_1, errCallback_1, promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.callIntervalMs) return [3 /*break*/, 2];
                        promise = new Promise(function (resolve, reject) {
                            callback_1 = resolve;
                            errCallback_1 = reject;
                        });
                        this.queue.push({ func: func, callback: callback_1, errCallback: errCallback_1, name: name });
                        return [4 /*yield*/, promise
                            // ignore queue if callIntervalMs is undefined or 0 (i.e. not rate limited)
                        ];
                    case 1: return [2 /*return*/, _a.sent()
                        // ignore queue if callIntervalMs is undefined or 0 (i.e. not rate limited)
                    ];
                    case 2: return [4 /*yield*/, func()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** @type {Map<string, RateLimiter>} */ RateLimiter.instanceMap = new Map();
    return RateLimiter;
}());

export { RateLimiter as default };
//# sourceMappingURL=index.js.map
