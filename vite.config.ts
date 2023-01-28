import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import AutoImport from 'unplugin-auto-import/vite'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import EnvironmentPlugin from 'vite-plugin-environment'

import {
	ENV_OBJECT_DEFAULT,
	promiseENVWriteFileSync,
} from './config/env/env.mjs'
import { generateDTS } from './config/types/dts-generator.mjs'

const resolve = resolveTsconfigPathsToAlias()

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
	await promiseENVWriteFileSync.then(function () {
		generateDTS({
			input: ENV_OBJECT_DEFAULT as any,
			outputDir: './config/types' as any,
			filename: 'ImportMeta.d.ts' as any,
		})
	})

	const ViteConfigWithMode = await getViteConfigWithMode(mode)
	const config = (await ViteConfigWithMode?.default?.()) ?? {}
	const aliasExternal = ViteConfigWithMode?.aliasExternal ?? {}

	return {
		publicDir: 'src/assets/static',
		plugins: [
			vue({
				template: {
					// NOTE - Tell vue template does not apply assets url handler for <img src="..." />, use publicDir instead
					transformAssetUrls: {
						img: [],
					},
				},
			}),
			EnvironmentPlugin(ENV_OBJECT_DEFAULT as any, {
				defineOn: 'import.meta.env',
			}),
			nodeResolve({
				modulePaths: resolve.modules,
			}),
			AutoImport({
				// targets to transform
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/,
					/\.vue\?vue/, // .vue
					/\.md$/, // .md
				],
				imports: [
					// presets
					'vue',
				],
				dts: './config/auto-imports.d.ts',
				eslintrc: {
					enabled: true,
					filepath: './config/.eslintrc-auto-import.json',
				},
			}),
			...(mode === 'development'
				? [
						alias({
							entries: aliasExternal.entries ?? {},
						}),
				  ]
				: []),
			...(config?.plugins ?? []),
		],
		css: {
			postcss: {
				plugins: [autoprefixer, tailwind('./tailwind.config.cjs')],
			},
			preprocessorOptions: {
				scss: {
					additionalData: `
            @import "assets/styles/main.scss";
            `,
				},
			},
		},
		resolve: {
			alias: {
				...resolve.alias,
				...aliasExternal.entries,
			},
		},
		optimizeDeps: {
			...(mode === 'production'
				? {
						exclude: Object.keys(aliasExternal.entries || {}),
				  }
				: {}),
		},
		build: {
			assetsDir: '',
			rollupOptions: {
				output: {
					chunkFileNames() {
						return '[name].[hash].js'
					},
				},
			},
		},
	}
})

const getViteConfigWithMode = (mode) => {
	if (!mode) return

	return mode === 'development'
		? import('./config/vite.development.config')
		: import('./config/vite.production.config')
} // getViteConfigFilePathWithMode(mode?: 'development' | 'production')

function resolveTsconfigPathsToAlias(tsconfigPath = './tsconfig.json') {
	// const tsconfig = require(tsconfigPath)
	// const { paths, baseUrl } = tsconfig.compilerOptions
	// NOTE - Get json content without comment line (ignore error JSON parse some string have unexpected symbol)
	// https://stackoverflow.com/questions/40685262/read-json-file-ignoring-custom-comments
	const tsconfig = JSON.parse(
		fs
			.readFileSync(path.resolve('.', tsconfigPath))
			?.toString()
			.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
				g ? '' : m
			)
	)

	const { paths, baseUrl } = tsconfig.compilerOptions

	const modules = [path.resolve(__dirname, baseUrl)]

	const alias = Object.fromEntries(
		Object.entries(paths)
			.filter(([, pathValues]) => (pathValues as Array<string>).length > 0)
			.map(([pathKey, pathValues]) => {
				const key = pathKey.replace('/*', '')
				const value = path.resolve(
					__dirname,
					baseUrl,
					(pathValues as Array<string>)[0].replace(/[\/|\*]+(?:$)/g, '')
				)
				modules.push(value)
				return [key, value]
			})
	)

	return {
		alias: {
			src: path.resolve(__dirname, baseUrl),
			...alias,
		},
		modules,
	}
} // resolveTsconfigPathsToAlias()
