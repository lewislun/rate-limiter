declare const _default: {};
export default _default;
/**
 * <T>
 */
export type RateLimitedJob = {
    name: string;
    func: () => T;
    callback: (T: any) => void;
    errCallback: (err: Error) => void;
    retryCount: number;
};
export type RateLimiterOpts = {
    callPerSec?: number;
    instanceKey?: string;
    retryCount?: number;
    onErrPauseTimeMs?: number;
    log?: (msg: any) => void;
};
