<p align='center'>
<img src="./variantwind.svg">
<img src="https://raw.githubusercontent.com/sibbngheid/variantwind/master/carbon.svg">
</p>
<h1 align='center'>
<samp>variantwind</samp>
</h1>
<p align='center'>
<strong>Most elegant</strong> way to work with <strong>TailwindCSS</strong> variants in Vue
</p>

<p align='center'>
Use as <em>directive</em> or <em>binding</em>, supports both Vue 2 & 3, also supports <strong>PurgeCSS</strong>🔥🔥<br><br>
911 Bytes Gzipped
</p>

## Installation

```sh
yarn add variantwind
```

## Usage

### Directive

```js
import { createApp } from "vue";
import App from "./App.vue";
import { directive } from "variantwind";

const app = createApp(App);

app.directive("variantwind", directive);

// You can register it multiple times!
app.directive("dark", directive);

/**
 *  Or register as a Plugin
 *  Second argument is optional directive name
 *
 *  import Variantwind from "variantwind";
 *  app.use(Variantwind, "variantwind" );
 *
 *  // To register multiple directives pass array:
 *  app.use(Variantwind, ["variantwind", dark]);
 * */

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
    :class="variantwind('w-full bg-red-500 md:{w-1/3 bg-blue-500} lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}')"
  >
    Class binding
  </div>

  <div
    v-variantwind="'w-full bg-red-500 md:{w-1/3 bg-blue-500} lg:{w-1/4 bg-yellow-500 hover:bg-yellow-900}'"
    v-dark="'dark:{bg-black-900 text-white}'"
  >
    Multiple directives
  </div>

  <div
    class="w-full bg-red-500 md:{w-1/3 bg-blue-500}"
    :class="variantwind('lg:{w-1/4 bg-green-500 hover:bg-green-900}')"
    v-variantwind="'xl:{w-1/4 bg-yellow-500 hover:bg-yellow-900}'"
    v-dark="'dark:{bg-black-900 text-white}'"
  >
    You can use all of them together.
  </div>
</template>

<script>
  import { variantwind } from "variantwind";

  export default {
    // Pass function to template for class binding usage
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
