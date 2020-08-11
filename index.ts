import type { App, ObjectDirective } from "vue";
import type { DirectiveOptions, VueConstructor } from "vue2";

const matchBlocks = (val: string) => val.match(/\w*:\{(.*?)\}/g);

export const variantwind = (className: string) => {
  let plainClasses = className.replace(/\r?\n|\r/g, "");

  // Array of blocks, e.g. ["lg:{bg-red-500 hover:bg-red-900}"]
  const blocks = matchBlocks(className);

  if (!blocks) {
    return plainClasses;
  }

  const processedClasses = blocks
    .map((block) => {
      plainClasses = plainClasses.replace(block, "").trim();
      const [variant, classes] = block.split(/:(.+)/);

      const withVariants = classes
        .replace(/\{|\}/g, "")
        .replace(/\s/g, " " + variant + ":");

      return withVariants.startsWith(variant)
        ? withVariants
        : variant + ":" + withVariants;
    })
    .join(" ");

  return plainClasses + " " + processedClasses;
};

const cache = new Map();
const process = (el: HTMLElement, binding: any) => {
  const cachedClasses = cache.get(el.className);
  const cachedBindClasses = cache.get(binding.value);
  const cachedBindOldClasses = cache.get(binding.oldValue);

  if (cachedClasses) {
    el.className = cachedClasses;
  } else {
    const classes = variantwind(el.className);
    cache.set(el.className, classes);
    el.className = classes;
  }

  if (binding.value !== binding.oldValue) {
    if (cachedBindOldClasses) {
      el.classList.remove(...cachedBindOldClasses);
    } else {
      const bindOldClasses = variantwind(binding.oldValue || "")
        .split(" ")
        .filter((i: string) => !!i);
      cache.set(binding.oldValue, bindOldClasses);
      el.classList.remove(...bindOldClasses);
    }
  }

  if (cachedBindClasses) {
    el.classList.add(...cachedBindClasses);
  } else {
    const bindClasses = variantwind(binding.value || "")
      .split(" ")
      .filter((i: string) => !!i);
    console.log(bindClasses);
    cache.set(binding.value, bindClasses);
    el.classList.add(...bindClasses);
  }
};

export const directive: ObjectDirective = {
  beforeMount: process,
  updated: process,
};

export const directive2: DirectiveOptions = {
  bind: process,
  update: process,
};

export const extractor = (content: string) => {
  const match = variantwind(content);
  const extract = match !== content ? match.split(" ") : [];

  // Capture as liberally as possible, including things like `h-(screen-1.5)`
  const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

  // Capture classes within other delimiters like .block(class="w-1/2") in Pug
  const innerMatches =
    content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || [];

  return broadMatches.concat(innerMatches, extract);
};

const isVue3 = (app: App | VueConstructor): app is App =>
  app.version[0] === "3";

export default (
  app: App | VueConstructor,
  directives: string | string[] = "variantwind"
) => {
  if (isVue3(app)) {
    if (Array.isArray(directives)) {
      directives.map((name) => {
        app.directive(name, directive);
        app.config.globalProperties["$" + name] = variantwind;
      });
    } else {
      app.directive(directives, directive);
      app.config.globalProperties["$" + directives] = variantwind;
    }
  } else {
    if (Array.isArray(directives)) {
      directives.map((name) => {
        app.directive(name, directive2);
        app.prototype["$" + name] = variantwind;
      });
    } else {
      app.directive(directives, directive2);
      app.prototype["$" + directives] = variantwind;
    }
  }
};
