import type { App, ObjectDirective } from "vue";
import type { DirectiveOptions, VueConstructor } from "vue2";

const matchBlocks = (val: string) => val.match(/\w*:\{(.*?)\}/g);

export const variantwind = (className: string) => {
  let plainClasses = className;

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
    el.classList.add(...cachedClasses);
  } else {
    const classes = variantwind(el.className)
      .split(" ")
      .filter((i: string) => !!i.trim());
    cache.set(el.className, classes);
    el.classList.add(...classes);
  }

  if (binding.value !== binding.oldValue) {
    if (cachedBindOldClasses) {
      el.classList.remove(...cachedBindOldClasses);
    } else {
      const bindOldClasses = variantwind(binding.oldValue || "")
        .split(" ")
        .filter((i: string) => !!i.trim());
      cache.set(binding.oldValue, bindOldClasses);
      el.classList.remove(...bindOldClasses);
    }
  }

  if (cachedBindClasses) {
    el.classList.add(...cachedBindClasses);
  } else {
    const bindClasses = variantwind(binding.value || "")
      .split(" ")
      .filter((i: string) => !!i.trim());
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
  directiveName: string | string[] = "variantwind"
) => {
  if (Array.isArray(directiveName)) {
    if (isVue3(app)) {
      directiveName.map((name) => app.directive(name, directive));
    } else {
      directiveName.map((name) => app.directive(name, directive2));
    }
  } else {
    if (isVue3(app)) {
      app.directive(directiveName, directive);
    } else {
      app.directive(directiveName, directive2);
    }
  }
};
