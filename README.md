## Table of Contents

1. [Install](#install)
2. [Introduction](#introduction)

<h2 align="center">Install</h2>

##### Expect Node 18.x or higher

Clone source with SSH url:

```bash
git clone git@github.com:anhchangvt1994/vite-project--template-react-ts.git
```

Install:

```bash
cd vite-project--template-react-ts
```

If use npm

```bash
npm install
```

If use yarn 1.x

```bash
yarn install
```

<h2 align="center">Introduction</h2>

This project is an advanced structure and configuration of scaffolded Vite + Vue 3.x + Typescript project.

### Table of structure's benefit information that you must use

- [env](#env) - emvironment directory
- [src](#src) - include assets and coding of project
- [tailwind.config.cjs](#tailwincss)
- [vite.config.ts](#vite.config.ts) - unplugin-auto-import config
- [vite.production.config.ts](#vite.production.config.ts) - NormalSplitChunks config

<h3>env</h3>

```bash
├── env/
│   ├── env.[prefix].mjs
│   ├── env-register.mjs
│   └──
└──
```

**env** directory contains environment variable files used to manage environment variable by using .mjs file. You will define environment variables in .mjs file instead of .env file.

##### Why use it ?

1. I think defining environment variables in javascript file will similar with JS developer and better for managing than .env file.

Compare them

```javascript
// env.router.mjs
export default {
	prefix: 'router',
	data: {
		home: {
			path: '/',
			id: 'HomePage',
		},
	},
}
```

```.env
# .env
ROUTER_HOME_PATH=/
ROUTER_HOME_ID=HomePage
```

2. Think that you can define any type (not only string like .env) when define env in javascript file.

Imagine that you need to define a payment code validation array

```javascript
// env.router.mjs
export default {
	prefix: 'payment',
	data: {
		valid_code: [0, 1, 2, 3],
	},
}
```

```.env
# .env
PAYMENT_VALID_CODE=[0,1,2,3] #wrong
PAYMENT_VALID_CODE="[0,1,2,3]" #right (you must stringify it)
```

3. The hot benefit of this advanced structure bring out for Environment Variables is the **ImportMeta.d.ts** generating automation. With this ability, the code editor will auto suggestion available env for you.

You have a large env difination and have to open file, cop and paste variable key when want to use it. Forget it !!!

##### How to use it ?

Imagine that you need create a new env for an api title (prefix) to store all of api endpoint string

1. Create an **env.api.mjs** file and finish that

```javascript
// env.api.mjs
export default {
	prefix: 'api',
	data: {
		user: {
			info: '/api/user/info',
			edit: '/api/user/edit',
		},
		product_list: '/api/product',
	},
}
```

2. Open **env-register.mjs** and regist it

```javascript
// env-register.mjs
import ENV_API from './env.api.mjs'

export default [ENV_API]
```

Tada! Done! you're so cool

<h3>src</h3>

```bash
├── src/
│   ├── App.ts
│   ├── App.vue
│   ├── assets/...
│   ├── pages/...
│   ├── components/...
│   ├── config/...
│   └── utils/...
└──
```

The **src directory** contains the resource's assets and logic of your codes like:

| file / directory | Description                                                                                                                                     |
| :--------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|    **App.ts**    | contains initialization code of vue                                                                                                             |
|   **App.vue**    | contains default layout code of vue                                                                                                             |
|   **assets/**    | contains asset files <br/>**style**: assets > style > main.scss <br/>**images**: assets > static > images > logo.svg                            |
|    **pages/**    | contains files of pages layout (ex: HomePage.vue)                                                                                               |
| **components/**  | contains files of component <br/> **global**: components > [GlobalComponentName].vue <br/> **page**: components > HomePage > ProductSection.vue |
|   **config/**    | contains files of libs or plugins configuration <br/> **vue-router**: config > router > index.ts <br/> **pinia**: config > store > index.ts     |
|    **utils/**    | contains files of your customization like <br/> **Composition API, Libs, Plugins**                                                              |

##### Tip:

1. If your code editor has TSServer, the **paths** options of **tsconfig.json** will provide a list of alias for your code editor. That will make you happy with auto alias suggestion when you're typing.

![alt text](/src/assets/static/images/development/auto-alias-suggestion.png 'Title')

```javascript
// Normal way you must
import './assets/styles/...'

// tsconfig with paths options
import 'assets/styles/...'
```

In this case, that looks like the same, except **" ./ "**. But when you move **index.ts** to another location (ex: move it into **pages/**), the path with **" ./ "** will wrong and the path with alias still right.

2. You will see that the **images/** directory placed in **static/** directory. Because in this project the **static/** is set to [publicDir](https://vitejs.dev/config/shared-options.html#publicdir). That means all of directories and files in **static/** directory will just copied to **dist/** and does not compiled or hash name.

Normal case in Vue project, you can handle asset files with some solutions (NOTE: I will use jsx instead vue SFC file (.vue) in this README markdown)

```jsx
// 1. import and use it
import Logo from 'assets/images/logo.svg'

return <img src={Logo} />

// 2. require (but vite does not support require statement, you can do that in webpack project)
return <img src={require('assets/images/logo.svg')} />

// 3. vue support assets url handler
// refer: https://vue-loader.vuejs.org/guide/asset-url.html#transform-rules
return <img src="@/assets/images/logo.svg" />
```

In case use **publicDir**, you just easy set static files like a string

```html
<!-- Very similar and you finish! -->
<img src="/images/logo.svg" />
```

<h3>tailwind.config.cjs</h3>

All of your tailwind config for your project
[tailwind config docs](https://tailwindcss.com/docs/configuration)
