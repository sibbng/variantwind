import type { App, ObjectDirective } from "vue";

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
  const classes = `${el.className} ${binding.value}`;
  const cached = cache.get(classes);
  if (cached) {
    el.className = cached;
  } else {
    const generated = variantwind(classes);
    cache.set(classes, generated);
    el.className = generated;
  }
};

export const directive: ObjectDirective = {
  beforeMount: process,
  updated: process,
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

export default (app: App, directiveName: string | string[] = "variantwind") => {
  if (Array.isArray(directiveName)) {
    directiveName.map((name) => app.directive(name, directive));
  } else {
    app.directive(directiveName, directive);
  }
};
