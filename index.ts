import type { App, ObjectDirective } from 'vue'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

function isTruthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export function variantwind(className: string) {
  let plainClasses = className

  // Array of blocks, e.g. ["lg:{bg-red-500 hover:bg-red-900}"]
  const blocks = className.match(/\w*:\{(.*?)\}/g)

  if (!blocks) {
    return plainClasses
  }

  const processedClasses = blocks
    .map((block) => {
      plainClasses = plainClasses.replace(block, '').trim()
      const [variant, classes] = block.split(/:(.+)/)

      const withVariants = classes
        .replace(/\{|\}/g, '')
        .replace(' ', ' ' + variant + ':')

      return withVariants.startsWith(variant)
        ? withVariants
        : variant + ':' + withVariants
    })
    .join(' ')

  return plainClasses + ' ' + processedClasses
}

export const directive: ObjectDirective = {
  beforeMount(el) {
    el.className = variantwind(el.className)
  },
  updated(el) {
    el.className = variantwind(el.className)
  },
}

export const extractor = (content: string) => {
  let extract = [];
  const match = content.match(/[^<]*[^>]/g)
  
  if (match) {
    extract = match
      .map((item) => item.match(/\w*:\{(.*?)\}/g))
      .filter(isTruthy)
      .flatMap((classes) => variantwind(classes.join(' ')).trim().split(' '))
  }

  // Capture as liberally as possible, including things like `h-(screen-1.5)`
  const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

  // Capture classes within other delimiters like .block(class="w-1/2") in Pug
  const innerMatches =
    content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || []

  return broadMatches.concat(innerMatches, extract)
}

export default (app: App, directiveName = 'variantwind') => {
  app.directive(directiveName, directive)
}
