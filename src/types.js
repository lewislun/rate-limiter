/**
 * @typedef RateLimitedJob<T>
 * @property {string} name
 * @property {() => T} func
 * @property {(T) => void} callback
 * @property {(err: Error) => void} errCallback
 * @property {number} retryCount
 * 
 * @typedef RateLimiterOpts
 * @property {number} [callPerSec]
 * @property {string} [instanceKey]
 * @property {number} [retryCount]
 * @property {number} [onErrPauseTimeMs]
 * @property {(msg) => void} [log]
 */

export default {}