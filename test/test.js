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

const ND = require("../src/constants/nd.const").ND;

exports.TEST_TOKENS = {
  "1.0.0":
    "15f83eaffdd4f11119104883.b216bdab5f344b00b295878b47aca615.4257d9ff81dc247c4f1dc6563ef17bcac0ab01899f3690801d52dc85ba77551747a372b07b9ddbf0994fe7c6480b10b0224320bb92a7963e22b2714e99cda3444f578248e6de82c0609aa66514322e709179802be369f52882ab7bfdc210b463e23be219d53ecfe8055b18cf435b5928c706391bab6983533b35ba9e770f9374c841d0f0143399d065036d812768872fb731aa3fd7ca8a2bc88bcfa56cde709a713d49b139f7bb2ddda5f44ae925c365d3373f725fb80fad6c9fee2eb2ba6fd95ca650bfac73b9e0b04cab77abfdb36354c243e4dae94aad1674bef8698620d964b16aafad9a263ab5b284c6212c4d03153c8b86605f5ff7be922d421de84a0792ae79fa8f2f5351c90b14763737a8af9b41d20f37a9c31867693b4411f3c7ea9dd3cec3ae5056f7cd041533454d04272d7f1d1acc80075f3effda8b063aad7190a54069f1aee5c35045e4732dad2a5db69fc804b699250f0540249900ac36f9795a80387a4063537617081c95d6ff84343613164ba6145e1540502b0900151c26",
  "1.0.0-rc.1":
    "bad6743f37ccc4b7f99c28af.e35f3b3b229e5993aea585ee789038aa.8d5a2a6895d641a8669b0a506a6ee6af857af317e17f6f2100ae14cdcb309a622954b4de6b920d04e426a3fd90516b6579ba1526eb2d77ccbd810e2235f6955c39e5cc5842a98b8b9e4757551d3d70dc9f8be21f17e4263dbfcdc7d035e1d6cb34f2a41efc3cd534d0d91e8e8d97953597d97000be9519dbddf63ede53e49f2434164295348647c62ce0c3e4d00f4a3f3dec5151078443d5eac20adf6e4a272671c16509b5b0347fb4025b5d28db04c0006ae5bfc013e755ec609a79d88a489a6a3a20c4d5535400a1dda32dab01fbae5f6f2b5260bda822c1be5eb40387476a378522ccd293321f470f1b5cc8328136bae432b3598e7a299164ac6fab77c181add1dfef6d7e1a7e8f27a438a5d0802f636a26cce6a1576b171a20c5abb2093957018bbc23e783f16cfcdb2e48dc18d68af2359eef7d0e0aa2aa19536a6b1da5aee162e76c970f93a9c45b368849811cde7aa799da95b94742531b5550aee180023a297f603f85914fad9f64d31c5c8321a583a7522c9b1d02768a2d452c06f1f521c61e329dc48c",
  "1.0.0-rc.0":
    "b3afa8f0bf9a640dccd3cc4d.519b0853773b2963dfd4f09e9879b0e6.72778ce4a94c32c390792c01dfa594356601d9c2b75cf60828dc8bb14ec58ff6ccb2206836e62ad62934041449d041f488525de46caeb0975c63073ecdf9cd808195558c0c972e92b148e787d07cf893d9f1aa04c425748c2ed01f1df9e5ce452f2dc4270601191d5467883fbcff7e90fae2aeb347e6ccf57fac20601dec405de18ffe49b72c2f7d6ba9bc1bb92f2013267dd4280a864697da140587b3411f05b470f22116373fb57471c99c9b888ff256a7b894d7765232dc363a21badfb520ed03ddfb925b89e6420ce90d05932541857dbaf95818e66f25233d2e798c468aa372bea8818780ecbc5caaac6d946bc9d6817af6cb2d10e9aa18aa4c27e3edd7711e72c67b909acdc6df21672d2e55ddf271ad2106100a1185943db7595c57517b7981a0ef602cb6fba308d913e45750162028d6d61307ad80f74d03db1a201a82bdd730b534d345ad476be94c9149955065b59fd17001d4188bda1c5566bc030d333f6b0a41a83c6d533ebc92d277f09fcf768cc51cbcf68e0fa38283236296c8347956539effb2"
};

exports.TEST_TOKEN = TEST_TOKENS[ND.VERSION];
exports.TEST_NAME = "admin user admin@nd.com";

exports.TEST_NID = "1881939";
exports.TEST_NOVEL_NAME = "นิยายสำหรับทดสอบโปรแกรม";

exports.TEST_NID_V1 = "164129"; // have 2 chapter 1,2
exports.TEST_NOVEL_NAME_V1 = "เดือดสุดขั้ว รักเธอสุดหัวใจ";
