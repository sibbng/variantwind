import Plugin, { variantwind } from ".";

export * from '.';
export default Plugin

export const extractor = (content: string) => {
  const match = variantwind(content);
  const extract = match !== content ? match.split(" ") : [];

  let directivishClasses: string[] = [];
  const matchEveryDirective =
    content.match(/(v-.+)=["'`](.+|[\s\S]+?)["'`]/g) || [];
  matchEveryDirective.map((val) => {
    const splitDirectiveNameAndWords = val.match(
      /([^'"\s&\=](\w|-)[^'"\s&\=]*)/g
    );
    if (splitDirectiveNameAndWords) {
      const [directive, ...classes] = splitDirectiveNameAndWords;
      const dottyDirective = directive.match(/\..+/);
      if (dottyDirective) {
        const variant = dottyDirective[0]
          .substr(1)
          .split(".")
          .map((val) => val + ":")
          .join("");
        classes.map((val) => {
          directivishClasses.push(variant + val);
        });
      }
    }
  });

  // Capture as liberally as possible, including things like `h-(screen-1.5)`
  const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

  // Capture classes within other delimiters like .block(class="w-1/2") in Pug
  const innerMatches =
    content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || [];

  return broadMatches.concat(innerMatches, extract, directivishClasses);
};