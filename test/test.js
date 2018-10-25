/**
 * Mock the property of object
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

exports.TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE1NDAyMTk4MzgsIm5iZiI6MTU0MDIxOTgzOCwiZXhwIjoxNTcxNzc3NDM4LCJpc3MiOiJORC1KUyBtYXN0ZXIiLCJzdWIiOiJORC1KUyIsImp0aSI6IktDLVNLRSJ9.sezZTWbEUXBf3TwrpNl6I3EFow68TppazVOQoiEcJ88";
exports.TEST_NAME = "admin user admin@nd.com";
