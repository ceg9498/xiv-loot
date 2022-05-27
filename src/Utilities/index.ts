/**
 * Indexing Objects in Typescript:
 * https://dev.to/mapleleaf/indexing-objects-in-typescript-1cgi
 */
function hasKey<O>(obj:O, key:PropertyKey): key is keyof O {
  return key in obj;
}

export { hasKey };