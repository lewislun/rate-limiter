import typescript from '@rollup/plugin-typescript'

export default {
	input: 'src/index.js',
	output: {
		name: 'rateLimiter',
		file: 'dist/index.js',
		format: 'es',
		sourcemap: true,
		minifyInternalExports: true,
	},
	plugins: [
		typescript({ include: 'src/**/*' }),
	],
}