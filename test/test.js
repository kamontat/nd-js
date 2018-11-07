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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoiMS4wLjAtcmMuMCIsInRva2VuIjoiMWY2M2I5MDhhODdlNGYwYWZjM2ZiYzA2OjE1ZjM2MDhlYTJhMzk1OTU1NDY4MzhiNTI0YWQ5OTYyOjBhIiwibmFtZSI6ImFkbWluIiwiaWF0IjoxNTQxNTkxODQ2LCJuYmYiOjE1NDE1OTE4NDYsImV4cCI6MTU3MzE0OTQ0NiwiaXNzIjoiTkQtSlMgbWFzdGVyIiwic3ViIjoiTkQtSlMiLCJqdGkiOiJORF9JRF9CQTNaZUpXZDdFUEdCNW52MHBFd0gwSm0ifQ.hIpgwu5EbAGyhitpC2Od0enmQWXsrnM8TY8GSf8WVLY";
exports.TEST_NAME = "admin user admin@nd.com";
