import { expect } from 'chai'
import { describe, it } from 'mocha'
import RateLimiter from '../src/index.js'

describe('Retry', function() {
	it('retries when function throws error', async function() {
		this.timeout(5000)
	
		const rateLimiter = new RateLimiter({ retryCount: 2 })
		let trialCount = 0
		const expectedTrialCount = 3
		const expectedTimeUsedMs = 1500
		const startTime = new Date()
		await rateLimiter.exec(() => {
			if (++trialCount < expectedTrialCount) {
				throw new Error('testing')
			}
		})
		const timeUsedMs = new Date().getTime() - startTime.getTime()

		expect(trialCount).equal(expectedTrialCount)
		expect(timeUsedMs).to.be.approximately(expectedTimeUsedMs, 100)
	})

	it('retries when async function throws error', async function() {
		this.timeout(5000)

		const rateLimiter = new RateLimiter({ retryCount: 2 })
		let trialCount = 0
		const expectedTrialCount = 3
		const expectedTimeUsedMs = 1500
		const startTime = new Date()
		await rateLimiter.exec(async () => {
			if (++trialCount < expectedTrialCount) {
				throw new Error('testing')
			}
		})
		const timeUsedMs = new Date().getTime() - startTime.getTime()

		expect(trialCount).equal(expectedTrialCount)
		expect(timeUsedMs).to.be.approximately(expectedTimeUsedMs, 100)
	})

	it('timeout')
})