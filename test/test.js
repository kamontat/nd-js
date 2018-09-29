/**
 *
 * @param {any} object any object of property
 * @param {string} property property of the first param
 * @param {any} value mostly will be the function that will replace property
 */
exports.setProperty = (object, property, value) => {
  const originalProperty = Object.getOwnPropertyDescriptor(object, property);
  Object.defineProperty(object, property, { value });
  return originalProperty;
};
