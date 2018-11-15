import "jest-extended";
import { CreateToken, VerifyToken } from "../token";
import { verify } from "jsonwebtoken";
import { UsernameValidator } from "../../models/security/UsernameValidator";
import { ND } from "../../constants/nd.const";
import { TEST_TOKEN, TEST_NAME } from "../../../test/test";
import { TokenValidator } from "../../models/security/TokenValidator";

describe("Token APIs", function() {
  describe("Creator", function() {
    test("Should create the token", function() {
      const token = CreateToken({
        username: "admin",
        fullname: TEST_NAME,
        versionrange: "1.0.0",
        issuedate: "1",
        expiredate: "1y"
      });

      expect(function() {
        verify(token, new UsernameValidator(TEST_NAME).key, {
          algorithms: [ND.ALGO],
          jwtid: ND.ID(),
          subject: "ND-JS"
        });
      }).not.toThrow();
    });
  });

  describe("Validation", function() {
    test("Should able to verify the token", function() {
      const token = TEST_TOKEN;

      expect(function() {
        const result = VerifyToken(new TokenValidator(token), new UsernameValidator(TEST_NAME));

        expect(result).not.toBeUndefined();
      }).not.toThrow();
    });

    test("Shouldn't get any result because wrong version", function() {
      const token = CreateToken({
        username: "admin",
        fullname: TEST_NAME,
        versionrange: "0.0.1",
        issuedate: "1",
        expiredate: "1y"
      });

      expect(function() {
        const result = VerifyToken(new TokenValidator(token), new UsernameValidator(TEST_NAME));

        expect(result).not.toBeUndefined();
      }).toThrow();
    });
  });
});
