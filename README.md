<p align='center'>
<img src="./variantwind.svg">
<img src="https://raw.githubusercontent.com/sibbngheid/variantwind/master/carbon.svg">
</p>
<h1 align='center'>
<center><samp>variantwind</samp></center>
</h1>

<p align='center'>
<a href="https://www.npmjs.com/package/variantwind" target="__blank"><img src="https://badgen.net/npm/v/variantwind"></a>
<a href="https://www.npmjs.com/package/variantwind" target="__blank"><img src="https://badgen.net/npm/dt/variantwind"></a>
<a href="https://github.com/sibbngheid/variantwind" target="__blank"><img src="https://badgen.net/bundlephobia/minzip/variantwind"></a>
</p>

<p align='center'>
<strong>Most elegant</strong> way to work with <strong>TailwindCSS</strong> variants in Vue
</p>

<p align='center'>
Use as <em>directive</em> or <em>binding</em>, supports both Vue 2 & 3, also supports <strong>PurgeCSS</strong>🔥🔥<br><br>
</p>

## Installation

```sh
yarn add variantwind # or `npm i variantwind`
```

### CDN
```html
<script src"https://unpkg.com/variantwind"></script>
```

## Usage

```js
import { createApp } from "vue";
import App from "./App.vue";
import Variantwind from "variantwind";

const app = createApp(App);

/**
 * Directives:  v-variantwind
 * Methods:     $variantwind
 */
app.use(Variantwind, "variantwind");

/* ===== OR =====*/

/**
 * Directives:  v-variantwind v-dark
 * Methods:     $variantwind $dark
 *
 * Note: This plugin doesn't provide dark mode functionality. This is just a use case example.
 */
app.use(Variantwind, ["variantwind", "dark"]);

app.mount("#app");
```

```html
<template>
  <div
    class="w-full bg-red-500 md:{w-1/3 bg-blue-500} lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}"
    v-variantwind
  >
    Middleware
  </div>

  <div
    v-variantwind="'w-full bg-red-500 md:{w-1/3 bg-blue-500} lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}'"
  >
    Directive binding
  </div>

  <div
    v-variantwind="'w-full bg-red-500 md:{w-1/3 bg-blue-500} lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}'"
    v-dark="'dark:{bg-black-900 text-white}'"
  >
    Multiple directives
  </div>

  <div
    :class="variantwind('lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}')"
    :class="$variantwind('lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}')"
  >
    Local and Global Class binding
  </div>

  <div
    class="w-full bg-red-500 md:{w-1/3 bg-blue-500}"
    :class="$variantwind('lg:{w-1/4 bg-green-500 hover:bg-green-900}')"
    v-variantwind="'xl:{w-1/4 bg-yellow-500 hover:bg-yellow-900}'"
    v-dark="'dark:{bg-black-900 text-white}'"
  >
    You can use all of them together.
  </div>
</template>

<script>
  import { variantwind } from "variantwind";

  export default {
    // Pass function to template for local class binding usage
    methods: { variantwind },
  };
</script>
```

## TailwindCSS Purge

```js
// tailwind.config.js
const { extractor } = require("variantwind");

module.exports = {
  purge: {
    content: ["./index.html", "./src/**/*.vue", "./src/**/*.js"],
    options: {
      extractors: [
        {
          extractor,
          extensions: ["vue"],
        },
      ],
    },
  },
};
```

### License

[MIT License](https://github.com/sibbngheid/variantwind/blob/master/LICENSE) © 2020 [Sibbngheid](https://github.com/sibbngheid)
