module.exports = {
	root: true,
	ignorePatterns: ['vite.config.ts', 'env/**/*', 'config/**/*'],
	env: {
		browser: true,
		es6: true,
		// jest: true,
		node: true,
	},
	extends: [
		'.eslintrc-auto-import.json',
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/eslint-config-prettier',
		'@vue/eslint-config-typescript',
		'plugin:prettier/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:import/errors',
		'plugin:import/warnings',
		'prettier',
	],
	plugins: ['@typescript-eslint'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			tsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './vite.config.ts'],
	},
	rules: {
		'linebreak-style': 'off',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'@typescript-eslint/naming-convention': 'off',
		'no-unused-vars': 'warn',
		// NOTE - This options settup for stop linting alias
		// "import/no-unresolved": [0, { }]
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-custom-alias': {
				alias: {
					'': './src',
				},
				extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
			},
		},
	},
}
