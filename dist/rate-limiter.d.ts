export default class RateLimiter {
    /** @type {Map<string, RateLimiter>} */ static instanceMap: Map<string, RateLimiter>;
    /**
     * Get an initialized RateLimiter by opts.instanceKey. If it does not exist, create one. This is useful for sharing RateLimiter if the same endpoint is used.
     *
     * @static
     * @public
     * @param {types.RateLimiterOpts} [opts={}]
     * @returns {RateLimiter}
     */
    public static getInstance(opts?: types.RateLimiterOpts): RateLimiter;
    /**
     * @param {types.RateLimiterOpts} [opts]
     */
    constructor(opts?: types.RateLimiterOpts);
    /** @type {string} */ instanceKey: string;
    /** @type {types.RateLimitedJob[]} */ queue: types.RateLimitedJob[];
    /** @type {number} */ callIntervalMs: number;
    /** @type {number} */ retryCount: number;
    /** @type {number} */ onErrPauseTimeMs: number;
    /** @type {number} */ timeoutMs: number;
    /** @type {(msg) => void} */ log: (msg: any) => void;
    /** @protected @type {NodeJS.Timeout} */ protected nextIteration: NodeJS.Timeout;
    /** @protected @type {boolean} */ protected isStopping: boolean;
    /**
     * @returns {boolean}
     */
    get isLoopRunning(): boolean;
    /**
     * @public
     */
    public start(): void;
    /**
     * @protected
     */
    protected loop(): void;
    /**
     * Stop the jobLoop. No-op if the loop is not running.
     *
     * @public
     */
    public stop(): void;
    /**
     * @public
     * @param {number} pauseTimeMs
     */
    public pause(pauseTimeMs: number): void;
    /**
     * @protected
     * @param {RateLimitedJob} job
     */
    protected processJob(job: RateLimitedJob): Promise<void>;
    /**
     * Accepts both sync and async functions.
     *
     * @public
     * @template T
     * @param {() => Promise<T>} func
     * @param {string} name
     * @returns {Promise<T>}
     */
    public exec<T>(func: () => Promise<T>, name?: string): Promise<T>;
}
import * as types from './types.js';
