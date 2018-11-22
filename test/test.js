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
  "898cfa2d56aa46c765fbf1e6.91282c689f9828946c2b884b05c74baa.1a65363124cb07ad53c43cd4320093534ab25fac935deb8efdfa9c9da4d8a89dbb86e584d138fbac5c20ebbae0d68c59bc29349ad4016f17bb471a76832e6cfb32b95347a6005632b1bf65b3bc87bc5423fdc725c4d662036cd570fcf817873a2d5b99ad28dbca89e3b8a4acee3798e8fb0561b3c62536344c0dd27f68c4bc3523faaaa7c63dbe76751507cc72f7f76bbf1d3c224d9a8f68e20f3626cba32e66d093bd30c6ff92b53f0985196eb0040e6d89d4995cc065895eee04e9c3ad3590a5734c9bef013975e274628c8d8f844992f6e7d5df965f806a83bd1c89b71f41014f6c9a138696ca28372a809ca9303d6e478417c4e262a2508bbe7985ac3de5f8f9ff63f536f0818c4dda94f9276e4ccc69ebab0ec1bec130020d3190939cc6beb912d34dce28a4104e26c21d4934033dfcdb1680d818acda19c107ed891661ae9a06b01136ac0f9b5056dc1d1417265211899f6faff77d8eb8b01d9eb7a1cf7867dee772de19d3d4dbbae5d95e276e10a3d2ac0a07fe57116f3e2923130d6fcb";
exports.TEST_NAME = "admin user admin@nd.com";

exports.TEST_NID = "1881939";
exports.TEST_NOVEL_NAME = "นิยายสำหรับทดสอบโปรแกรม";

exports.TEST_NID_V1 = "164129"; // have 2 chapter 1,2
exports.TEST_NOVEL_NAME_V1 = "เดือดสุดขั้ว รักเธอสุดหัวใจ";
