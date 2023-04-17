import typescript from '@rollup/plugin-typescript'

export default {
	input: 'src/index.js',
	output: {
		name: 'rate-limiter',
		file: 'dist/index.js',
		format: 'umd',
		sourcemap: true,
		minifyInternalExports: true,
	},
	plugins: [
		typescript({ include: 'src/**/*' }),
	],
}